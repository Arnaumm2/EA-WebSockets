/**
 * ❌ ESTRATEGIA: VECTOR MANUAL (NO RECOMENDADA)
 * 
 * En este ejemplo vemos la cantidad de código extra y el riesgo que 
 * supone mantener la base de datos sincronizada "a mano".
 */
import OrganizationManual from './Organization.manual';
import UserManual from './User.manual';

const crearUsuarioConSincronizacionManual = async (name: string, orgId: string) => {
    // 1. Crear el usuario
    const nuevoUsuario = await UserManual.create({ name, organization: orgId });

    // ⚠️ RIESGO: Si la aplicación se cae aquí, el usuario existe pero la organización NO lo conoce.
    await OrganizationManual.findByIdAndUpdate(orgId, { 
        $push: { users: nuevoUsuario._id } 
    });

    console.log("Usuario creado y guardado en el vector de la organización");
};

const borrarUsuarioConSincronizacionManual = async (usuarioId: string) => {
    // 1. Buscar al usuario para saber a qué organización pertenece
    const usuario = await UserManual.findById(usuarioId);
    if (!usuario) return;

    const orgId = usuario.organization;

    // 2. Borrar el usuario
    await UserManual.findByIdAndDelete(usuarioId);

    // ⚠️ RIESGO: Si falla este paso, la organización tendrá un ID que apunta a la nada ("ID Huérfano").
    await OrganizationManual.findByIdAndUpdate(orgId, { 
        $pull: { users: usuarioId } 
    });

    console.log("Usuario borrado y su ID eliminado del vector de la organización");
};

const cambiarUsuarioDeOrganizacionManual = async (usuarioId: string, nuevaOrgId: string) => {
    const usuario = await UserManual.findById(usuarioId);
    if (!usuario) return;

    const viejaOrgId = usuario.organization;

    // 1. Actualizar usuario
    usuario.organization = nuevaOrgId as any;
    await usuario.save();

    // 2. TRABAJO EXTRA: Quitar de la vieja
    await OrganizationManual.findByIdAndUpdate(viejaOrgId, { $pull: { users: usuarioId } });

    // 3. TRABAJO EXTRA: Añadir a la nueva
    await OrganizationManual.findByIdAndUpdate(nuevaOrgId, { $push: { users: usuarioId } });
    
    console.log("Sincronización manual completa al mover de empresa");
};
