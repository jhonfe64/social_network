const { Schema, model, default: mongoose } = require("mongoose") 

const FollowSchema = new Schema({
    //El id del usuario que inici asesiòn
    user: {
        type: Schema.ObjectId, 
        ref: "User"
    },
    //el usuario seguido
    followed: {
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Follow", FollowSchema, "follows")