var jwt = require('jwt-simple');
const moment = require('moment')

const secret = "CLAVE_SECRETA_del_proyecto_DE_LA_RED_social_987987";


const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        rol: user.role,
        imagen: user.image,
        iat: moment().unix(), //cuando se creo la sesion la fecha
        exp: moment().add(30, "days").unix()  //cuando expira la sesiòn
    }

    //retornar el token codificado
    return jwt.encode(payload, secret)
}

module.exports = {
    createToken,
    secret
}