import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authentication = (req, res, next) => {
  const token = req.headers["access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Token required. Please provide it." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    req.userid = decoded.id;
    req.role = decoded.role;
    next();
  });
};

export default authentication;
