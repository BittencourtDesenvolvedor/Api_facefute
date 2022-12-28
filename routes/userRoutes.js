const express = require("express");
const router = express.Router();

//----- Controllers -----
const { registros, login, usuarioAtual, update, userId, user } = require("../controllers/userControllers.js");


//----- middlewares -----
const validar = require("../middlewares/validar");
const { validarUsuario, validarLogin, atualizarUser,  } = require("../middlewares/validarUser");
const auth = require("../middlewares/autenticar.js");
const { imageUpload } = require("../middlewares/images")

//----- Rotas -----
router.post("/register", validarUsuario(), validar, registros)
router.post("/login", validarLogin(), validar, login )
router.get("/profile", auth, usuarioAtual)
router.put("/", auth, atualizarUser(),validar, imageUpload.single("image"), update  )
router.get("/",auth, user)
router.get("/:id", userId)




module.exports = router