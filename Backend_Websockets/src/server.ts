import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { config } from './config/config';
import Logging from './library/Logging';
import organizacionRoutes from './routes/Organizacion';
import usuarioRoutes from './routes/Usuario';
import mensajeRoutes from './routes/Mensaje';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { MensajeService } from './services/Mensaje';

const router = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Mongo connected successfully.');
        StartServer();
    })
    .catch((error) => Logging.error(error));

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        Logging.info(
            `Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
        );

        res.on('finish', () => {
            Logging.info(
                `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
            );
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use(cors());

    /** Swagger */
    router.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    /** Routes */
    router.use('/organizaciones', organizacionRoutes);
    router.use('/usuarios', usuarioRoutes);
    router.use('/mensajes', mensajeRoutes);

    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }));

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not found');

        Logging.error(error);

        res.status(404).json({
            message: error.message
        });
    });

    /** Create HTTP Server */
    const httpServer = http.createServer(router);

    /** Initialize Socket.io */
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "http://localhost:4200", // Angular default port
            methods: ["GET", "POST"]
        }
    });

    /** Initialize Mensaje Service para gestionar sockets */
    const mensajeService = new MensajeService(io);
    mensajeService.inicializarSockets();

    /** Listen on configured port via httpServer (NOT router.listen) */
    httpServer.listen(config.server.port, () =>
        Logging.info(`Server is running on port ${config.server.port}`)
    );
};