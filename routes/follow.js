const express = require('express');
const router = express.Router();
const {pruebaFollow, save, unfollow, following, followers} = require('../controllers/follow')
const {auth} = require("../middlewares/auth")

//definir las rutas

router.get("/prueba-follow", pruebaFollow)
router.post("/save", auth, save)
router.delete("/unfollow/:id", auth, unfollow)
router.get("/following/:id/:page?", auth,  following)
router.get("/followers/:id/:page?", auth,  followers)


//exportar router
module.exports = router