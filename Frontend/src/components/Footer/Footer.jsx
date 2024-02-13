import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    inTime: "",
    outTime: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "") {
      // Fetch user data from your backend API
      fetch("http://127.0.0.1:5000/api/user/attendance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Update state with the fetched user data
          setUserData({
            name: data.name,
            email: data.Email,
            inTime: data.inTime, 
            outTime: data.outTime, 
          });
          console.log("setUserData");
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [location]);

  return (
    <footer className="bg-white">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <div className="flex space-x-4 mb-20 sm:flex sm:items-center sm:justify-between">
          <p className="flex-1">Date {userData.date}</p>
          <p className="flex-1">Name {userData.name}</p>
          <p className="flex-1">Email {userData.email}</p>
          <p className="flex-1">In Time {userData.inTime}</p>
          <p className="flex-1">Out Time {userData.outTime}</p>
        </div>

        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2024
            <a
              href="https://rishabhsingh7.netlify.app/"
              className="hover:underline"
            >
              RishabhSingh
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex space-x-5 sm:justify-center  sm:mt-0">
            <Link to="#" className="text-gray-500 hover:text-gray-900">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 8 19"
              >
                <path
                  fillRule="evenodd"
                  d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Facebook page</span>
            </Link>

            <Link to="#" className="text-gray-500 hover:text-gray-900">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 17"
              >
                <path
                  fillRule="evenodd"
                  d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Twitter page</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
