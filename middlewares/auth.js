import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateJWT = (req, res, next) => {
    const token = req.headers["authorization"]?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(403).json({ message: "Access Denied"});
        }
        next();
    })
}