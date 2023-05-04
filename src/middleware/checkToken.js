const jwt = require('jsonwebtoken')

const checkToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({msg: "Acesso Negado"})
    }

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)
        const userId = decoded.id
        req.userId = userId
        next()
    } catch (err) {
        res.status(400).json({msg: "Token inválido"})
    }
}

module.exports = checkToken