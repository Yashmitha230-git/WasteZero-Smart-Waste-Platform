import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FiMapPin, FiClock, FiStar, FiArrowRight } from "react-icons/fi";

// ─── Role badge colours (same as Dashboard.jsx) ───────────────────────────────
const roleColors = {
  admin:     "bg-purple-100 text-purple-700 border-purple-300",
  ngo:       "bg-blue-100 text-blue-700 border-blue-300",
  volunteer: "bg-green-100 text-green-700 border-green-300",
  user:      "bg-gray-100 text-gray-700 border-gray-300",
};

export default function VolunteerDashboard() {
  const navigate = useNavigate();

  // ── shared dashboard data (stats / pickups / breakdown) ──────────────────
  const [data, setData] = useState(null);

  // ── top-match opportunities ───────────────────────────────────────────────
  const [topMatches, setTopMatches]     = useState([]);
  const [matchLoading, setMatchLoading] = useState(true);
  const [matchError, setMatchError]     = useState("");

  // ── user info from localStorage ───────────────────────────────────────────
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();
  const userName = storedUser?.name || "Volunteer";
  const userRole = storedUser?.role  || "volunteer";

  // ── fetch shared dashboard stats (same as Dashboard.jsx) ─────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setData(res.data);
      } catch (err) {
        console.log("Dashboard error:", err.response?.data || err.message);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── fetch top-matched opportunities ──────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/api/opportunity/matches/top", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTopMatches(res.data);
        setMatchLoading(false);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.response?.data?.error;
        setMatchError(msg || "");
        setMatchLoading(false);
      });
  }, []);

  // ── helpers ───────────────────────────────────────────────────────────────
  const scoreBadge = (score) => {
    if (score >= 4) return "bg-green-100 text-green-700";
    if (score >= 2) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  const imageUrl = (img) => {
    if (!img) return "https://placehold.co/400x160?text=No+Image";
    const clean = img.replace(/^\/+/, "");
    return clean.startsWith("uploads")
      ? `http://localhost:3000/${clean}`
      : `http://localhost:3000/uploads/${clean}`;
  };

  // ── stats / pickups / breakdown ───────────────────────────────────────────
  const stats     = data?.stats     || {};
  const pickups   = data?.pickups   || [];
  const breakdown = data?.breakdown || [];

  if (!data) return <p className="p-10 text-center">Loading dashboard...</p>;

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
        <div className="flex-1 p-6 space-y-6">

          {/* ── Welcome Banner ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow px-6 py-4 border border-gray-100">
            <div>
              <p className="text-sm text-gray-400 mb-0.5">Welcome back 👋</p>
              <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
            </div>
            <span className={`capitalize text-sm font-semibold px-4 py-1.5 rounded-full border ${roleColors[userRole] || roleColors.user}`}>
              {userRole}
            </span>
          </div>

          {/* ── Stats Cards ────────────────────────────────────────────── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card title="Total Pickups"   value={stats.totalPickups   || 0} />
            <Card title="Recycled Items"  value={stats.recycledItems  || 0} />
            <Card title="CO2 Saved"       value={stats.co2Saved       || 0} />
            <Card title="Volunteer Hours" value={stats.volunteerHours || 0} />
          </div>

          {/* ── TOP MATCH OPPORTUNITIES ────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow border p-6">

            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <FiStar className="text-yellow-500 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Top Match Opportunities
                </h3>
              </div>
              <button
                onClick={() => navigate("/opportunities")}
                className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium transition"
              >
                View All <FiArrowRight />
              </button>
            </div>

            {/* Loading spinner */}
            {matchLoading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
              </div>
            )}

            {/* Error */}
            {!matchLoading && matchError && (
              <p className="text-center text-red-500 text-sm py-6">{matchError}</p>
            )}

            {/* Empty state */}
            {!matchLoading && !matchError && topMatches.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm mb-1">No matches found yet.</p>
                <p className="text-gray-400 text-xs">
                  Update your{" "}
                  <span
                    className="text-green-600 cursor-pointer underline"
                    onClick={() => navigate("/my-profile")}
                  >
                    profile skills and location
                  </span>{" "}
                  to get personalised matches.
                </p>
              </div>
            )}

            {/* Match cards grid */}
            {!matchLoading && !matchError && topMatches.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {topMatches.map((opp) => (
                  <div
                    key={opp._id}
                    className="border rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer group"
                    onClick={() => navigate(`/opportunity/${opp._id}`)}
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={imageUrl(opp.image)}
                        alt={opp.title}
                        className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${scoreBadge(opp.matchScore)}`}>
                        ⭐ Match {opp.matchScore}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                        {opp.title}
                      </h4>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                        {opp.description}
                      </p>

                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        {opp.location && (
                          <span className="flex items-center gap-1">
                            <FiMapPin className="text-green-500" />
                            {opp.location}
                          </span>
                        )}
                        {opp.duration && (
                          <span className="flex items-center gap-1">
                            <FiClock className="text-blue-500" />
                            {opp.duration}
                          </span>
                        )}
                      </div>

                      <button
                        className="mt-4 w-full text-xs bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/opportunity/${opp._id}`);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Recent Pickups + Recycling Breakdown ───────────────────── */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Pickups Table */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold mb-3">Recent Pickups</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Address</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickups.map((p, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-3">{p.date}</td>
                        <td className="py-3">{p.address}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            p.status === "Accepted" ? "bg-green-100 text-green-700" :
                            p.status === "Pending"  ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {pickups.length === 0 && (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-gray-500">
                          No pickups found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recycling Breakdown */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold mb-3">Recycling Breakdown</h2>
              {breakdown.map((b, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between text-sm">
                    <span>{b.type}</span>
                    <span>{b.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded mt-1">
                    <div
                      className="bg-green-500 h-2 rounded transition-all duration-500"
                      style={{ width: `${b.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
    </div>
  );
}

// ─── Reusable stat card ───────────────────────────────────────────────────────
function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold mt-2 text-green-600">{value}</h2>
    </div>
  );
}
