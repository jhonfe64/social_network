const { Schema, model, default: mongoose } = require("mongoose") 

const PublicationSchema = new Schema({
    //El id del usuario que inici asesiòn
    user: {
        type: Schema.ObjectId, 
        ref: "User"
    },
    //el usuario seguido
    text: {
        type: String,
        require: true
    },
    //imagenes videos etc
    file: String,

    created_at: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Publication ", PublicationSchema, "publications")