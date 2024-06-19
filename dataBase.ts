
import mongoose from 'mongoose';

require('dotenv').config();
const dbUri = process.env.URI_DATABASE || "";

mongoose.connect(dbUri, {})
    .then(() => {
        console.log(`¡Conexión a la base de datos establecida correctamente! 🎉🚀`);
    })
    .catch(error => {
        console.log(`
            Oops! ¡Hubo un error al conectar a la base de datos! 😔🔥
            ---------------------------------------------------------
            ${error}
            ---------------------------------------------------------
        `);
    })