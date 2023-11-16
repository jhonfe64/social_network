const { Schema, model, default: mongoose } = require("mongoose") 

const FollowSchema = new Schema({
    //los usuarios q dieron follow
    user: {
        type: Schema.ObjectId, 
        ref: "User"
    },
    //el usuario seguido
    follower: {
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Follow", FollowSchema, "follows")