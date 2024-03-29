const Publication = require("../models/publication");
const followService = require("../services/followService");

//acciones de prueba
const pruebaPublication = (req, res) => {
  return res.status(200).send({
    message: "MENSAGE ENVIDADO DESDE EL CONTROLADOR publication",
  });
};

//guardar publicacion
const save = async (req, res) => {
  const params = req.body;
  console.log("estos son los params", params);

  if (!params.text) {
    return res.status(400).json({
      status: "error",
      message: "Debes enviar el texto de la publicacion",
    });
  }

  //Objetodo del modelo
  const newPublication = new Publication(params);
  newPublication.user = req.user.id;

  //guaradar el objeto
  try {
    const savedPublication = await newPublication.save();

    if (!savedPublication) {
      return res.status(500).json({
        status: "error",
        message: "No se ha podido guardar la publicacion",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Se ha guardado la publicacion",
      savedPublication,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se ha podido guardar la publicacion",
    });
  }
};

//mostrar una sola publicacion
const detail = async (req, res) => {
  //sacar el id
  const publicationId = req.params.id;

  //hacer el find para obtener la publicacion
  try {
    const publication = await Publication.findById(publicationId);
    if (!publication)
      return res
        .status(400)
        .json({ status: "error", message: "No existe esta publicacion" });
    return res.status(200).json({
      status: "success",
      publication,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se puede obtener la publicacion",
    });
  }
};

//eliminar publicaciones
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await Publication.findByIdAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!removed) {
      return res.status(404).json({
        status: "error",
        message: "esta publicacion no existe",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "se esta borrando una publicacion",
      publicationId: id,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se ha podido borrar la publicacion",
    });
  }
};

//listar todas las publicaciones del usuario por id + populate
const user = async (req, res) => {
  const { id: userId } = req.params;

  //populamos para traer las publicaciones con el usaurio
  try {
    const userPublications = await Publication.find({ user: userId })
      .sort("-created_at")
      .populate("user", "-password")
      .exec();

    if (!userPublications) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron publicaciones",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "ESTA ES LA LISTA DE PUBLICACIONES DE UN USUARIO",
      user: req.user,
      userId,
      userPublications,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se cargaron publicaciones",
    });
  }
};

//listar publicaciones de los usarios que yoe stoy siguiendo
const feed = async (req, res) => {
  //sacar el array de ids de los usuarios que yo sigo como usuario logueado
  try {
    const myFollows = await followService.followUserIds(req.user.id);

    // const publications = await Publication.find({
    //   user: myFollows.following,
    // }).exec();

    const publications = await Publication.find({user: { $in: myFollows.following }})
      .populate("user")
      .sort("-created_at");

    //buscar las publicaciones correspondientes a esos ids

    return res.status(200).json({
      status: "success",
      message: "estos son los ids de los usuarios que sigo",
      myFollows: myFollows.following,
      publications,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudieron obtener los seguidores",
    });
  }
};

//subir fficheros

//devolver imagenes

//EXPORTAR ACCIONES

module.exports = {
  pruebaPublication,
  save,
  detail,
  remove,
  user,
  feed,
};
