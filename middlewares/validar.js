const { validationResult } = require("express-validator");

const validar = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) {
        return next()
    };
    const extErr = [];

    err.array().map((erro) => extErr.push(erro.msg));

    return res.status(422).json({err: extErr})
}

module.exports = validar