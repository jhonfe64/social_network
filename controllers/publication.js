
//acciones de prueba

const pruebaPublication = (req, res) => {
    return res.status(200).send({
        message: "MENSAGE ENVIDADO DESDE EL CONTROLADOR publication"
    })
}

//EXPORTAR ACCIONES

module.exports = {
    pruebaPublication
}