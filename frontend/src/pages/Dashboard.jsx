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

  if (!data) return <p className="p-10">Loading dashboard...</p>;

  const stats = data.stats || {};
  const pickups = data.pickups || [];
  const breakdown = data.breakdown || [];

  return (
    <div className="flex w-full h-full bg-gray-100 dark:bg-gray-900 transition-colors">

      {/* Main */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>

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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 transition-colors">
            <h2 className="font-semibold mb-3 text-gray-800 dark:text-white">Upcoming Pickups</h2>
            <table className="w-full text-sm text-gray-600 dark:text-gray-300">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Address</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {pickups.map((p,i)=>(
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="py-2">{p.date}</td>
                    <td className="py-2">{p.address}</td>
                    <td className="py-2">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                         p.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                         p.status === 'Pending' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                         'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                       }`}>
                         {p.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 transition-colors">
            <h2 className="font-semibold mb-3 text-gray-800 dark:text-white">Recycling Breakdown</h2>

            {breakdown.map((b,i)=>(
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400 font-medium">
                  <span>{b.type}</span>
                  <span>{b.percent}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded transition-all duration-1000"
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
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow text-center border dark:border-gray-700 transition-colors">
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white leading-none">{value}</h2>
    </div>
  );
}
