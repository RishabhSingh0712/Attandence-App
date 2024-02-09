import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [currTime, setCurrTime] = useState(new Date().toLocaleTimeString());
  const [currDate, setCurrDate] = useState(new Date().toLocaleDateString());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userInfo, setUserInfo] = useState({});

  const location = useLocation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrTime(new Date().toLocaleTimeString());
      setCurrDate(new Date().toLocaleDateString());
    }, 1000);

    setIsLoggedIn(true);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "") {
      const storedUserInfoString = localStorage.getItem("user_info");
      const storedUserInfo = JSON.parse(storedUserInfoString);
      setIsLoggedIn(true);
      setUserInfo(storedUserInfo);
    } else {
      setUserInfo();
      setIsLoggedIn(false);
    }
  }, [location]);

  const getUserLocationAndCheckIn = async (attendanceType) => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const response = await axios.post(
          "http://127.0.0.1:5000/api/user/attendance",
          {
            _id: userInfo._id,
            type: attendanceType,
            location: {
              latitude: latitude,
              longitude: longitude,
            },
          }
        );
      } catch (error) {
        console.log("Error getting location:", error);
      }
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleButtonClick = async (attendanceType) => {
    if (!isLoggedIn) {
      alert("Please login!!");
      return;
    }

    try {
      await getUserLocationAndCheckIn(attendanceType);
      alert("Attendance Done!!");
    } catch (error) {
      window.alert("Error submitting attendance. Please try again.");
    } finally {
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2"></aside>

      <div className="grid place-items-center sm:mt-20">
        <img
          className="sm:w-96 w-48"
          src="https://i.ibb.co/2M7rtLk/Remote1.png"
          alt="image2"
        />
      </div>
      <div className="mt-10 text-3xl space-y-4 ">
        <h1 className="hover:text-orange-600">
          <b>Current Date is =</b> {currDate}
        </h1>
        <h1 className="hover:text-orange-600">
          <b>Current Time is = </b>
          {currTime}
        </h1>
      </div>
      <div className="space-x-10 mt-10  ">
        <button
          type="button"
          onClick={() => handleButtonClick("Office In")}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Office In
        </button>

        <button
          type="button"
          onClick={() => handleButtonClick("Half Day")}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Half Day
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("Work From Home")}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Work From Home
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("Office Out")}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Office Out
        </button>
      </div>
    </div>
  );
}
