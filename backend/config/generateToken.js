import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const generateToken = (id) => {
    console.log("secret:",process.env.JWT_SECRET)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
        algorithm: "HS256"
    });
}
export default generateToken;