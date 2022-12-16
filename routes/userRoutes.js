const express = require("express");
const router = express.Router();

//----- Controllers -----
const { registros } = require("../controllers/userControllers.js");

//----- middlewares -----
const validar = require("../middlewares/validar");
const { validarUsuario } = require("../middlewares/validarUser")

//----- Rotas -----
router.post("/register", validarUsuario(), validar, registros)



module.exports = router