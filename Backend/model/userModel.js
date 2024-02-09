import { model, Schema } from "mongoose";

const officeAttendanceSchema = new Schema({
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
//half day

const halfDaySchema = new Schema({
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
  }
}) 

//work from home

const workFromHomeSchema = new Schema({
  checkInTime: {
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
  }
}) 

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
  officeAttendance: [officeAttendanceSchema],
  halfDayAttendance: [halfDaySchema],
  workFromHomeAttendance: [workFromHomeSchema],
});

const User = model("user", userSchema);3
export default User;
