
const connection = require('./database/connection')
const express = require('express')
const cors = require('cors')
const router = express.Router()
const followRoutes = require('./routes/follow')
const publicationRoutes = require('./routes/publication')
const userRoutes = require('./routes/user')


//conexion base de datos
connection()

//cear servidor de node
const app = express();
const port = 3000;

//configurar cors
app.use(cors())

//convert los datos del body a objetosjs
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//cargar las rutas
app.use("/api/follow", followRoutes)
app.use("/api/user", userRoutes)
app.use("/api/publication", publicationRoutes)


//poner a escuchgar el servidor
app.listen(port, ()=>{
    console.log("servidor en el puerto"+port)
})

