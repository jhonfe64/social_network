const express = require('express');
const router = express.Router();
const {auth} = require("../middlewares/auth")
const {pruebaUser, register, login} = require('../controllers/user')

//definir las rutas


router.get("/prueba-usuario", auth, pruebaUser)
router.post("/register", register)
router.post("/login", login)

//exportar router
module.exports = router