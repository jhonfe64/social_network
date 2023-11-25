const Follow = require("../models/follow")
const User = require("../models/user")
const mongoosePaginate = require("mongoose-pagination")
const followService = require("../services/followService")

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "MENSAGE ENVIDADO DESDE EL CONTROLADOR follow"
    })
}

//accin de seguir aun usuario
const save = async (req, res) => {

   //id del usuario que quiero seguir
   const {id} = req.body
   //usaurio que inicio sesiòn
   const identity = req.user

   const userToFollow = new Follow({
    user: identity.id, //el usuario quee inicio sesion
    followed: id //id del usuario que estoy siguiendo ahora
   })
   //userToFollow.user = identity.id; el usuario quee inicio sesion
   //userToFollow.followed = id id del usuario que estoy siguiendo ahora

   //guardar 

   try {
    const savedFollowedUser = await userToFollow.save()
    if(!savedFollowedUser){
        return res.status(404).json({
            status: "not found",
            message: "No se puede seguir este usuario"
        })
    }
    return res.status(200).json({
        status: "success",
        message: "Estas siguiendo este usuario",
        user: req.user,
        followed: savedFollowedUser
    })

   } catch (error) {
    return res.status(500).json({
        status: "error",
        message: "No se puede seguir este usuario"
    })
   }
}

//accion de borrar un follow
const unfollow = async (req, res) => {
    const {id:followedId} = req.params
    const userId = req.user.id

    try {
        const followeduser = await Follow.find({_id: followedId}, {user: userId}).exec()

        if(!followeduser || followeduser.length <= 0){
            return res.status(404).json({
                status: "error",
                message: "No se encuentre el seguidor"
            })
        }

        const deleteFollower = await Follow.deleteOne({_id: followedId}).exec()

        if(deleteFollower){
            return res.status(200).json({
                status: "success", 
                message: "se ha eliminado el seguidor"
            })
        } 
    } catch (error) {
        return res.status(500).json({
            status: "error", 
            message: "no se ha podido eliminar el seguidor"+error.message
        })
    }
}

//accion de listado de usarios que el que inicia cesion esta siguiendo (siguiendo)
const following = async (req, res)=>{

    let userId = req.user.id
    const {id} = req.params

    if(req.params.id) userId = id

    let page = 1

    if(req.params.page) {
        page = req.params.page
    }

    //usuarios por pagina
    const itemsPerPage = 5;

    try {
        const followedUsers = await Follow.find({user: userId}).populate("user followed", "-password -role -__v").paginate(page, itemsPerPage)
        

        if(followedUsers.length == 0) {
            return res.status(200).json({
                status: "success",
                message: "no estas siguiendo a nadie"
            })
        }

        //lista de los que sigo y me siguen
        let followUserIds = await followService.followUserIds(req.user.id)
     
    
        return res.status(200).json({
            status: "success",
            message: "estos son los usuarios a los que estas siguiendo",
            followedUsers,
            user_following: followUserIds.following,
            users_follow_me: followUserIds.followers
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se encuentran seguidores"
        })
    }
}


//accion de listado de usuarios que me siguen (soy seguido)
const followers = async (req, res) => {

    let userId = req.user.id
    const {id} = req.params

    if(req.params.id) userId = id

    let page = 1

    if(req.params.page) {
        page = req.params.page
    }

    //usuarios por pagina
    const itemsPerPage = 5;

    
    try {
        const followedUsers = await Follow.find({followed: userId}).populate("user followed", "-password -role -__v").paginate(page, itemsPerPage)
        

        if(followedUsers.length == 0) {
            return res.status(200).json({
                status: "success",
                message: "no estas siguiendo a nadie"
            })
        }

        //lista de los que sigo y me siguen
        let followUserIds = await followService.followUserIds(req.user.id)
     
    
        return res.status(200).json({
            status: "success",
            message: "estos son los usuarios que m esiguen",
            followedUsers,
            user_following: followUserIds.following,
            users_follow_me: followUserIds.followers
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se encuentran seguidores"
        })
    }
}


//EXPORTAR ACCIONES

module.exports = {
    pruebaFollow,
    save,
    unfollow,
    following,
    followers
}