const mongoose = require('mongoose')



const connection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mi_red_social');
        console.log("Conectado correctamenet a la base de datos mi_red_social")
    } catch (error) {
        console.log(error)
        throw new Error("Nos e ha podido conectar a la base de datos")
    }
}


module.exports = connection