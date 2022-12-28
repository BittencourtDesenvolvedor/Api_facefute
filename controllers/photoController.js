const { setRandomFallback } = require("bcryptjs");
const knex = require("../config/conn");

const inserirPhotos = async (req, res) => {
    const { title } = req.body;
    const image = req.file.filename;
    const reqUser = req.user;

    knex.insert({
       title, image, idUser: reqUser.id 
    }).into("fotos").then(() => {
            knex.select().table("fotos").where({image: image}).then(data => {
            res.status(200).json(data)
            }).catch(err => {
                console.log(err)
            })
    }).catch(err => {
        console.log(err)
    })   
}

const deletarPhoto = async(req, res) => {
    const { id } = req.params;

    if(isNaN(id)){
        res.status(422).json({err: ["Foto não encontrada."]})
    }else{
        knex.delete().table("fotos").where({id: id}).then(data => {
            if(data == 1){                
                  res.status(200).json({Sucesso: ["Foto excluida com sucesso!"]})                               
            }else{
                res.status(404).json({err: ["Foto não encontrada!"]}) 
            }            
        }).catch(err => {
            res.status(422).json({err: ["Ocorreu um erro, por favor tente mais tarde."]})
        })
    }
}

const carregarPhotos = async(req, res) => {
    knex.select().table("fotos").orderBy("id", "desc").then(data => {
          res.status(200).json(data)
    }).catch(err => {
        console.log(err)
    })
}

const carregarPhotosUsers = async(req, res) => {
    const { id } = req.params;
    knex.select().table("fotos").where({idUser: id}).orderBy("id", "desc").then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
    })
}

const carregarPhotosId = async(req, res) => {
    const { id } = req.params;
    knex.select().table("fotos").where({id: id}).then(data => {
        if(data != ""){
            res.status(200).json(data)
        }else{
            res.status(404).json({err: ["Foto não encontrada"]})
        }
    }).catch(err => {
        res.status(404).json({err: ["Foto não encontrada"]})
    })
}

const atualizarPhotos = async(req, res) => {
    const { id } = req.params;
    const { title } = req. body;
    const reqUser = req.user;
    knex.select().table('fotos').where({id: id}).then(data => {
        if(data != ""){
            knex.select().table("fotos").where({idUser: reqUser.id}).andWhere({id: id}).then(user => {
                if(user!= ""){
                     knex.where({id: id}).table('fotos').update({title}).then(up => {
                         if(up == 1){
                            res.status(200).json({Sucesso: ["Foto atualizada com sucesso"]})
                         }else{
                            res.status(422).json({err: ["Opss!!!, Algo de errado, tente mais tarde"]})
                         }
                     }).catch(err => {
                        res.status(422).json({err: ["Opss!!!, Algo de errado, tente mais tarde"]})
                     })
                }else{
                    res.status(422).json({err: ["Opss!!!, Algo de errado, tente mais tarde"]})
                }
            })

        }else{
            res.status(404).json({err: ["Foto não encontrada"]})
        }
    }).catch(err => {
        res.status(404).json({err: ["Foto não encontrada"]})
    })
    
}

module.exports = {
    inserirPhotos, deletarPhoto, carregarPhotos, carregarPhotosUsers, carregarPhotosId, atualizarPhotos,
}