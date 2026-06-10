import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
    name: string;
    // Aquí NO guardamos el array de usuarios manualmente
}

const OrganizationSchema: Schema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        toJSON: { virtuals: true }, // Importante para que los virtuals se vean en JSON
        toObject: { virtuals: true }
    }
);

/**
 * CAMPO VIRTUAL: "dondeEstanMisUsuarios"
 * No se guarda en la DB, pero Mongoose lo calcula al hacer .populate()
 */
OrganizationSchema.virtual('misUsuarios', {
    ref: 'User',            // El modelo que queremos buscar
    localField: '_id',      // Mi campo (ID de Organización)
    foreignField: 'organization', // El campo en el Usuario que me referencia
    justOne: false          // Queremos que sea un array (todos los usuarios)
});

/**
 * MIDDLEWARE: Borrado en cascada
 * Si borras la organización, este código borraría a todos sus usuarios
 */
OrganizationSchema.pre('findOneAndDelete', async function (next) {
    const organizationId = this.getQuery()._id;
    await mongoose.model('User').deleteMany({ organization: organizationId });
    next();
});

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
