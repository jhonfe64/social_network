const User = require("../models/user");
const bcrypt = require("bcrypt");
const {createToken, secret} = require('../services/jwt')


//acciones de prueba

const pruebaUser = (req, res) => {
  return res.status(200).send({
    message: "MENSAGE ENVIDADO DESDE EL CONTROLADOR user",
    usuario: req.user
  });
};

//Registrar usuario

const register = async (req, res) => {
  const params = req.body;

  //validar datos
  if (!params.name || !params.email || !params.password || !params.nick) {
    return res.status(400).json({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  //crear objeto de usuario
  const user_to_save = new User(params);

  //control de usuarios duplicados
  //or ssirve para encontrar un documento por una o varias condiciones
  try {
    const findDuplicatedUser = await User.find({
      $or: [{ email: user_to_save.email }, { nick: user_to_save.nick }],
    }).exec();

    if (findDuplicatedUser && findDuplicatedUser.length >= 1) {
      return res.status(200).send({
        status: "success",
        message: "El usario ya existe",
      });
    }

    //encriptando la contraseña, guaradr en base de datos

    bcrypt.hash(user_to_save.password, 10, async (err, password) => {
      user_to_save.password = password;

      //guardar en la base de datos

      const saved_user = await user_to_save.save();
      if (!saved_user) {
        return res.status(500).send({
          status: "error",
          message: "Error al guardar al usuario",
        });
      } else {
        //si si guarda el usuario lo debuelve
        return res.status(200).json({
          status: "success",
          message: "Accion de registro de usuarios",
          user_to_save,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en la consulta de usuarios",
    });
  }
};

const login = async (req, res) => {


  const params = req.body;

  if (!params.email || !params.password) {
    return res.status(400).json({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  //buscar si el usuario existe por email
  try {
    const foundUser = await User.findOne({ email: params.email }).select({}).exec()

    //si no existe
    if (!foundUser) {
      return res.status(404).json({
        status: "Error",
        message: "El usuario no existe",
      });
    }

    //comparamso si la clave q puso el usuario es igual a la de la base de datos
    const pwd = bcrypt.compareSync(params.password, foundUser.password)

    if(!pwd){
      return res.status(404).json({
        status: "error",
        message: "No te has identificado correctamente"
      })
    }

    //crear el token
    const token = createToken(foundUser)

    //si existe
    return res.status(200).json({
      status: "success",
      message: "Te has logueado correctamente",
      user: {
        id: foundUser.id,
        name: foundUser.name,
        nick: foundUser.nick
      },
      token
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: error
    });
  }
};

//EXPORTAR ACCIONES

module.exports = {
  pruebaUser,
  register,
  login,
};
