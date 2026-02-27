import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiMapPin, FiCalendar, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function OpportunitiesPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    axios.get("http://localhost:3000/api/opportunity")
      .then(res => {
        console.log("DATA:", res.data); // debug
        setData(res.data);
      })
      .catch(err => console.log("ERROR:", err));
  }, []);

  const navigate = useNavigate()

  const filtered = data.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (status === "All" || item.status === status)
  );



  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Volunteer Opportunities</h1>
          <p className="text-sm text-gray-500">
            Browse and join recycling and waste management initiatives
          </p>
        </div>

        <button onClick={() => navigate("/create-opportunity")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
          <FiPlus />
          Create Opportunity
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">

        {/* Search */}
        <div className="flex items-center bg-white border rounded-lg px-3 w-200">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            className="w-full px-2 py-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <select
          className="border rounded-lg px-3 py-2 bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>Open</option>
          <option>Closed</option>
        </select>

      </div>

      {/* CARDS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filtered.map(o => (
          <div
            key={o._id}
            className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition"
          >

            {/* IMAGE */}
            <img
              src={`http://localhost:3000/${o.image.replace(/^\/+/, "").startsWith("uploads")
                ? o.image.replace(/^\/+/, "")
                : "uploads/" + o.image}`}
              alt={o.title}
              className="h-44 w-full object-cover rounded-t-2xl"
            />
            {/* <p className="text-xs">{o.image}</p> */}
            {/* BODY */}
            <div className="p-4">

              {/* TITLE + STATUS */}
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{o.title}</h2>

                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  {o.status || "Open"}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {o.description}
              </p>

              {/* INFO */}
              <div className="text-sm text-gray-500 mt-4 space-y-1">

                <div className="flex items-center gap-2">
                  <FiCalendar />
                  <span>{o.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiMapPin />
                  <span>{o.location}</span>
                </div>

                {o.duration && (
                  <p>⏱ {o.duration}</p>
                )}
              </div>

              {/* BUTTON */}
              <button
                onClick={() => navigate(`/opportunity/${o._id}`)}
                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
              >
                View Details
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
