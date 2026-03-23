import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPlus, FiUsers, FiTrendingUp, FiGlobe, FiLayers, FiList } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const NGOStatsConfig = [
    { title: "Active Opportunities", key: "totalPickups", icon: <FiLayers />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Volunteers", key: "volunteerHours", icon: <FiUsers />, color: "text-green-600", bg: "bg-green-50" },
    { title: "Material Impact", key: "recycledItems", icon: <FiTrendingUp />, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Global Reach", key: "co2Saved", icon: <FiGlobe />, color: "text-orange-600", bg: "bg-orange-50" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("NGO Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="text-gray-500 font-medium animate-pulse">Loading NGO analytics...</p>
          </div>
      );
  }

  const stats = data?.stats || {};
  const pickups = data?.pickups || [];
  const breakdown = data?.breakdown || [];

  return (
    <div className="space-y-10">
      {/* ── NGO Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">NGO Command Center</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium italic">Empowering {storedUser.name} to change the world.</p>
        </div>
        <button 
          onClick={() => navigate("/create-opportunity")}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-900/10 flex items-center space-x-3 active:scale-95"
        >
          <FiPlus className="text-xl" />
          <span>Launch New Initiative</span>
        </button>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {NGOStatsConfig.map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-xl transition-all"
          >
            <div className={`${stat.bg} ${stat.color} dark:bg-opacity-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.title}</p>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stats[stat.key] || 0}</h2>
          </motion.div>
        ))}
      </div>

      {/* ── Dashboard Layout ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Recent Applications/Pickups */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center space-x-3 tracking-tight">
               <FiList className="text-indigo-600 dark:text-indigo-400" />
               <span>Pending Pickup Requests</span>
            </h2>
            <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                  <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <th className="px-8 py-4">Requester</th>
                    <th className="px-8 py-4">Location</th>
                    <th className="px-8 py-4">Material</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                   {pickups.length > 0 ? pickups.map((p, i) => (
                     <tr key={i} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-500 uppercase">{p.date?.charAt(0)}</div>
                             <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.address.split(',')[0]}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-400 font-medium truncate max-w-[150px]">{p.address}</td>
                        <td className="px-8 py-5 font-black text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-widest">General Waste</td>
                        <td className="px-8 py-5">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                p.status === 'Accepted' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                           }`}>
                             {p.status}
                           </span>
                        </td>
                     </tr>
                   )) : (
                     <tr>
                        <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No pending requests to manage.</td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="space-y-6">
           <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-indigo-100 dark:shadow-none transition-all">
              <h3 className="text-xl font-bold">Material Impact</h3>
              <p className="text-indigo-200 text-sm leading-relaxed">Your organization is currently leading in <strong>Plastic Waste</strong> reduction in this region.</p>
              
              <div className="space-y-6 pt-4">
                 {breakdown.length > 0 ? breakdown.map((item, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-300">
                        <span>{item.type}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          className="h-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                        />
                      </div>
                   </div>
                 )) : (
                   <p className="text-indigo-400 text-xs text-center py-4">No data available yet.</p>
                 )}
              </div>
           </div>

           <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-all">
              <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[10px]">Community Outreach</h3>
              <div className="flex items-center space-x-4">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 border-4 border-white dark:border-gray-800 rounded-full bg-gray-200 dark:bg-gray-700 shadow-xl" />)}
                 </div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter tracking-widest">+124 Volunteers</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
