
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const auth = async(req, res, next) => {
   const authToken = req.headers['authorization'];
   if(authToken != undefined){
        const token = authToken.split(" ")[1];
        jwt.verify(token, jwtSecret, (err, data) => {
            if(err){
                res.status(401).json({err: ["Token inválido!"]})
            }else{
                req.token = token;
                req.user = { id: data.id}
                next();
            }
        })

   }else{
        res.status(401).json({err: ["Token inválido!"]})
   }
};

module.exports = auth; 