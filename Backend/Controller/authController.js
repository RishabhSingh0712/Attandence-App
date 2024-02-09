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



// attendance

const attendance = async (req, res) => {
  const { _id, type, location } = req.body;
  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const attendanceDetails = {
    checkInTime: new Date(),
    latitude: location.latitude,
    longitude: location.longitude,
  };

  switch (type) {
    case 'Office In':
      user.officeAttendance.push(attendanceDetails);
      break;
    case 'Half Day':
      user.halfDayAttendance.push(attendanceDetails);
      break;
    case 'Work From Home':
      user.workFromHomeAttendance.push(attendanceDetails);
      break;
    case 'Office Out':
      const lastOfficeAttendance = user.officeAttendance.pop(); // Get the last office attendance
      if (lastOfficeAttendance) {
        lastOfficeAttendance.checkOutTime = new Date();
        user.officeAttendance.push(lastOfficeAttendance); // Update the checkOutTime
      }
      break;
    default:
      return res.status(400).json({ message: "Invalid attendance type" });
  }

  await user.save();

  return res.status(200).json({ message: "Attendance updated successfully" });
};



// halfday

const halfDayAttendance = async (req, res) => {
  try {
    const { _id, location } = req.body;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 

    const halfDayAttendanceDetails = {
      checkInTime: new Date(),
      latitude: location.latitude, 
      longitude: location.longitude, 
    };

    // Update attendance details
    const lastHalfDayAttendance = user.halfDayAttendance.pop(); // Get the last half day attendance
    if (lastHalfDayAttendance) {
      lastHalfDayAttendance.checkOutTime = new Date();
      user.halfDayAttendance.push(lastHalfDayAttendance); // Update the checkOutTime
    }

    // Save the updated user with new attendance details
    await user.save();

    return res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// work from home


const workFromHomeAttendance = async (req, res) => {
  try {
    const { _id, location } = req.body;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    const workFromHomeAttendanceDetails = {
      checkInTime: new Date(),
      latitude: location.latitude, 
      longitude: location.longitude, 
    };

    // Update attendance details
    user.workFromHomeAttendance.push(workFromHomeAttendanceDetails);

    // Save the updated user with new attendance details
    await user.save();

    return res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export { register, login,attendance };
