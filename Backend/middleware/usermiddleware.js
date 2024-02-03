import "dotenv/config";
import jwt from "jsonwebtoken";

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(500).json({
      success: false,
      msg: "Please authenticate using a valid token",
    });
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_TOKEN);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Please authenticate using a valid token",
    });
  }
};

export default fetchUser;
