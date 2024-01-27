import RegisterSchema from '../model/Register.js'
import bcrypt from 'bcrypt'
// import  jwt  from 'jsonwebtoken'

class UserController{
    static userRegistration = async (req,res)=>{
        const {name,phoneNumber,Email,Password,ConfirmPassword}=req.body
        const user = await RegisterSchema.findOne({Email:Email})
        if (user) {
            res.send({"status":"failed","message":"Email already exists please try another email"})
        }
        else{
            if (name,phoneNumber,Password,ConfirmPassword) {
                if (Password === ConfirmPassword) {
                   try {
                     const salt = await bcrypt.genSalt(10)
                     const hashPassword = await bcrypt.hash(Password,salt)
                     const User = new Usermodel({
                         name:name,
                         Email:Email,
                         phoneNumber:phoneNumber,
                         Password:hashPassword,
                         ConfirmPassword:ConfirmPassword
                         
                     })
                     await User.save()
                     res.send({"status":"Sucess","message":"User Registration Succesfully"})
                   } catch (error) {
                    res.send({"status":"failed","message":"Unable to Register"})
                   }
                }else{
                res.send({"status":"failed","message":"Password and Confirm Password doesn't match"})
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }
    }
}
export default UserController;