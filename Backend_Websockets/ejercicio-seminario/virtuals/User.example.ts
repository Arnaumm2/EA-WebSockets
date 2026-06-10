import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    organization: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        // El usuario guarda la referencia a la organización
        organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' }
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
