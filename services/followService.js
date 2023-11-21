const Follow = require('../models/follow')

const followUserIds = async(identityUserId) => {
    //selecciona los usuarios que yo sigo
    try {

        let following = await Follow.find({"user": identityUserId}).select({"_id": 0, "__v":0, "user": 0}).exec()
   
        let followers = await Follow.find({"followed": identityUserId}).select({"user": 1, "_id": 0}).exec()


        return {
            following,
            followers
        }
        
    } catch (error) {
        return {}
    }

    
}

const followThisUser = (identityUserId, profileUserId) => {

}


module.exports = {
    followUserIds,
    followThisUser
}