//acciones de prueba

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "MENSAGE ENVIDADO DESDE EL CONTROLADOR follow"
    })
}

//EXPORTAR ACCIONES

module.exports = {
    pruebaFollow
}