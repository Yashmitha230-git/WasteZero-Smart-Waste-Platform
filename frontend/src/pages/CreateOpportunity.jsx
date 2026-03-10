import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateOpportunity() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    duration: "",
    image: "",
    status: "Open",
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
     const token = localStorage.getItem("token"); // assuming you store JWT after login

    const res = await fetch("http://localhost:3000/api/opportunity/create", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: formData
});

      const data = await res.json();
      console.log(data);
      toast.success("Opportunity created successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 w-full">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 md:p-8 space-y-5"
      >
        <h2 className="text-xl md:text-2xl font-bold text-center">
          Create Opportunity
        </h2>
        <h2 className="text-center">
          Post a volunteer opportunity for waste management and recycling.
        </h2>

        {/* TITLE */}
        <div>
          <label className="label">Opportunity Title</label>
          <br />
          <input
            name="title"
            onChange={handleChange}
            className="input border rounded-md border-gray-400 w-full"
            placeholder="Enter title"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="label">Description</label>
          <br />
          <textarea
            name="description"
            rows="4"
            onChange={handleChange}
            className="input border rounded-md border-gray-400 w-full"
            placeholder="Enter description"
            required
          />
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Location</label>
            <br />
            <input
              name="location"
              onChange={handleChange}
              className="input border rounded-md border-gray-400 w-full"
              placeholder="Enter location"
              required
            />
          </div>

          <div>
            <label className="label">Date</label>
            <br />
            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="input border rounded-md border-gray-400 w-full"
              required
            />
          </div>

          <div>
            <label className="label">Duration</label>
            <br />
            <input
              name="duration"
              onChange={handleChange}
              className="input border rounded-md border-gray-400 w-full"
              placeholder="Ex: 3 hours"
            />
          </div>

          <div>
            <label className="label">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg"
              onChange={handleChange}
              className="input border rounded-md border-gray-400 w-full file:bg-blue-50 file:border-0 file:px-3 file:py-1 file:rounded file:text-blue-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg cursor-pointer"
        >
          Submit Opportunity
        </button>
      </form>
    </div>
  );
}