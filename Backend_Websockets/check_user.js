
const mongoose = require('mongoose');
const MONGO_URI = "mongodb://localhost:27017/sem1";

async function checkUser() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('Usuario', new mongoose.Schema({ email: String }));
        const user = await User.findOne({ email: 'marc.martin.cuartero@gmail.com' });
        if (user) {
            console.log('USER_EXISTS:', user);
        } else {
            console.log('USER_NOT_FOUND');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

checkUser();
