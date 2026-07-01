import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import UploadZone from "./components/UploadZone";
import FileCard from "./components/FileCard";
import NodeStatus from "./components/NodeStatus";
import Footer from "./components/Footer";

function App() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:8080/files");

      const formatted = res.data.map((file) => ({
        name: file.name,
        size: file.size / 1024 / 1024,
        type: file.name.split(".").pop().toUpperCase(),
      }));

      setFiles(formatted);
    } catch (err) {
      console.log("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Filter files according to search text
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100">

      <Navbar
        search={search}
        setSearch={setSearch}
      />

      <main className="max-w-7xl mx-auto px-8 py-8">

        <StatsCards files={files} />

        <UploadZone onUploadSuccess={fetchFiles} />

        <section className="mt-10">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
              Your Files
            </h2>

            <button
              onClick={fetchFiles}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-5">

            {filteredFiles.length === 0 ? (
              <p className="text-gray-500">
                No matching files found.
              </p>
            ) : (
              filteredFiles.map((file, index) => (
                <FileCard
                  key={index}
                  name={file.name}
                  size={`${file.size.toFixed(2)} MB`}
                  type={file.type}
                  onDelete={fetchFiles}
                />
              ))
            )}

          </div>

        </section>

        <NodeStatus />

      </main>

      <Footer />
    </div>
  );
}

export default App;