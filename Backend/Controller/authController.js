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


export { register, login };
