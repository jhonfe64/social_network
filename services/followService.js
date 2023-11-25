const Follow = require('../models/follow')

const followUserIds = async(identityUserId) => {
    //selecciona los usuarios que yo sigo
    try {
        //los que me siguen
        let following = await Follow.find({"user": identityUserId}).select({"_id": 0, "__v":0, "user": 0}).exec()
        //a quienes sigo
        let followers = await Follow.find({"followed": identityUserId}).select({"user": 1, "_id": 0}).exec()

        //procesar array de identificadores
        let following_clean = []

        following.forEach((follow)=>{
            following_clean.push(follow.followed)
        })


        let followers_clean = []

        followers.forEach((follow)=>{
            followers_clean.push(follow.user)
        })


        return {
            following: following_clean,
            followers: followers_clean
        }
        
    } catch (error) {
        return {}
    }

    
}

const followThisUser = async (identityUserId, profileUserId) => {
      //Comprobar si lo sigo
      let following = await Follow.findOne({"user": identityUserId, "followed": profileUserId}).exec()
      //conprobar si me sigue
      let follower = await Follow.findOne({"user": profileUserId, "followed": identityUserId}).exec()

      return {
        following,
        follower
      }
}


module.exports = {
    followUserIds,
    followThisUser
}