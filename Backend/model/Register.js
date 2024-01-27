import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    PhoneNumber: {
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
    }
  },
  
);

const Register = mongoose.model("Register", RegisterSchema);
export default Register;