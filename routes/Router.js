const express = require("express");
const router = express();

router.use("/users", require("./userRoutes"));

router.get("/", (req, res) => {
    res.send("testando as rotas")
})

module.exports = router;