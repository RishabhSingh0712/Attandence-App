import 'dotenv/config';
import jwt from "jsonwebtoken";

const fetchUser = async(req, res, next) =>{

    const token = req.Header('auth-token')

    if(!token){
        return res.status(500).json(
            {
                success: false, 
                msg:"Please authenticate using a valid token"
            }
        )
    }

    try {
        const {userId} = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = userId;
        console.log("fetchuser", userId);
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                success: false,
                msg:"Please authenticate using a valid token"
            }
        )
    }
}

export default fetchUser;