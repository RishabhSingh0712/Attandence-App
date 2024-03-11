import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import "dotenv/config.js";
import jwt from "jsonwebtoken";
  
//register part
const register = async (req, res) => {
  try {
    // Fetch data from req body
    const { name, phoneNumber, Email, Password, ConfirmPassword } = req.body;

    // Check if user already exists
    const checkUserExist = await User.findOne({ Email: Email });
    if (checkUserExist) {
      return res.status(400).json({
        success: false,
        Message: "User already exists!",
      });
    }

    // Validate email
    if (!Email.includes("@")) {
      return res.status(400).json({
        success: false,
        Message: "Please enter a valid email!",
      });
    }

    // Check if all fields are provided
    if (!name || !phoneNumber || !Email || !Password || !ConfirmPassword) {
      return res.status(400).json({
        success: false,
        Message: "All fields are mandatory!",
      });
    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashpassword = await bcrypt.hash(Password, salt);

    // User registration
    const userRegistration = await User.create({
      name: name,
      Email: Email,
      phoneNumber: phoneNumber,
      Password: hashpassword,
      ConfirmPassword,
    });

    res.status(201).json({
      success: true,
      Message: "User registration successful!",
      data: userRegistration,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      Message: "User registration failed!",
      data: error,
    });
  }
};

// Login part
const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Validation
    if (!Email || !Password) {
      return res.status(400).json({
        success: false,
        Message: "All fields are required!",
      });
    }

    // Email check
    if (!Email.includes("@")) {
      return res.status(400).json({
        success: false,
        Message: "Please enter a valid email!",
      });
    }

    // Check if user exists
    const user = await User.findOne({ Email: Email });

    if (!user) {
      return res.status(400).json({
        success: false,
        Message: "User not found. Please try a valid email id!",
      });
    }

    // Password match
    const matchPassword = await bcrypt.compare(Password, user.Password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        Message: "Password does not match!",
      });
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
        expiresIn: "365d",
      });

      res.status(201).json({
        token: token,
        user_info: user,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      Message: "Internal server error!",
      err: error,
    });
  }
};




const isAttendanceRecordExistsForToday = (attendanceArray) => {
  if (attendanceArray && attendanceArray.length > 0) {
    const currentDate = new Date();
    const todayDateString = currentDate.toISOString().split("T")[0];

    return attendanceArray.some((attendance) => {
      const attendanceDateString = attendance.checkInTime
        .toISOString()
        .split("T")[0];
      return attendanceDateString === todayDateString;
    });
  } else {
    return false;
  }
};

// Attendance
const attendance = async (req, res) => {
  const { _id, type, location } = req.body;
  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (type == "Office Out") {
    let attendanceType = "";

    let isAttendanceRecordExists = isAttendanceRecordExistsForToday(
      user["officeAttendance"]
    );

    if (isAttendanceRecordExists) {
      attendanceType = "office";
    } else {
      isAttendanceRecordExists = isAttendanceRecordExistsForToday(
        user["halfDayAttendance"]
      );
      if (isAttendanceRecordExists) {
        attendanceType = "halfDay";
      } else {
        isAttendanceRecordExists = isAttendanceRecordExistsForToday(
          user["workFromHomeAttendance"]
        );
        if (isAttendanceRecordExists) {
          attendanceType = "workFromHome";
        } else {
          attendanceType = "";
        }
      }
    }

    if (attendanceType == "") {
      return res
        .status(400)
        .json({ message: "No attendance found for today" });
    }

    const todayAttendanceIndex = user[attendanceType + "Attendance"].findIndex(
      (attendance) => {
        const attendanceDateString = attendance.checkInTime
          .toISOString()
          .split("T")[0];
        const todayDateString = new Date().toISOString().split("T")[0];
        return attendanceDateString === todayDateString;
      }
    );

    if (todayAttendanceIndex !== -1) {
      user[attendanceType + "Attendance"][
        todayAttendanceIndex
      ].checkOutTime = new Date();
      await user.save();

      // Update: Include checkInTime and checkOutTime in the response
      const { checkInTime, checkOutTime } =
        user[attendanceType + "Attendance"][todayAttendanceIndex];
      return res.status(200).json({
        message: "Attendance updated successfully",
        checkInTime,
        checkOutTime,
      });
    } else {
      return res
        .status(400)
        .json({ message: "No attendance found for today" });
    }
  }

  const isAttendanceRecordExists = isAttendanceRecordExistsForToday(
    user[type.toLowerCase() + "Attendance"]
  );

  // Assuming checkInTime is a Date object in GMT
  const checkInTimeGMT = new Date();
  const attendanceDetails = {
    checkInTime: checkInTimeGMT,
    latitude: location.latitude,
    longitude: location.longitude,
  };

  switch (type) {
    case "office":
      user.officeAttendance.push(attendanceDetails);
      break;
    case "halfDay":
      user.halfDayAttendance.push(attendanceDetails);
      break;
    case "workFromHome":
      user.workFromHomeAttendance.push(attendanceDetails);
      break;
    case "Office Out":
      break;
    default:
      return res.status(400).json({ message: "Invalid attendance type" });
  }

  await user.save();

  // Update: Include checkInTime and checkOutTime in the response
  const { checkInTime, checkOutTime } = attendanceDetails;
  return res.status(200).json({
    message: "Attendance updated successfully",
    checkInTime,
    checkOutTime,
  });
};

// backend data show in frontend

const getAllUsersAttendance = async (req, res) => {
  try {
    const users = await User.find();

    const usersAttendanceData = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.Email,
      officeAttendance: user.officeAttendance,
      halfDayAttendance: user.halfDayAttendance,
      workFromHomeAttendance: user.workFromHomeAttendance,
    })); 

    return res.status(200).json(usersAttendanceData);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// fetchUserInfo part
const fetchUserInfo = async (req, res) => {
  try {
    const _id  = req.body._id;
    // Check if user exists
    const user = await User.findById(_id);
    

    if (!user) {
      return res.status(400).json({
        success: false,
        Message: "User not found. Please try a valid email id!",
      });
    }
    res.status(200).json({
      user_info: user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      Message: "Internal server error!",
      err: error,
    });
  }
};

export { register, login, attendance, getAllUsersAttendance, fetchUserInfo };
