import Register from '../model/Register.js'
import bcrypt from 'bcrypt'
// import { Jwt } from 'jsonwebtoken'

class UserController{
    static userRegistration = async (req,res)=>{
        const {name,phoneNumber,email,password,confirmPassword}=req.body
        const user = await Register.findOne({email:email})
        if (user) {
            res.send({"status":"failed","message":"Email already exists please try another email"})
        }
        else{
            if (name,phoneNumber,password,confirmPassword) {
                if (password === confirmPassword) {
                   try {
                     const salt = await bcrypt.genSalt(15)
                     const hashPassword = await bcrypt.hash(password,salt)
                     const User = new Usermodel({
                         name:name,
                         email:email,
                         password:hashPassword
                     })
                     await User.save()
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