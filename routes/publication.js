const express = require('express');
const router = express.Router();
const {pruebaPublication} = require('../controllers/publication')

//definir las rutas

router.get("/prueba-publication", pruebaPublication)

//exportar router
module.exports = router