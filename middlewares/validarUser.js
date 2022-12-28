const {body} = require("express-validator");

const validarUsuario = () => {
    return [
        body("name")
            .isString()
            .withMessage("O Nome é obrigatório.")
            .isLength({min: 3})
            .withMessage("O Nome precisa ter no mínimo 3 caracteres."),
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório.")
            .isEmail()
            .withMessage("Insira um e-mail válido."),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória.")
            .isLength({min: 6})
            .withMessage("A senha precisa ter no mínimo 6 caracteres."), 
        body("confpassword")
            .isString()
            .withMessage("Confirme a sua senha!")
            .custom((value, {req}) => {
                if(value != req.body.password) {
                    throw new Error("As senhas não conferem.")
                }
                return true
            })    
    ]
}

const validarLogin = () => {
    return [
        body("email")
        .isString()
        .withMessage("O e-mail é obrigatório.")
        .isEmail()
        .withMessage("Insira um e-mail válido."),
        body("password")
        .isString()
        .withMessage("A senha é obrigatória."),
    ] 
}

const atualizarUser = () => {
    return [
        body("name")
        .optional()
        .isLength({min: 3})
        .withMessage("O Nome precisa ter no mínimo 3 caracteres."),
    body("password")
        .optional()
        .isLength({min: 6})
        .withMessage("A senha precisa ter no mínimo 6 caracteres."), 
    
    ]
}


module.exports = {
    validarUsuario, validarLogin,atualizarUser,
}