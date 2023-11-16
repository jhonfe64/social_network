const User = require("../models/user");
const bcrypt = require("bcrypt");
const { createToken, secret } = require("../services/jwt");
const paginate = require("mongoose-pagination");
const fs = require("fs");

//acciones de prueba
const pruebaUser = (req, res) => {
  return res.status(200).send({
    message: "MENSAGE ENVIDADO DESDE EL CONTROLADOR user",
    usuario: req.user,
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
    const foundUser = await User.findOne({ email: params.email })
      .select({})
      .exec();

    //si no existe
    if (!foundUser) {
      return res.status(404).json({
        status: "Error",
        message: "El usuario no existe",
      });
    }

    //comparamso si la clave q puso el usuario es igual a la de la base de datos
    const pwd = bcrypt.compareSync(params.password, foundUser.password);

    if (!pwd) {
      return res.status(404).json({
        status: "error",
        message: "No te has identificado correctamente",
      });
    }

    //crear el token
    const token = createToken(foundUser);

    //si existe
    return res.status(200).json({
      status: "success",
      message: "Te has logueado correctamente",
      user: {
        id: foundUser.id,
        name: foundUser.name,
        nick: foundUser.nick,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: error,
    });
  }
};

//obtener la info del usuario
const profile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .select({ password: 0, role: 0 })
      .exec();
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }
    //aqui tambien se debuleven los datos de follows
    return res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se puede obtener le usuario",
    });
  }
};

//listar todos los usuarios
const list = async (req, res) => {
  let actualPage = 1;
  let { page } = req.params;

  if (page != undefined) {
    actualPage = page;
  }

  page = parseInt(page);
  //cantidad de usuarios por pagina
  const itemsPerPage = 2;

  //numero de pagina
  let numberOfpages = 1;

  try {
    const users = await User.find()
      .select({ password: 0, role: 0 })
      .sort("_id")
      .paginate(page, itemsPerPage);
    //users2 se usa para la longitud total del array porq la anterior consulta solo da los items de cada pagina
    const users2 = await User.find();

    if (users2.length > 0) {
      numberOfpages = Math.ceil(users2.length / itemsPerPage);
    }

    if (!users || users.length <= 0) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron usuarios",
      });
    }

    return res.status(200).json({
      status: "success",
      users: users,
      page,
      total_users: users.length,
      pages: numberOfpages,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en la consulta",
    });
  }
};

//editar un usuario
const update = async (req, res) => {
  //sacamos el usuario de del objeto request req
  //osea es el usuario que inicio sesiòn
  const userIdentity = req.user;
  delete userIdentity.iat;
  delete userIdentity.exp;
  delete userIdentity.rol;
  delete userIdentity.imagen;

  //obtenemos los  datos que nos envian del form para actualizar
  const userToUpdaTe = req.body;

  //Comprobamos si el usuario ya existe
  try {
    const findDuplicatedUser = await User.find({
      $or: [{ email: userToUpdaTe.email }, { nick: userToUpdaTe.nick }],
    }).exec();

    let userIsset = false;

    findDuplicatedUser.forEach((user) => {
      const userId = user._id.toString().split('"');
      const finalUserId = userId[0];

      //si el ._id del usuario que encontramos en la base de datos es igual al
      //al usaurio que inicio sesion que sacamos del objeto request req que sale al iniciar sesion
      if (user && finalUserId != userIdentity.id) {
        userIsset = true;
      }
    });

    if (userIsset) {
      return res.status(200).send({
        status: "success",
        message: "El usario ya existe",
      });
    }

    //encriptando la contraseña, nueva
    bcrypt.hash(userToUpdaTe.password, 10, async (err, password) => {
      userToUpdaTe.password = password;

      try {
        const updatedUser = await User.findByIdAndUpdate(
          userIdentity.id,
          userToUpdaTe,
          { new: true }
        );
        return res.status(200).json({
          status: "success",
          user: updatedUser,
        });
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "no se pudo actualizar el usuario",
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

//subir imagen
const upload = async (req, res) => {
  //recoger la imagen
  if (!req.file) {
    return res.status(404).json({
      status: "404",
      message: "la peticion no incluye la imagen",
    });
  }

  const image = req.file.originalname;
  const extension = image.split(".")[1];

  //borrar archivo si no coincide la extension
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).json({
      status: "error",
      message: "Extension del fichero invalida",
    });
  }

  try {
    //solo recibe objetos
    const userUpdated = await User.findOneAndUpdate({_id: req.user.id}, { image: req.file.filename }, { new: true }
    );

    if (!userUpdated) {
      return res.status(500).json({
        status: "error",
        message: "no se pudo subir la imagen",
      });
    }

    return res.status(200).json({
        status: "success",
        user: userUpdated,
        file: req.file,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "no se pudo subir la imagen"+error,
     })
  }
};

const avatar = async (req, res) => {

  const id = req.user.id

  const user = await User.findById(id)
  const image =  user.image


  return res.status(200).json({
    status: "success",
    message: "Este espara obtener el avatar",
    id,
    image
  })
}

//EXPORTAR ACCIONES

module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  list,
  update,
  upload,
  avatar
};
