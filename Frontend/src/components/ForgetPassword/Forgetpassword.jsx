import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      formIsValid = false;
      newErrors.email = "Email is required";
    }

    if (formIsValid) {
      try {
        const data = {
          email: formData.email,
        };

        const response = await axios.post("http://127.0.0.1:5000/api/user/ForgetPassword", data);

        if (response.status === 200) {
          alert("Password reset link sent to your email account");
          navigate("/login");
        } else {
          console.log(response.data); 
          alert("Error: " + response.data.error);
        }
      } catch (error) {
        console.error(error);
        alert("Error, password reset failed!!");
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h4 className="text-3xl font-semibold text-center mb-6">
          Reset Password
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
             Enter your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
