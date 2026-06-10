import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    organization: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' }
});

export default mongoose.model<IUser>('UserManual', UserSchema);
