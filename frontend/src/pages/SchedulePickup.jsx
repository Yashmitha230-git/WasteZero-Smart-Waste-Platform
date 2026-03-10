import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"

const SchedulePickup = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    address:"",
    city:"",
    date:"",
    timeSlot:"",
    wasteTypes:[],
    notes:""
  });

  const wasteOptions = [
    ["Plastic","Paper"],
    ["Glass","Metal"],
    ["Electronic Waste","Organic Waste"],
    ["Other"]
  ];

  const handleChange = e =>{
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleCheckbox = value =>{
    setFormData(prev=>{
      const exists = prev.wasteTypes.includes(value);
      return {
        ...prev,
        wasteTypes: exists
          ? prev.wasteTypes.filter(v=>v!==value)
          : [...prev.wasteTypes,value]
      };
    });
  };

 const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:3000/api/pickups",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Pickup Scheduled Successfully");
    console.log(res.data);

  } catch (err) {
    console.error(err);
    toast.error("Error scheduling pickup");
  }
};

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 w-full">
       
       
       
        <div>
        
        <h2 className="text-2xl font-bold text-center">Schedule Pickup</h2>
        <h3 className="text-center">Request waste collection and manage your pickups.</h3>
         <div className="absolute right-0 top-0">
      <button
        onClick={() => navigate("/schedule-page")}
        className="bg-green-600 text-white m-15 px-5 py-2 rounded-full hover:bg-gray-400 cursor-pointer hover:text-blue-600">
        History
      </button>
    </div>
  
        <div className="border p-9 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ">
      {step===1 ? (
        <div className="space-y-4 w-120  ">
          <h2 className="font-bold text-xl">Request Waste Collection</h2>
          <h3 className="text-center">Fill in the details to schedule a pickup for your recyclable waste.</h3>
          <label className="font-bold">Address</label>
          <input name="address" placeholder="Address"
            onChange={handleChange}
            className="border p-2 w-full rounded-xl"/>
          <label className="font-bold">City</label>
          <input name="city" placeholder="City"
            onChange={handleChange}
            className="border p-2 w-full rounded-xl"/>
          <label className="font-bold">Date</label>
          <input type="date" name="date"
            onChange={handleChange}
            className="border p-2 w-full rounded-xl"/>
          <label className="font-bold">Preferred Time Slot</label>
          <select name="timeSlot"
            onChange={handleChange}
            className="border p-2 w-full rounded-xl">
            <option value="">Select Time</option>
            <option>09–12</option>
            <option>12–03</option>
            <option>03–06</option>
          </select>

          <button onClick={()=>setStep(2)}
            className="bg-green-600 text-white px-4 py-2  justify-center rounded hover:bg-gray-400 cursor-pointer hover:text-blue-600">
            Next
          </button>

        </div>
      ) : (
        <div className="space-y-4 w-120">
          <h2 className="text-center font-bold text-xl">Request Waste Collection</h2>
          <h3 className="text-center">Fill in the details to schedule a pickup for your recyclable waste.</h3>
          {wasteOptions.flat().map(opt=>(
            <label key={opt} className="block">
              <input type="checkbox"
                onChange={()=>handleCheckbox(opt)}
              /> {opt}
            </label>
          ))}
          <label className="font-bold ">Additional Notes</label>
          <textarea
            name="notes"
            placeholder="Any special instructions or information about your waste"
            onChange={handleChange}
            className="border p-2 w-full rounded-xl"/>

          <div className="flex gap-4 ">
            <button className="bg-blue-600 rounded text-white px-4 py-2 hover:bg-gray-400 cursor-pointer hover:text-blue-600" onClick={()=>setStep(1)}>Back</button>

            <button onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-gray-400 cursor-pointer hover:text-blue-600">
              Submit
            </button>
          </div>

        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default SchedulePickup;