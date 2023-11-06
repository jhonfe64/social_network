const express = require('express');
const router = express.Router();
const {pruebaFollow} = require('../controllers/follow')

//definir las rutas

router.get("/prueba-follow", pruebaFollow)

//exportar router
module.exports = router