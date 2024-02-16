import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import "dotenv/config.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    //fetch data fron req body
    const { name, phoneNumber, Email, Password, ConfirmPassword } = req.body;

    // user exist
    const checkUserExist = await User.findOne({
      Email: Email,
    });
    if (checkUserExist) {
      return res.status(400).json({
        success: false,
        Message: "User already exist !!",
      });
    }
    // @ valid email checkIn
    if (!Email.includes("@")) {
      return res.status(400).json({
        success: false,
        Message: "Please enter the valid email !!",
      });
    }
    // all feild required
    if (!name || !phoneNumber || !Email || !Password || !ConfirmPassword) {
      return res.status(400).json({
        success: false,
        Message: "All fields are mandatory !!",
      });
    }
    //generate salt
    const salt = await bcrypt.genSalt(10);

    //hashpassword

    const hashpassword = await bcrypt.hash(Password, salt);

    // user registration
    const userRegistration = await User.create({
      name: name,
      Email: Email,
      phoneNumber: phoneNumber,
      Password: hashpassword,
      ConfirmPassword,
    });

    res.status(201).json({
      success: true,
      Message: "User registration successfully !!",
      data: userRegistration,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      Message: "User registration failed !!",
      data: error,
    });
  }
};
// Login part

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    //validation
    if (!Email || !Password) {
      return res.status(400).json({
        success: false,
        Message: "All fields is requried !!",
      });
    }
    //email check
    if (!Email.includes("@")) {
      return res.status(400).json({
        success: false,
        Message: "Please enter the valid email !!",
      });
    }
    // user exist
    const user = await User.findOne({ Email: Email });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        Message: "User not found please try for a vaild email id !!",
      });
    }
    //password match
    const matchPassword = await bcrypt.compare(Password, user.Password);
    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        Message: "Password not match !!",
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
      Message: "internal server error !!",
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

// attendance



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
      return res.status(400).json({ message: "No attendance found for today" });
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
      user[attendanceType + "Attendance"][todayAttendanceIndex].checkOutTime =
        new Date();
      await user.save();

      // Update: Include checkInTime and checkOutTime in the response
      const { checkInTime, checkOutTime } = user[attendanceType + "Attendance"][todayAttendanceIndex];
      return res.status(200).json({ message: "Attendance updated successfully", checkInTime, checkOutTime });
    } else {
      return res.status(400).json({ message: "No attendance found for today" });
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
  return res.status(200).json({ message: "Attendance updated successfully", checkInTime, checkOutTime });
};




export { register, login, attendance };
