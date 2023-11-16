const Follow = require("../models/follow")
const User = require("../models/user")

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "MENSAGE ENVIDADO DESDE EL CONTROLADOR follow"
    })
}

//accin de seguir


//accion de borrar un follow


//accion de listado de usarios que estoy siguinedo



//accion de listado de usuarios que me siguen



//EXPORTAR ACCIONES

module.exports = {
    pruebaFollow
}