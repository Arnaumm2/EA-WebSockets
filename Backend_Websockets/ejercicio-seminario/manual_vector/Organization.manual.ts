import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
    name: string;
    users: mongoose.Types.ObjectId[]; // ARRAY MANUAL (El "Vector")
}

const OrganizationSchema: Schema = new Schema({
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'UserManual' }] // Guardamos IDs aquí
});

export default mongoose.model<IOrganization>('OrganizationManual', OrganizationSchema);
