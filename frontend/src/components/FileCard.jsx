import {
  Download,
  Trash2,
  FileText,
  FileImage,
  FileArchive,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";

function FileCard({ name, size, type, onDelete }) {

  // Decide icon based on file type
  const getFileIcon = () => {
    const ext = type.toLowerCase();

    if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext))
      return <FileImage className="text-pink-600" size={28} />;

    if (["pdf"].includes(ext))
      return <FileText className="text-red-600" size={28} />;

    if (["doc", "docx"].includes(ext))
      return <FileText className="text-blue-700" size={28} />;

    if (["xls", "xlsx", "csv"].includes(ext))
      return <FileSpreadsheet className="text-green-600" size={28} />;

    if (["zip", "rar", "7z"].includes(ext))
      return <FileArchive className="text-yellow-600" size={28} />;

    if (["mp4", "mov", "avi", "mkv"].includes(ext))
      return <FileVideo className="text-purple-600" size={28} />;

    if (["mp3", "wav", "aac"].includes(ext))
      return <FileAudio className="text-orange-600" size={28} />;

    if (["js", "jsx", "ts", "tsx", "go", "py", "java", "cpp", "c"].includes(ext))
      return <FileCode className="text-cyan-600" size={28} />;

    return <FileText className="text-blue-600" size={28} />;
  };

  // DOWNLOAD
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/download?name=${encodeURIComponent(name)}`
      );

      if (!res.ok) {
        const text = await res.text();
        alert(text);
        return;
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Download failed!");
    }
  };

  // DELETE
  const handleDelete = async () => {

    const ok = window.confirm(`Delete "${name}" ?`);

    if (!ok) return;

    try {

      const res = await fetch(
        `http://localhost:8080/delete?name=${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        }
      );

      const message = await res.text();

      alert(message);

      if (onDelete) {
        onDelete();
      }

    } catch (err) {

      console.error(err);
      alert("Delete failed!");

    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:scale-[1.01] transition flex justify-between items-center">

      <div className="flex items-center gap-4">

        <div className="bg-gray-100 p-4 rounded-xl">
          {getFileIcon()}
        </div>

        <div>
          <h3 className="font-bold text-lg">{name}</h3>

          <p className="text-gray-500 text-sm">
            {type} • {size}
          </p>
        </div>

      </div>

      <div className="flex gap-3">

        <button
          onClick={handleDownload}
          className="bg-blue-100 hover:bg-blue-200 p-3 rounded-xl transition"
        >
          <Download className="text-blue-600" size={20} />
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-100 hover:bg-red-200 p-3 rounded-xl transition"
        >
          <Trash2 className="text-red-600" size={20} />
        </button>

      </div>

    </div>
  );
}

export default FileCard;