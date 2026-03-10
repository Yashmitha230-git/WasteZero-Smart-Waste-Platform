import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [role, setRole] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Fetch opportunity
    axios.get(`/api/opportunity/${id}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));

    // Get role
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("Stored user:", user);
      console.log("Role is:", user?.role);
      setRole(user?.role);
    }
  }, [id]);



useEffect(() => {
  // Check if user has applied
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setRole(user.role);

    if (
  data?.applicants?.some(
    (app) => app.user === user._id
  )
) {
  setApplied(true);
}
  }
}, [data]);

  if (!data) return <p className="p-6">Loading...</p>;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?"))
      return;

    try {
      await axios.delete(`/api/opportunity/${data._id}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
      toast.success("Deleted successfully");
      navigate("/opportunities");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-opportunity/${data._id}`);
  };

  const handleApply = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
       `/api/opportunity/apply/${data._id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success(res.data.msg);
    setApplied(true); // mark applied
  } catch (err) {
    toast.error(err.response?.data?.msg || "Apply failed");
  }
};



  return (
    <div className="p-6 mx-auto max-w-xl border rounded-xl shadow-lg bg-white">

      <img
        src={`http://localhost:3000/${
          data.image.replace(/^\/+/, "").startsWith("uploads")
            ? data.image.replace(/^\/+/, "")
            : "uploads/" + data.image
        }`}
        alt={data.title}
        className="h-48 w-full object-cover rounded-t-xl"
      />

      <h1 className="text-2xl font-bold mt-4">{data.title}</h1>

      <p className="mt-3 text-gray-600">{data.description}</p>

      <div className="mt-4 space-y-2 text-gray-700">
        <p>📍 {data.location}</p>
        <p>📅 {data.date}</p>
        <p>⏱ {data.duration}</p>
        <p>Status: {data.status}</p>
      </div>

      {/* ROLE BASED BUTTONS */}
     {/* ROLE BASED BUTTONS */}
<div className="mt-6">

  {/* NGO → Edit */}
  {role === "ngo" && (
    <div className="flex gap-4 mb-3">
      <button
        onClick={handleEdit}
        className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
      >
        Edit
      </button>
    </div>
  )}

  {/* Admin + NGO → Delete */}
  {(role === "admin" || role === "ngo") && (
    <div className="flex gap-4 mb-3">
      <button
        onClick={handleDelete}
        className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium"
      >
        Delete
      </button>
    </div>
  )}

  {/* Volunteer → Apply */}
  {role === "volunteer" && (
    <button
      onClick={handleApply}
      disabled={applied}
      className={`w-full py-2 rounded-lg font-medium text-white transition ${
        applied
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {applied ? "Applied ✅" : "Apply Now"}
    </button>
  )}

</div>
    </div>
  );
}