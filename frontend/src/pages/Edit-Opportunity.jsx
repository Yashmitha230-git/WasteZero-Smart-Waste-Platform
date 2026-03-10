import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    duration: "",
    status: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch existing data
  useEffect(() => {
    axios
      .get(`/api/opportunity/${id}`)
      .then((res) => {
        setFormData(res.data);
        setPreview(`http://localhost:3000/${res.data.image}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load data");
      });
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit update
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const data = new FormData();

    for (let key in formData) {
      data.append(key, formData[key]);
    }

    if (image) {
      data.append("image", image);
    }

    await axios.put(`/api/opportunity/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Updated successfully");
    navigate(`/opportunity/${id}`);

  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }

  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Opportunity</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date?.substring(0, 10)}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration"
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-full object-cover rounded"
          />
        )}

        <input
          type="file"
          onChange={handleImageChange}
          className="w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-gray-300 hover:text-blue-700 text-white py-2 rounded-lg"
        >
          Update Opportunity
        </button>
      </form>
    </div>
  );
}