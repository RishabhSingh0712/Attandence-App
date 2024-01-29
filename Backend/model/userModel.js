import {model,Schema} from "mongoose";

const userSchema = new Schema(
  {
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
    }
  },
);


const User = model("user", userSchema);
User.createIndexes();
export default User;