import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
       const res = await axios.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setData(res.data);
      } catch (err) {
        console.log("Dashboard error:", err.response?.data || err.message);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);

  }, []);

  if (!data) return <p className="p-10 text-center">Loading dashboard...</p>;

  const stats = data.stats || {};
  const pickups = data.pickups || [];
  const breakdown = data.breakdown || [];

  return (
    <div className="flex w-full min-h-screen bg-gray-100">

      {/* Main */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card title="Total Pickups" value={stats.totalPickups || 0}/>
          <Card title="Recycled Items" value={stats.recycledItems || 0}/>
          <Card title="CO2 Saved" value={stats.co2Saved || 0}/>
          <Card title="Volunteer Hours" value={stats.volunteerHours || 0}/>
        </div>

        {/* Bottom */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">

          {/* Table */}
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
                    {pickups.map((p,i)=>(
                    <tr key={i} className="border-b">
                        <td className="py-3">{p.date}</td>
                        <td className="py-3">{p.address}</td>
                        <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                p.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                                p.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {p.status}
                            </span>
                        </td>
                    </tr>
                    ))}
                    {pickups.length === 0 && (
                        <tr>
                            <td colSpan="3" className="py-4 text-center text-gray-500">No pickups found</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-3">Recycling Breakdown</h2>

            {breakdown.map((b,i)=>(
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

function Card({title,value}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold mt-2 text-green-600">{value}</h2>
    </div>
  );
}
