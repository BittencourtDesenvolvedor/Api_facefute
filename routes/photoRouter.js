const express = require("express");
const router = express.Router();

// controllers
const {inserirPhotos, deletarPhoto, carregarPhotos, carregarPhotosUsers, carregarPhotosId, atualizarPhotos} = require("../controllers/photoController")

// middlewares
const { validarPhotos, photoUpdate } = require("../middlewares/validarPhotos");
const validar = require("../middlewares/validar");
const auth = require("../middlewares/autenticar.js");
const { imageUpload } = require("../middlewares/images")

// routes

router.post("/", auth, imageUpload.single("image"), validarPhotos(), validar, inserirPhotos);
router.delete("/:id",auth, deletarPhoto);
router.get("/",auth, carregarPhotos);
router.get("/user/:id",auth, carregarPhotosUsers);
router.get("/:id",auth, carregarPhotosId);
router.put("/:id",auth,photoUpdate(), validar, atualizarPhotos);


module.exports = router