import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Home() {
  const [currTime, setCurrTime] = useState(new Date().toLocaleTimeString());
  const [currDate, setCurrDate] = useState(new Date().toLocaleDateString());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);

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

  useEffect(() => {
    const storedAttendanceData =
      JSON.parse(localStorage.getItem("attendance_data")) || [];
    const trimmedAttendanceData = storedAttendanceData.slice(-7);
    setAttendanceData(trimmedAttendanceData);
  }, []);

  const saveAttendanceDataToLocalStorage = (newAttendanceData) => {
    const trimmedAttendanceData = newAttendanceData.slice(-7);
    localStorage.setItem(
      "attendance_data",
      JSON.stringify(trimmedAttendanceData)
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString();
  };

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
            date: currDate,
            time: currTime,
          }
        );

        // Update the attendanceData state with the new attendance
        const newAttendanceData = [...attendanceData, response.data];
        setAttendanceData(newAttendanceData);
        saveAttendanceDataToLocalStorage(newAttendanceData);
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
    }
  };

  const exportToExcel = () => {
    const data = attendanceData.map((attendance, index) => ({
      "Sr. No.": index + 1,
      Date: attendance.checkInTime ? formatDate(attendance.checkInTime) : "N/A",
      Name: userInfo ? userInfo.name.toUpperCase() : "N/A",
      Email: userInfo ? userInfo.Email : "N/A",
      "In Time": attendance.checkInTime
        ? formatTime(attendance.checkInTime)
        : "N/A",
      "Out Time": attendance.checkOutTime
        ? formatTime(attendance.checkOutTime)
        : "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");
    XLSX.writeFile(wb, "attendance_data.xlsx");
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

      <div className="mt-10">
        <h1 className="text-3xl hover:text-orange-600 p-3">
          <b>Current Date:</b> {currDate}
        </h1>
        <h1 className="text-3xl hover:text-orange-600">
          <b>Current Time:</b> {currTime}
        </h1>
      </div>

      <div className="space-x-10 mt-5 p-3">
        <button
          type="button"
          onClick={() => handleButtonClick("office")}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Office In
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("halfDay")}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Half Day
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("workFromHome")}
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
      <div className="mt-10">
        <table className="mt-5 w-full border-collapse border border-green-800">
          <thead>
            <tr>
              <th className="border border-green-600 p-2">Sr. No.</th>
              <th className="border border-green-600 p-2">Date</th>
              <th className="border border-green-600 p-2">Name</th>
              <th className="border border-green-600 p-2">Email</th>
              <th className="border border-green-600 p-2">In Time</th>
              <th className="border border-green-600 p-2">Out Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((attendance, index) => (
              <tr key={index}>
                <td className="border border-green-600 p-2">{index + 1}</td>
                <td className="border border-green-600 p-2">
                  {attendance.checkInTime
                    ? formatDate(attendance.checkInTime)
                    : "N/A"}
                </td>
                <td className="border border-green-600 p-2">
                  {userInfo ? userInfo.name.toUpperCase() : "N/A"}
                </td>
                <td className="border border-green-600 p-2">
                  {userInfo ? userInfo.Email : "N/A"}
                </td>
                <td className="border border-green-600 p-2">
                  {attendance.checkInTime
                    ? formatTime(attendance.checkInTime)
                    : "N/A"}
                </td>
                <td className="border border-green-600 p-2">
                  {attendance.checkOutTime
                    ? formatTime(attendance.checkOutTime)
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={exportToExcel}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-green-600 mt-6"
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}
