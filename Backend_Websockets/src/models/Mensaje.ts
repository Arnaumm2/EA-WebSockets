import mongoose, { Document, Schema } from 'mongoose';

export interface IMensaje {
    contenido: string;
    usuario: mongoose.Types.ObjectId | string;
    organizacion: mongoose.Types.ObjectId | string;
    leido: boolean;
}

export interface IMensajeModel extends IMensaje, Document {}

const MensajeSchema: Schema = new Schema(
    {
        contenido: { type: String, required: true },
        usuario: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' },
        organizacion: { type: Schema.Types.ObjectId, required: true, ref: 'Organizacion' },
        leido: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IMensajeModel>('Mensaje', MensajeSchema);
