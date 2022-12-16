
const knex = require("../config/conn")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

//----- Gerar Token -----
const gerarToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    });
};

const registros = async (req, res) => {
   const {name, email, password} = req.body;
   const salt = await bcrypt.genSalt()
   const hash = await bcrypt.hash(password, salt )

   knex.select().where({email: email}).table("usuarios").then(data => {
        if(data == ""){        
            knex.insert({name, email, password: hash}).into("usuarios").then(() => {   
                knex.select().where({email: email}).table("usuarios").then(u => {
                    for(const user of u){
                       if(user != ""){
                          res.status(201).json({
                             id: user.id,
                             email: user.email,
                             token: gerarToken(user.id)
                         })
                       }else{
                           res.status(422).json({err: ["Houve um erro, tente mais tarde."]})
                       } 
                    }
                }).catch(err => {
                    res.status(422).json({err: ["Houve um erro, tente mais tarde."]})
                })    
            })         
        }else{
            res.status(422).json({err: ["E-mail já cadastrado!"]})
        }            
  }).catch(err => {
    console.log(err)
  })
}    
   
 

module.exports = {
    registros,
}

