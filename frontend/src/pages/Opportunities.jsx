import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function OpportunitiesPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/api/opportunity",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchData();

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setRole(user?.role);
    setUserId(user?._id);
  }
}, []);

  const filtered = data.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (status === "All" || item.status === status)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Volunteer Opportunities</h1>
          <p className="text-sm text-gray-500">
            Browse and join recycling initiatives
          </p>
        </div>

        {(role === "ngo") && (
          <button
            onClick={() => navigate("/create-opportunity")}
            className="flex items-center gap-2 bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <FiPlus />
            Create Opportunity
          </button>
        )}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center bg-white border rounded-lg px-3 w-full md:w-1/2 shadow-sm">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            className="w-full px-2 py-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-2 bg-white shadow-sm w-full md:w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map(o => {
          const isApplied = o.applicants?.some(
  (app) => app.user === userId
); // Check if user applied

            return (
              <div
                key={o._id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition relative"
              >
                {/* Applied Badge */}
                {isApplied && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full z-10">
                    Applied
                  </span>
                )}

                <img
                  src={`http://localhost:3000/${
                    o.image.replace(/^\/+/, "").startsWith("uploads")
                      ? o.image.replace(/^\/+/, "")
                      : "uploads/" + o.image
                  }`}
                  alt={o.title}
                  className="h-44 w-full object-cover rounded-t-2xl"
                />

                <div className="p-4">
                  <h2 className="font-semibold text-lg">{o.title}</h2>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {o.description}
                  </p>

                  <button
                    onClick={() => navigate(`/opportunity/${o._id}`)}
                    className="mt-5 w-full bg-green-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No opportunities found.
          </p>
        )}
      </div>
    </div>
  );
}