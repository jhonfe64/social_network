const express = require('express');
const router = express.Router();
const {pruebaPublication, save, detail, remove} = require('../controllers/publication')
const {auth} = require("../middlewares/auth")

//definir las rutas

router.get("/prueba-publication", pruebaPublication)
router.post("/save",auth,  save)
router.get("/detail/:id", auth, detail)
router.delete("/remove/:id", auth, remove)

//exportar router
module.exports = router