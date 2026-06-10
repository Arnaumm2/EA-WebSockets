import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IOrganizacion } from '../models/Organizacion';
import { IUsuario } from '../models/Usuario';
import Logging from '../library/Logging';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);

            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    organizacion: {
        create: Joi.object<IOrganizacion>({
            name: Joi.string().required()
        }),
        update: Joi.object<IOrganizacion>({
            name: Joi.string().required()
        })
    },
    usuario: {
        create: Joi.object<IUsuario>({
            organizacion: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }),
        update: Joi.object<IUsuario>({
            organizacion: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })
    }
};
