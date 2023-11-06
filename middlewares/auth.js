var jwt = require('jwt-simple');
const moment = require("moment")
const {secret} = require("../services/jwt")

const auth = (req, res, next) => {

    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene la cabecera de autenticacion"
        })
    }

    //quitamos comillas simples o dobles del token que viene del usuario

    let token = req.headers.authorization ? req.headers.authorization.replace(/["']+/g, '') : null;

    try {
      const payload = jwt.decode(token, secret)
      if(payload.exp <= moment().unix()){
        return res.status(401).send({
            status: "error",
            message: "Token expirado",
        })
      }

        //agregar los datos del usuario al request req
        req.user = payload
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
        })
    }
    //pasar a la siguiente accion, oasea al controlador
    next()
}

module.exports = {
    auth
}