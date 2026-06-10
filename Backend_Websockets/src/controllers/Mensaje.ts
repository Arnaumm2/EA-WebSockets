import { Request, Response, NextFunction } from 'express';
import Logging from '../library/Logging';
import MensajeModel from '../models/Mensaje';
import UsuarioModel from '../models/Usuario';
import { MensajeService } from '../services/Mensaje';

/**
 * Obtener todos los mensajes de una organización
 */
export const obtenerMensajesPorOrganizacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizacionId } = req.params;
        const { usuarioId } = req.query;

        let query: any = { organizacion: organizacionId };

        if (usuarioId) {
            const usuario = await UsuarioModel.findById(usuarioId);
            if (usuario) {
                query.createdAt = { $gte: usuario.createdAt };
                Logging.info(`Filtrando mensajes para el usuario ${usuario.name} creados después de ${usuario.createdAt}`);
            } else {
                Logging.info(`Usuario ${usuarioId} no encontrado para filtrar mensajes`);
            }
        }

        const mensajes = await MensajeModel.find(query)
            .populate('usuario', 'name email')
            .sort({ createdAt: -1 });

        Logging.info(`Mensajes obtenidos para organización ${organizacionId}`);
        return res.status(200).json(mensajes);
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Error al obtener mensajes' });
    }
};

/**
 * Obtener todos los mensajes (Global)
 */
export const obtenerTodosLosMensajes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { usuarioId } = req.query;
        let query: any = {};

        if (usuarioId) {
            const usuario = await UsuarioModel.findById(usuarioId);
            if (usuario) {
                query.createdAt = { $gte: usuario.createdAt };
                Logging.info(`Filtrando TODOS los mensajes para el usuario ${usuario.name} creados después de ${usuario.createdAt}`);
            } else {
                Logging.info(`Usuario ${usuarioId} no encontrado para filtrar mensajes globales`);
            }
        }

        const mensajes = await MensajeModel.find(query)
            .populate('usuario', 'name email')
            .sort({ createdAt: 1 }); // Sorted by date

        Logging.info(`Todos los mensajes obtenidos`);
        return res.status(200).json(mensajes);
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Error al obtener todos los mensajes' });
    }
};

/**
 * Obtener mensajes no leídos de un usuario
 */
export const obtenerMensajesNoLeidos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { usuarioId } = req.params;
        const mensajes = await MensajeModel.find({ usuario: usuarioId, leido: false })
            .populate('usuario', 'name email')
            .populate('organizacion', 'name')
            .sort({ createdAt: -1 });

        Logging.info(`Mensajes no leídos obtenidos para usuario ${usuarioId}`);
        return res.status(200).json(mensajes);
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Error al obtener mensajes no leídos' });
    }
};

/**
 * Marcar un mensaje como leído
 */
export const marcarComoLeido = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mensajeId } = req.params;
        const mensaje = await MensajeModel.findByIdAndUpdate(
            mensajeId,
            { leido: true },
            { new: true }
        );

        if (!mensaje) {
            return res.status(404).json({ message: 'Mensaje no encontrado' });
        }

        Logging.info(`Mensaje ${mensajeId} marcado como leído`);
        return res.status(200).json(mensaje);
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Error al marcar mensaje como leído' });
    }
};

/**
 * Eliminar un mensaje
 */
export const eliminarMensaje = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mensajeId } = req.params;
        const mensaje = await MensajeModel.findByIdAndDelete(mensajeId);

        if (!mensaje) {
            return res.status(404).json({ message: 'Mensaje no encontrado' });
        }

        Logging.info(`Mensaje ${mensajeId} eliminado`);
        return res.status(200).json({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Error al eliminar mensaje' });
    }
};
