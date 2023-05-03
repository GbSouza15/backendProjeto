const prisma = require('../databases')
const jwt = require('jsonwebtoken')

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

const removeProduct = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const secret = process.env.SECRET
    const decoded = jwt.verify(token, secret)
    const userId = decoded.id
    const { id } = req.params 

    try {

        const product = await prisma.product.findFirst({
            where: {
                id: Number(id),
                authorId: userId 
            }
        })

        if (!product) {
            return res.status(404).json({msg: "Produto não encontrado"})
        }

        const productRemoved = await prisma.product.delete({
            where: {
                id: product.id
            }
        })


        return res.status(200).json({msg: "Produto removido"})

    } catch(error) {
        console.log(error);
        console.log('Erro ao remover produto');
    }
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

module.exports = {
    newProduct,
    getAllProducts,
    getProductId,
    removeProduct
}