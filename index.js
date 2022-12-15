require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT;

const router = require("./routes/Router")
const conn = require("./config/conn")

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(router)



app.listen(port, () => {
    console.log("App Rodando")
})

