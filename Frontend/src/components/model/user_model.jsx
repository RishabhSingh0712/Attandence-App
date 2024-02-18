// user.model.js

const OfficeAttendanceSchema = {
    checkInTime: null,
    checkOutTime: null,
    latitude: 0,
    longitude: 0,
  };
  
  const HalfDaySchema = {
    checkInTime: null,
    checkOutTime: null,
    latitude: 0,
    longitude: 0,
  };
  
  const WorkFromHomeSchema = {
    checkInTime: null,
    latitude: 0,
    longitude: 0,
  };
  
  const UserSchema = {
    id:'',
    name: '',
    phoneNumber: 0,
    email: '',
    password: '',
    confirmPassword: '',
    officeAttendance: [OfficeAttendanceSchema],
    halfDayAttendance: [HalfDaySchema],
    workFromHomeAttendance: [WorkFromHomeSchema],
  };
  
  export default UserSchema;
  