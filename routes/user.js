const express = require('express');
const router = express.Router();
const {auth} = require("../middlewares/auth")
const {pruebaUser, register, login, profile, list, update, upload, avatar} = require('../controllers/user')
const multer = require("multer")


//config multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar"+Date.now()+"-"+file.originalname)
    }
})

const uploads = multer({storage})


//definir las rutas
router.get("/prueba-usuario", auth, pruebaUser)
router.post("/register", register)
router.post("/login", login)
router.get("/profile/:id", auth, profile)
router.get("/list/:page?", auth, list)
router.put("/update", auth, update)
router.post("/upload", [auth, uploads.single("file0")], upload)
router.get("/avatar/:file", auth, avatar)


//exportar router
module.exports = router