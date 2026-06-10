/**
 * ✨ ESTRATEGIA: VIRTUALS (RECOMENDADO)
 * 
 * La relación se calcula en tiempo de ejecución. 
 * ¡Imposible que se desincronice!
 */

import Organization from './Organization.example';
import User from './User.example';

const ejemploUso = async () => {
    // 1. Crear una organización
    const org = await Organization.create({ name: 'Google' });

    // 2. Crear usuarios asociados a esa organización
    await User.create({ name: 'Pol', organization: org._id });
    await User.create({ name: 'Juan', organization: org._id });

    // 3. OBTENER LA ORGANIZACIÓN CON SUS USUARIOS (Sin haberlos guardado en el array)
    // Usamos .populate('nombreDeLaVirtual')
    const orgConUsuarios = await Organization.findById(org._id).populate('misUsuarios');
    
    console.log(orgConUsuarios);
    /** El objeto devuelto se vería algo así:
    {
        _id: "...",
        name: "Google",
        misUsuarios: [
            { _id: "...", name: "Pol", organization: "..." },
            { _id: "...", name: "Juan", organization: "..." }
        ]
    }
    */
}
