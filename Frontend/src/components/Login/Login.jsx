import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      formIsValid = false;
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      formIsValid = false;
      newErrors.password = "Password is required";
    }

    if (formIsValid) {
      try {
        const data = {
          Email: formData.email,
          Password: formData.password,
        };
        axios
          .post("http://127.0.0.1:5000/api/user/login", data)
          .then((response) => {
            if (response.status === 201) { 
              
              alert("Congratulations, login successful!!");
              window.localStorage.setItem("token",response.data['token']);
              const userInfoString = JSON.stringify(response.data['user_info']);
              window.localStorage.setItem("user_info",userInfoString);
              navigate("/");
            } else {
              
              alert("Error, login failed!!");
            }
          })
          .catch((error) => {
            alert("User not found or password incorrect");
          });
      } catch (error) {
        alert("server not responding please try again later");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Employee Login
        </h2>
        <div></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
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
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600"
          >
            Login
          </button>
          <p className="text-center mt-4">
            New Employee?{" "}
            <Link to="/Registerpage" className="text-blue-500">
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
