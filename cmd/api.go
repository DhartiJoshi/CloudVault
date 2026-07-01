package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// FileInfo represents uploaded file metadata
type FileInfo struct {
	Name string `json:"name"`
	Size int64  `json:"size"`
}

// In-memory registry of uploaded files
var uploadedFiles []FileInfo

func startAPI() {

	// Load saved metadata on startup
	loadMetadata()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Welcome to CloudVault API 🚀")
	})

	// =========================
	// GET FILES
	// =========================
	http.HandleFunc("/files", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Content-Type", "application/json")

		if r.Method != http.MethodGet {
			http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
			return
		}

		json.NewEncoder(w).Encode(uploadedFiles)
	})

	// =========================
	// DOWNLOAD
	// =========================
	http.HandleFunc("/download", downloadHandler)

	// =========================
	// DELETE
	// =========================
	http.HandleFunc("/delete", deleteHandler)

	// =========================
	// UPLOAD
	// =========================
	http.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		uploadHandler(w, r)
	})

	log.Println("API running at http://localhost:8080")

	go func() {
		log.Fatal(http.ListenAndServe(":8080", nil))
	}()
}

// ===============================
// UPLOAD
// ===============================
func uploadHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Only POST requests are allowed", http.StatusMethodNotAllowed)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "No file uploaded", http.StatusBadRequest)
		return
	}
	defer file.Close()

	err = server.Store(header.Filename, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	uploadedFiles = append(uploadedFiles, FileInfo{
		Name: header.Filename,
		Size: header.Size,
	})

	saveMetadata()

	fmt.Fprintf(w, "File %s uploaded successfully!", header.Filename)
}

// ===============================
// DOWNLOAD
// ===============================
func downloadHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	fileName := r.URL.Query().Get("name")
	if fileName == "" {
		http.Error(w, "missing file name", http.StatusBadRequest)
		return
	}

	reader, err := server.Get(fileName)
	if err != nil {
		http.Error(w, "file not found: "+err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Disposition", "attachment; filename=\""+fileName+"\"")
	w.Header().Set("Content-Type", "application/octet-stream")

	_, err = io.Copy(w, reader)
	if err != nil {
		http.Error(w, "download failed: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

// ===============================
// DELETE
// ===============================
func deleteHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodDelete {
		http.Error(w, "Only DELETE allowed", http.StatusMethodNotAllowed)
		return
	}

	fileName := r.URL.Query().Get("name")
	if fileName == "" {
		http.Error(w, "Missing file name", http.StatusBadRequest)
		return
	}

	// remove from memory safely
	index := -1
	for i, file := range uploadedFiles {
		if file.Name == fileName {
			index = i
			break
		}
	}

	if index != -1 {
		uploadedFiles = append(uploadedFiles[:index], uploadedFiles[index+1:]...)
		saveMetadata()
	}

	fmt.Fprintln(w, "File deleted successfully")
}

// ===============================
// METADATA SAVE
// ===============================
func saveMetadata() {

	data, err := json.MarshalIndent(uploadedFiles, "", "  ")
	if err != nil {
		log.Println("save error:", err)
		return
	}

	err = os.WriteFile("metadata.json", data, 0644)
	if err != nil {
		log.Println("write error:", err)
	}
}

// ===============================
// METADATA LOAD
// ===============================
func loadMetadata() {

	data, err := os.ReadFile("metadata.json")
	if err != nil {
		return
	}

	err = json.Unmarshal(data, &uploadedFiles)
	if err != nil {
		log.Println("load error:", err)
	}
}