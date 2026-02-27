import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "Volunteer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const { confirmPassword, ...dataToSend } = formData;

  const success = await login("register", dataToSend);

  if (success) navigate("/dashboard");
};


  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 bg-gray-100 p-16 flex-col justify-center">
        <h2 className="text-2xl font-bold text-blue-600">♻ WasteZero</h2>
        <h1 className="text-4xl font-bold mt-6">
          Join the Recycling Revolution
        </h1>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center">
            Create a new account
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <input name="fullName" placeholder="Full Name" required onChange={handleChange} className="input"/>
            <input name="email" placeholder="Email" required onChange={handleChange} className="input"/>
            <input name="username" placeholder="Username" required onChange={handleChange} className="input"/>
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="input"/>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} className="input"/>

            <select name="role" value={formData.role} onChange={handleChange} className="input">
              <option value="Volunteer">Volunteer</option>
              <option value="NGO">NGO</option>
              <option value="Admin">Admin</option>
            </select>

            <button className="w-full bg-blue-600 text-white py-2 rounded-md">
              Create Account
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?
              <Link to="/login" className="text-blue-600 font-medium">
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
