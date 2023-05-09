const Router = require("express");
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const checkToken = require('../middleware/checkToken');
const upload = require("../multer/multerConfig");

const router = new Router()

// Lista todos os users
router.get('/user', userController.getAllUsers) 

// Lista um user pelo seu id
router.get('/user/:id', userController.getUserId)

// Registra um novo user
router.post('/user/register', userController.registerUser) 

// Faz login do usuário 
router.post('/user/login', userController.login) 

// Lista todos os produtos
router.get('/product', productController.getAllProducts) 

// Lista produtos de determindo user pelo id passado
router.get('/product/user/:authorId', productController.getProductAuthId) 

// Lista id pelo id
router.get('/product/:id', productController.getProductId)

// Cria um novo produto
router.post('/product/create', checkToken, upload.single('file'), productController.newProduct) 

// Rota para deletar produtos do usuário
router.delete('/product/remove/:id', checkToken, productController.removeProduct)

module.exports = router
