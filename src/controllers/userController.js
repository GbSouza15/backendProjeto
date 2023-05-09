const prisma = require('../databases')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')


const registerUser = async(req, res) => {
    const {email, password, name, phone } = req.body

    const verifyUserExist = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (verifyUserExist) {
        return res.status(400).json({msg: "Email já cadastrado!"})
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({msg: "Email inválido"})
    }

    if (!validator.isStrongPassword(password, {minLength: 8})) {
        return res.status(400).json({msg: "Senha inválido"})
    }

    if (!validator.isAlpha(name, 'pt-BR', {ignore: ' '})) {
        return res.status(400).json({msg: "Nome inválido. Deve conter apenas letras e espaços;"})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data: {
            email,
            password: passwordHash,
            name, 
            phone
        }
    })

    res.status(201).json({msg: "Usuário criado"})
}
 
const login = async (req, res) => {

    const {email, password} = req.body

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (!user) {
        return res.status(400).json({msg: "Usuário não encontrado"})
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(401).json({msg: "Senha inválida"})
    }
 
    try {
 
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user.id,
            userId: user.id
        }, secret, {expiresIn: '15m'})

        const decoded = jwt.verify(token, secret)
        const userId = decoded.id

        res.status(200).json({msg : "Autenticação realizada", token, userId})

    } catch(err) {
        console.log(err);
    }
}

const getAllUsers = async (req, res) => {
    const user = await prisma.user.findMany()
    return res.status(200).json(user)
}

module.exports = {
    getAllUsers,
    registerUser,
    login
}