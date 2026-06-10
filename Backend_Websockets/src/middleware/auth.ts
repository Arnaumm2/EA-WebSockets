import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "LlaveSecretaPorSiAcaso";


export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 // Author: Bearer token
  const authHeader = req.headers["authorization"]; // Para leer el header de la peticion, la parte de Authorization

  const token = authHeader && authHeader.split(" ")[1]; // Aqui separa el token del header

  if (!token) {
    return res.status(401).json({ message: "Token requerido" }); // Si no hay token, retorna un error 401 (Unauthorized)
  }

  try {
    const decoded = jwt.verify(token, SECRET); // Verifica el token
    (req as any).user = decoded; // Agrega el usuario al request para que las rutas posteriores puedan acceder a el
    next(); // Si todo esta bien, pasa a la siguiente ruta
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" }); // Si el token es invalido, retorna un error 403 (Forbidden)
  }
};