import { Server } from "lucide-react";

function NodeStatus() {

  const nodes = [
    { name: "Node 3000", status: "Online" },
    { name: "Node 4000", status: "Online" },
    { name: "Node 5000", status: "Online" },
  ];

  return (

    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-5">
        Storage Nodes
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {nodes.map((node, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
          >

            <Server
              className="text-green-600 mb-4"
              size={34}
            />

            <h3 className="font-bold text-lg">
              {node.name}
            </h3>

            <p className="text-green-600 mt-2 font-semibold">
              ● {node.status}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}

export default NodeStatus;