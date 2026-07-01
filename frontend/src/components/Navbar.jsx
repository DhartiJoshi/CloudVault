import { Cloud, Search } from "lucide-react";

function Navbar({ search, setSearch }) {
  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Cloud className="text-blue-600" size={34} />

          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              CloudVault
            </h1>

            <p className="text-xs text-gray-500">
              Distributed Cloud Storage
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-gray-100 px-4 py-3 rounded-xl w-[450px]">
          <Search className="text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none ml-2 w-full"
          />
        </div>

      </div>
    </nav>
  );
}

export default Navbar;