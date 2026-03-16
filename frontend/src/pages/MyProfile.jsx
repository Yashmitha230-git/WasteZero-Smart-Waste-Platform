import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    skills: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile({
         name: res.data.name || "",
        email: res.data.email || "",
        location: res.data.location || "",
        skills: res.data.skills || ""
      }))
      .catch(() => toast.error("Failed to load profile"));
  }, [token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/users/me",
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await axios.put(
        "http://localhost:3000/api/users/change-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch {
      toast.error("Password change failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl w-full">

      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium ${
            activeTab === "profile"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 font-medium ${
            activeTab === "password"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
        >
          Password
        </button>
      </div>

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileUpdate} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={profile.name}
              onChange={e =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled
              className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100 text-gray-500"
              value={profile.email}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={profile.location}
              onChange={e =>
                setProfile({ ...profile, location: e.target.value })
              }
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <input
              type="text"
              placeholder="e.g. Recycling, Community Work, Awareness Campaigns"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={profile.skills}
              onChange={e =>
                setProfile({ ...profile, skills: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* PASSWORD TAB */}
      {activeTab === "password" && (
        <form onSubmit={handlePasswordChange} className="space-y-5">

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={passwordData.currentPassword}
              onChange={e =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })
              }
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={passwordData.newPassword}
              onChange={e =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })
              }
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={passwordData.confirmPassword}
              onChange={e =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value
                })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
      )}
    </div>
  );
}