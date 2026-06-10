import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Clave secreta para firmar el token
const SECRET = process.env.JWT_SECRET || "LlaveSecretaPorSiAcaso";


// Esta funcion genera un token 
export const generateToken = (name: string, email: string, organizacion: mongoose.Types.ObjectId) => {
    return jwt.sign(
        { name, email, organizacion }, // payload
        SECRET,           // clave secreta
        { expiresIn: "1h" } // tiempo de expiración
    );
};


// Esta funcion verifica el token 
export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET);
};