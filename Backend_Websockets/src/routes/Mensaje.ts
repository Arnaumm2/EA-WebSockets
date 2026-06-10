import express from 'express';
import * as MensajeController from '../controllers/Mensaje';

const router = express.Router();

/**
 * Obtener todos los mensajes (Global)
 * GET /mensajes
 */
router.get('/', MensajeController.obtenerTodosLosMensajes);

/**
 * Obtener todos los mensajes de una organización
 * GET /mensajes/organizacion/:organizacionId
 */
router.get('/organizacion/:organizacionId', MensajeController.obtenerMensajesPorOrganizacion);

/**
 * Obtener mensajes no leídos de un usuario
 * GET /mensajes/no-leidos/:usuarioId
 */
router.get('/no-leidos/:usuarioId', MensajeController.obtenerMensajesNoLeidos);

/**
 * Marcar un mensaje como leído
 * PUT /mensajes/leido/:mensajeId
 */
router.put('/leido/:mensajeId', MensajeController.marcarComoLeido);

/**
 * Eliminar un mensaje
 * DELETE /mensajes/:mensajeId
 */
router.delete('/:mensajeId', MensajeController.eliminarMensaje);

export default router;
