import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";

const Home = () => {
  const [currTime, setCurrTime] = useState(new Date().toLocaleTimeString());
  const [currDate, setCurrDate] = useState(new Date().toLocaleDateString());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasOfficeIn, setHasOfficeIn] = useState(false);
  const [hasHalfDay, setHasHalfDay] = useState(false);
  const [hasWorkFromHome, setHasWorkFromHome] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const location = useLocation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrTime(new Date().toLocaleTimeString());
      setCurrDate(new Date().toLocaleDateString());
    }, 1000);

    setIsLoggedIn(true);

    const resetDailyActions = () => {
      setHasOfficeIn(false);
      setHasHalfDay(false);
      setHasWorkFromHome(false);
      setHasLoggedOut(false);
    };

    const midnightIntervalId = setInterval(() => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(0, 0, 0, 0);

      // Reset variables at midnight
      if (now.getTime() === midnight.getTime()) {
        resetDailyActions();
      }
    }, 60000); // Check every minute

    // Clear interval on component unmount
    return () => clearInterval(midnightIntervalId);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "") {
      const storedUserInfoString = localStorage.getItem("user_info");
      const storedUserInfo = JSON.parse(storedUserInfoString);
      setIsLoggedIn(true);
      setUserInfo(storedUserInfo);
      modelUserAttendance([storedUserInfo]);
    } else {
      setHasOfficeIn(false);
      setHasHalfDay(false);
      setHasWorkFromHome(false);
      setHasLoggedOut(false);
      setUserInfo({});
      setIsLoggedIn(false);
      fetchAllUsersAttendance();
    }
  }, [location]);

  useEffect(() => {
    const userAttendanceData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/user/allAttendance");
        setAttendanceData(response.data);
        modelUserAttendance(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    userAttendanceData();
  }, []);

  const groupAttendanceByDate = (attendanceData) => {
    return attendanceData.reduce((groupedData, attendance) => {
      const date = attendance.date;
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(attendance);
      return groupedData;
    }, {});
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalEntries = Object.entries(groupedAttendanceData).length;

    if (totalEntries === 0 || startIndex >= totalEntries) {
      return [];
    }

    const currentData = Object.entries(groupedAttendanceData).slice(startIndex, endIndex);
    return currentData;
  };

  const modelUserAttendance = (userInfoList) => {
    const userAttendanceData = [];

    userInfoList.forEach((user) => {
      ["officeAttendance", "halfDayAttendance", "workFromHomeAttendance"].forEach(
        (attendanceType) => {
          user[attendanceType].forEach((attendance) => {
            const checkInTime = attendance.checkInTime
              ? new Date(attendance.checkInTime)
              : null;
            const checkOutTime = attendance.checkOutTime
              ? new Date(attendance.checkOutTime)
              : null;

            const attendanceData = {
              id: user._id,
              name: user.name,
              email: user.email ?? user.Email,
              date: checkInTime ? checkInTime.toLocaleDateString() : null,
              checkInTime: attendance.checkInTime,
              checkOutTime: attendance.checkOutTime,
              workingHours: calculateWorkingHours(checkInTime, checkOutTime),
              type: attendanceType,
            };

            userAttendanceData.push(attendanceData);
          });
        }
      );
    });

    const groupedData = groupAttendanceByDate(userAttendanceData);
    setGroupedAttendanceData(groupedData);
    setAttendanceData((prevData) => [...prevData, ...userAttendanceData]);
    saveAttendanceDataToLocalStorage(userAttendanceData);
  };

  const fetchAllUsersAttendance = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/user/allAttendance");
      if (response.status === 200) {
        modelUserAttendance(response.data);
      } else {
        console.error("some error");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const saveAttendanceDataToLocalStorage = (newAttendanceData) => {
    const trimmedAttendanceData = newAttendanceData.slice(-300);
    localStorage.setItem("attendance_data", JSON.stringify(trimmedAttendanceData));
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

  const calculateWorkingHours = (checkInTime, checkOutTime) => {
    if (checkInTime && checkOutTime) {
      const checkIn = new Date(checkInTime);
      const checkOut = new Date(checkOutTime);
      const diffInMilliseconds = checkOut - checkIn;

      const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");

      const formattedTime = `${formattedHours}:${formattedMinutes}`;
      return formattedTime;
    }
    return "N/A";
  };

  const fetchSpecificUserInfo = async (userId) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/user/fetchUserInfo", {
        _id: userId,
      });
      if (response.status === 200) {
        const userInfoString = JSON.stringify(response.data["user_info"]);
        window.localStorage.setItem("user_info", userInfoString);
        modelUserAttendance([response.data["user_info"]]);
      }
    } catch (error) {
      console.error("Error fetching specific user info:", error);
    }
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

        // Calculate and update daily total working hours
        if (response.data.checkInTime && response.data.checkOutTime) {
          const checkInTime = new Date(response.data.checkInTime);
          const checkOutTime = new Date(response.data.checkOutTime);
          const diffInMilliseconds = checkOutTime - checkInTime;
          const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
          setDailyTotalHours((prevTotal) => prevTotal + diffInHours);
        }

        const userDetails = {
          name: userInfo ? userInfo.name.toUpperCase() : "N/A",
          Email: userInfo ? userInfo.Email : "N/A",
          checkInTime: response.data.checkInTime,
          checkOutTime: response.data.checkOutTime,
        };
        setSelectedAttendance({ type: attendanceType, user: userDetails });
        await fetchSpecificUserInfo(userInfo._id);
        await fetchAllUsersAttendance();
      } catch (error) {
        console.error("Error getting location:", error);
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

    // Check if the user has already performed the action for the day
    switch (attendanceType) {
      case "office":
        if (hasOfficeIn) {
          alert("You have already clicked Office In for today.");
          return;
        }
        setHasOfficeIn(true);
        break;
      case "halfDay":
        if (hasHalfDay) {
          alert("You have already clicked Half Day for today.");
          return;
        }
        setHasHalfDay(true);
        break;
      case "workFromHome":
        if (hasWorkFromHome) {
          alert("You have already clicked Work From Home for today.");
          return;
        }
        setHasWorkFromHome(true);
        break;
      case "Office Out":
        // Assuming Logout is equivalent to Office Out
        if (hasLoggedOut) {
          alert("You have already logged out for today.");
          return;
        }
        setHasLoggedOut(true);
        break;
      default:
        break;
    }

    try {
      await getUserLocationAndCheckIn(attendanceType);
      alert("Attendance Done!!");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      window.alert("Error submitting attendance. Please try again.");
    }
  };

  const exportToExcel = () => {
    const data = [];

    // Flatten the groupedAttendanceData into a single array for export
    Object.entries(groupedAttendanceData).forEach(([date, entries]) => {
      entries.forEach((attendance, index) => {
        data.push({
          "Sr. No.": index + 1,
          Date: attendance.checkInTime ? formatDate(attendance.checkInTime) : "N/A",
          Name: attendance.name.toUpperCase(),
          Email: attendance.email,
          "In Time": attendance.checkInTime ? formatTime(attendance.checkInTime) : "N/A",
          "Out Time": attendance.checkOutTime ? formatTime(attendance.checkOutTime) : "N/A",
          "Working Hours": attendance.workingHours,
        });
      });
    });

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
          src="https://www.skoolbeep.com/blog/wp-content/uploads/2020/12/What-is-an-attendence-manangemnt-system.png"
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

      <div className="space-x-10 mt-5 p-3 sm: space-y-4 mr-16 ml-8 ">
        <button
          type="button"
          onClick={() => handleButtonClick("office")}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 "
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
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 "
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
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          onClick={() =>
            (window.location.href =
              "https://docs.google.com/forms/d/1n2YOqv2Hrty8ZVcGIRyhUSVgWu7_RkTdqzcsEipj0V4/edit")
          }
        >
          Leave form
        </button>
      </div>

      {selectedAttendance && (
        <div>
          <p>
            <b>Name:</b> {selectedAttendance.user.name}
          </p>
          <p>
            <b>Email:</b> {selectedAttendance.user.Email}
          </p>
          <p>
            <b>Check In Time:</b>{" "}
            {selectedAttendance.user.checkInTime
              ? formatTime(selectedAttendance.user.checkInTime)
              : "N/A"}
          </p>
          <p>
            <b>Check Out Time:</b>{" "}
            {selectedAttendance.user.checkOutTime
              ? formatTime(selectedAttendance.user.checkOutTime)
              : "N/A"}
          </p>
        </div>
      )}
      <div className="mt-10">
        {/* Display grouped attendance data */}
        {getCurrentPageData().map(([date, data]) => (
          <div key={date}>
            <h2 className="text-xl font-bold">{date}</h2>
            <table className="mt-5 w-full border-collapse border border-green-800">
              <thead>
                <tr>
                  <th className="border border-green-600 p-2">Sr. No.</th>
                  <th className="border border-green-600 p-2">Date</th>
                  <th className="border border-green-600 p-2">Name</th>
                  <th className="border border-green-600 p-2">Email</th>
                  <th className="border border-green-600 p-2">In Time</th>
                  <th className="border border-green-600 p-2">Out Time</th>
                  <th className="border border-green-600 p-2">Working Hours</th>
                </tr>
              </thead>
              <tbody>
                {data.map((attendance, index) => (
                  <tr key={index}>
                    <td className="border border-green-600 p-2">{index + 1}</td>
                    <td className="border border-green-600 p-2">
                      {attendance.checkInTime ? formatDate(attendance.checkInTime) : "N/A"}
                    </td>
                    <td className="border border-green-600 p-2">{attendance.name.toUpperCase()}</td>
                    <td className="border border-green-600 p-2">{attendance.email}</td>
                    <td className="border border-green-600 p-2">
                      {attendance.checkInTime ? formatTime(attendance.checkInTime) : "N/A"}
                    </td>
                    <td className="border border-green-600 p-2">
                      {attendance.checkOutTime ? formatTime(attendance.checkOutTime) : "N/A"}
                    </td>
                    <td className="border border-green-600 p-2">{attendance.workingHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

         {/* Pagination buttons */}
       
        {/* Pagination buttons */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mx-2"
          >
            Prev Page
          </button>
          <button
            onClick={() => setCurrentPage(prevPage => prevPage + 1)}
            disabled={Object.entries(groupedAttendanceData).length <= currentPage * itemsPerPage}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mx-2"
          >
            Next Page
          </button>
        </div>

        <button
          type="button"
          onClick={exportToExcel}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-green-600 mt-6"
        >
          Export to Excel
        </button>
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
        </span>{" "}
      </div>
    </div>
  );
};

export default Home;
