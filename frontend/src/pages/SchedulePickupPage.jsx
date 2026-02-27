import { useEffect, useState } from "react";
import axios from "axios";

export default function SchedulePickupPage() {
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  const fetchData = async ()=>{
    try{
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/pickups");
      setData(res.data);
      setError("");
    }catch(err){
      setError("Failed to load pickups");
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);

  const markComplete = async(id)=>{
    try{
      await axios.put(`http://localhost:3000/api/pickups/${id}/complete`);
      fetchData();
    }catch(err){
      console.error(err);
      alert("Error updating status");
    }
  };

  // LOADING
  if(loading)
    return <h2 className="p-10 text-center">Loading pickups...</h2>;

  // ERROR
  if(error)
    return <h2 className="p-10 text-center text-red-600">{error}</h2>;

  // EMPTY
  if(data.length===0)
    return (
      <h2 className="p-10 text-center text-gray-500">
        No pickups scheduled yet.
      </h2>
    );

    const deletePickup = async (id) => {
  const confirmDelete = window.confirm("Do you want to delete this schedule?");

  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:3000/api/pickups/${id}`);
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Error deleting pickup");
  }
};
  return (
    <div className="min-h-screen bg-gray-50 items-center justify-center p-4 w-full">

   <h3 className="text-center text-xl font-bold ">Schedule Pickup History</h3>

    <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">

      {data.map(item=>(
        <div key={item._id}
          className="bg-white shadow rounded-xl p-5 border hover:shadow-lg transition">

          {/* City + Status */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg">{item.city}</h2>

            <span className={`px-2 py-1 text-xs rounded
              ${item.status==="Closed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"}`}>
              {item.status || "Open"}
            </span>
          </div>

          <p className="text-gray-600">{item.address}</p>

          <p className="mt-2">
            <span className="font-semibold">Date:</span> {item.date}
          </p>

          <p>
            <span className="font-semibold">Time:</span> {item.timeSlot}
          </p>

          {/* Waste Types */}
          <div className="mt-3">
            <p className="font-semibold">Waste Types:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.wasteTypes?.map(type=>(
                <span
                  key={type}
                  className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <p className="mt-3 text-gray-500 italic">
              {item.notes}
            </p>
          )}

          {/* Action Buttons */}

  {item.status !== "Closed" && (
    <button
      onClick={() => markComplete(item._id)}
      className=" m-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-400 cursor-pointer hover:text-blue-600">
      Mark as Closed
    </button>
  )}

  <button
    onClick={() => deletePickup(item._id)}
    className="m-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-400 cursor-pointer hover:text-blue-600">
    Delete Schedule
  </button>
</div>
      ))}

    </div>
     </div>
  );
}