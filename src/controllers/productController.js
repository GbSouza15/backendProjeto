const prisma = require('../databases')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');

const newProduct = async (req, res) => {
    const { name, price, description } = req.body

    await body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Selecione um arquivo para upload');
      }
      if (!req.file.mimetype.startsWith('image/')) {
        throw new Error('Somente arquivos de imagem são permitidos');
      }
      return true;
    })
    .run(req);

  // Verifica se houve algum erro de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    try {
        const userId = req.userId
        const imgUrl = req.file.path
 
        const product = await prisma.product.create({
            data: {
                name,
                price,
                description,
                img: imgUrl,

                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        // const productWithImageUrl = {
        //     ...product,
        //     img: `${req.protocol}://${req.get('host')}/${product.img}`
        //   };
        

        return res.status(201).json(product)

    } catch(error) {
        console.log(error)
        return res.status(500).json({msg: "Erro ao criar o produto"})
    }
    
}

const removeProduct = async (req, res) => {
    const userId = req.userId
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
    const { id } = req.params

    try {

        const product = await prisma.product.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!product) {
            return res.status(404).json({msg: "Produto não encontrado"})
        }


        return res.status(200).json(product)

    } catch(error) {
        console.log(error);
    }
}

const getProductAuthId = async (req, res) => {
    const { authorId } = req.params
    const product = await prisma.product.findMany({
        where: {
            authorId: Number(authorId)
        }
    })

    return res.status(200).json(product)
}

module.exports = {
    newProduct,
    getAllProducts,
    getProductAuthId,
    removeProduct,
    getProductId
}