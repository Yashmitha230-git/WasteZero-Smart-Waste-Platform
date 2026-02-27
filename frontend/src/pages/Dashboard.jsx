import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/dashboard");
        setData(res.data);
      } catch (err) {
        console.log("Dashboard error:", err.response?.data || err.message);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);

  }, []);

  if (!data) return <p className="p-10">Loading dashboard...</p>;

  const stats = data.stats || {};
  const pickups = data.pickups || [];
  const breakdown = data.breakdown || [];

  return (
    <div className="flex w-full min-h-screen bg-gray-100">

      {/* Main */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card title="Total Pickups" value={stats.totalPickups || 0}/>
          <Card title="Recycled Items" value={stats.recycledItems || 0}/>
          <Card title="CO2 Saved" value={stats.co2Saved || 0}/>
          <Card title="Volunteer Hours" value={stats.volunteerHours || 0}/>
        </div>

        {/* Bottom */}
        <div className="mx-30 grid lg:grid-cols-2 gap-6 mt-6">

          {/* Table */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-3">Upcoming Pickups</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>Date</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pickups.map((p,i)=>(
                  <tr key={i} className="border-b">
                    <td>{p.date}</td>
                    <td>{p.address}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
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
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
