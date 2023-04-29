const prisma = require('../databases')

const getAllUsers = async (req, res) => {
    const user = await prisma.user.findMany()
    return res.status(200).json(user)
}

const newUser = async (req, res) => {
    const { body } = req
    const user = await prisma.user.create({
        data: {
            ...body
        }
    })

    return res.status(201).json(user)
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
    const product = await prisma.product.create({
        data: {
            ...body,
            author: {
                connect: {
                    id: 2
                }
            }
        }
    })

    return res.status(201).json(product)
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
    newUser,
    newProduct,
    getAllProducts,
    getProductId,
    deleteProduct
}