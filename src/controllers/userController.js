const prisma = require('../databases')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')


const registerUser = async(req, res) => {
    const {email, password, name} = req.body

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
            name
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

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(404).json({msg: "Senha inválida"})
    }

    try {
 
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user.id,
            userId: user.id
        }, secret)

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

const getAllProducts = async (req, res) => {
    const products = await prisma.product.findMany()
    return res.status(200).json(products)
}

const getProductId = async (req, res) => {
    const { authorId } = req.params
    const product = await prisma.product.findMany({
        where: {
            authorId: Number(authorId)
        }
    })

    console.log(authorId);
    return res.status(200).json(product)
}

const newProduct = async (req, res) => {
    const { body } = req
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)
        const userId = decoded.id

        const product = await prisma.product.create({
            data: {
                ...body,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return res.status(201).json(product)

    } catch(error) {
        console.log(error)
        return res.status(500).json({msg: "Erro ao criar o produto"})
    }
    
}

const deleteProduct = async (req, res) => {
    const { id } = req.params
    const product = await prisma.product.delete({
        where: {
            id: Number(id)
        }
    })

    return res.status(202).json({msg: "Produto deletado"})
}

module.exports = {
    getAllUsers,
    newProduct,
    getAllProducts,
    getProductId,
    deleteProduct,
    registerUser,
    login
}