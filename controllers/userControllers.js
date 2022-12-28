
const knex = require("../config/conn")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { imageUpload } = require("../middlewares/images")

const jwtSecret = process.env.JWT_SECRET;

//----- Gerar Token -----
const gerarToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    });
};

const registros = async (req, res) => {
   const {name, email, password} = req.body;
   const salt = await bcrypt.genSaltSync(10)
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
const login = (req, res) => {
  const {email, password } = req.body;
  
  if(email != "" && password != "") {
      knex.select().where({email: email}).table("usuarios").then(data => {
         for(const user of data){
            if(email == user.email){
                var validate = bcrypt.compareSync(password, user.password);
                if(validate){
                    res.status(201).json({
                        id: user.id,
                        email: user.email,
                        image: user.image,
                        token: gerarToken(user.id)
                    })
                }else{
                    res.status(422).json({err: ["A senha não confere."]})
                }
            }else{
                res.status(422).json({err: ["O e-mail não confere."]})
            }
         }
     })
 }else{
    res.status(422).json({err: ["A senha e o e-mail são obrigatórios"]})
 }

}

const usuarioAtual = async(req, res) => {
    const user = req.user
    knex.select().table("usuarios").where({id: user.id}).then(data => {
        for(const user of data){
            res.status(200).json(user)
        }
    })
}

const update = async(req, res) => {
  const {name, password, bio} = req.body;
  const reqUser = req.user;
  const salt = await bcrypt.genSaltSync(10)
  const hash = await bcrypt.hash(password, salt)

    if(req.file){
       let image =req.file.filename        
        knex.where({id: reqUser.id}).update({
          name, password: hash, image, bio
        }).table("usuarios").then(() => {            
            knex.select().table("usuarios").where({id: reqUser.id}).then(data => {
                for(const user of data){
                    res.status(200).json(data)
                }
            })
                       
        }).catch(err => {
            res.send(reqUser.id)
        })
    }else{
       knex.where({id: reqUser.id}).update({
            name, password: hash, bio
          }).table("usuarios").then(() => {
            knex.select().table("usuarios").where({id: reqUser.id}).then(data => {
                for(const user of data){
                    res.status(200).json(data)
                }
            })
          }).catch(err => {
              res.send(reqUser.id)
          })

    }
}

const userId = async(req, res) => {
    const {id} = req.params;

    if(isNaN(id)){
        res.status(404).json({err: ["Usuário não encontrado."]})
    }else{
        knex.where({id}).table("usuarios").then(data => {
            for(const user of data){
                if(user.id != ""){
                   res.status(200).json(user) 
                }else{
                    res.status(404).json({err: ["Usuário não encontrado."]})  
                }                
            }
        }).catch(err => {
            console.log(err)
            res.status(404).json({err: ["Usuário não encontrado."]})
        })
    }
} 

const user = async(req, res) => {
    knex.select().table("usuarios").then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
    })
}

module.exports = {
    registros, login, usuarioAtual, update, userId, user
}

