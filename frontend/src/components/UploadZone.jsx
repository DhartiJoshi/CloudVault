import { useState } from "react";
import { UploadCloud } from "lucide-react";

function UploadZone({ onUploadSuccess }) {

  const [dragging, setDragging] = useState(false);

  // Upload Function
  const upload = async (file) => {

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      const message = await response.text();

      alert(message);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {

      console.error(error);
      alert("Upload failed!");

    }

  };

  // Click Upload
  const uploadFile = (event) => {
    upload(event.target.files[0]);
  };

  // Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    const file = e.dataTransfer.files[0];

    upload(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md mt-8 p-8">

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition duration-300 ${
          dragging
            ? "border-blue-600 bg-blue-100"
            : "border-blue-400 hover:bg-blue-50"
        }`}
      >

        <UploadCloud
          size={60}
          className="mx-auto text-blue-600"
        />

        <h2 className="text-2xl font-bold mt-5">
          Upload Files
        </h2>

        <p className="text-gray-500 mt-2">
          Drag & Drop files here or click below
        </p>

        <input
          type="file"
          id="fileUpload"
          hidden
          onChange={uploadFile}
        />

        <label
          htmlFor="fileUpload"
          className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl cursor-pointer hover:bg-blue-700 transition"
        >
          Upload File
        </label>

      </div>

    </div>
  );
}

export default UploadZone;