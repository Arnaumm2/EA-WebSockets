import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrganizacion {
    name: string;
}

export interface IOrganizacionModel extends IOrganizacion, Document {}

const OrganizacionSchema: Schema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IOrganizacionModel>('Organizacion', OrganizacionSchema);
