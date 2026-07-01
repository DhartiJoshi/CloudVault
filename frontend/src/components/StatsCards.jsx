// StatsCards

import { HardDrive, Files, Server } from "lucide-react";

function StatsCards({ files }) {

  // Total storage in MB
  const totalStorage = files.reduce(
    (sum, file) => sum + file.size,
    0
  );

  // Assume max storage = 1000 MB (1 GB)
  const maxStorage = 1000;

  const percentage = Math.min(
    (totalStorage / maxStorage) * 100,
    100
  );

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">

      {/* Storage */}
      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

        <HardDrive className="text-blue-600" size={35} />

        <h2 className="text-2xl font-bold mt-4">
          {totalStorage.toFixed(2)} MB
        </h2>

        <p className="text-gray-500">
          Storage Used
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />

        </div>

      </div>

      {/* Files */}
      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

        <Files className="text-green-600" size={35} />

        <h2 className="text-2xl font-bold mt-4">
          {files.length}
        </h2>

        <p className="text-gray-500">
          Total Files
        </p>

      </div>

      {/* Nodes */}
      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

        <Server className="text-purple-600" size={35} />

        <h2 className="text-2xl font-bold mt-4">
          3/3
        </h2>

        <p className="text-gray-500">
          Active Nodes
        </p>

      </div>

    </div>
  );
}

export default StatsCards;