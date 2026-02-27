import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/opportunity/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!data) return <p className="p-6">Loading...</p>;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?"))
      return;

    try {
      await axios.delete(`/api/opportunity/${data._id}`);
      toast.success("Deleted successfully");

      // Better navigation
      navigate("/opportunities");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-opportunity/${data._id}`);
  };

  return (
    <div className="p-6 mx-auto w-150 border-2 border-gray-300 rounded-xl h-150 hover:shadow-xl transition-shadow">
      
      <img
        src={`http://localhost:3000/${
          data.image.replace(/^\/+/, "").startsWith("uploads")
            ? data.image.replace(/^\/+/, "")
            : "uploads/" + data.image
        }`}
        alt={data.title}
        className="h-44 w-full object-cover rounded-t-2xl"
      />

      <h1 className="text-2xl font-bold mt-4">{data.title}</h1>

      <p className="mt-3 text-gray-600">{data.description}</p>

      <div className="mt-4 space-y-2 text-gray-700">
        <p>📍 {data.location}</p>
        <p>📅 {data.date}</p>
        <p>⏱ {data.duration}</p>
        <p>Status: {data.status}</p>
      </div>

      {/* Buttons Section */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleEdit}
          className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}