import express from 'express';
import controller from '../controllers/Usuario';
import { Schemas, ValidateJoi } from '../middleware/Joi';

import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Usuarios
 *     description: Endpoints CRUD de usuarios
 *
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ObjectId de MongoDB
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *         name:
 *           type: string
 *           example: "Judit"
 *         email:
 *           type: string
 *           example: "judit@gmail.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         organizacion:
 *           type: string
 *           description: ObjectId de la organización
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *     UsuarioCreateUpdate:
 *       type: object
 *       required:
 *         - name
 *         - organizacion
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "Judit"
 *         email:
 *           type: string
 *           example: "judit@gmail.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         organizacion:
 *           type: string
 *           description: ObjectId de la organización (24 hex)
 *           example: "65f1c2a1b2c3d4e5f6789013"
 */

/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Crea un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreateUpdate'
 *     responses:
 *       201:
 *         description: Creado
 *       422:
 *         description: Validación fallida (Joi)
 */
router.post('/', ValidateJoi(Schemas.usuario.create), controller.createUsuario);

/**
 * @openapi
 * /usuarios/{usuarioId}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId del usuario
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 */
router.get('/:usuarioId',authenticateToken ,controller.readUsuario);

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Lista todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/',authenticateToken, controller.readAll);

/**
 * @openapi
 * /usuarios/{usuarioId}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreateUpdate'
 *     responses:
 *       201:
 *         description: Actualizado
 *       404:
 *         description: No encontrado
 *       422:
 *         description: Validación fallida (Joi)
 */
router.put('/:usuarioId',authenticateToken, ValidateJoi(Schemas.usuario.update), controller.updateUsuario);

/**
 * @openapi
 * /usuarios/{usuarioId}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId del usuario
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 */
router.delete('/:usuarioId',authenticateToken, controller.deleteUsuario);

export default router;
