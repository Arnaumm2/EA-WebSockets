import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario {
    name: string;
    email: string;
    password: string;
    organizacion: mongoose.Types.ObjectId | string;
}

export interface IUsuarioModel extends IUsuario, Document {
    createdAt: Date;
}

const UsuarioSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        organizacion: { type: Schema.Types.ObjectId, required: true, ref: 'Organizacion' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IUsuarioModel>('Usuario', UsuarioSchema);
