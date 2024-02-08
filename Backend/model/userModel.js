import { model, Schema } from "mongoose";

const attendanceSchema = new Schema({
  checkInTime: {
    type: Date,
    default: null, 
  },
  checkOutTime: {
    type: Date,
    default: null, 
  },
  latitude: {
    type: Number,
    default: 0,
  },
  longitude: {
    type: Number,
    default: 0,
  },
});
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  Password: {
    type: String,
    required: [true, "Password is required"],
  },
  ConfirmPassword: {
    type: String,
    required: [true, "Password is required"],
  },
  attendance: [attendanceSchema],
});

const User = model("user", userSchema);3
export default User;
