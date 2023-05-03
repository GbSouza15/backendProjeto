const Router = require("express");
const userController = require('../controllers/userController')
const checkToken = require('../middleware/checkToken')

const router = new Router()

router.get('/user', userController.getAllUsers) // Lista todos os users
router.post('/user/register', userController.registerUser) // Registra um novo user
router.post('/user/login', userController.login) // Faz login no usuário
router.get('/product', userController.getAllProducts) // Lista todos os produtos
router.get('/product/:authorId', userController.getProductId) // Lista produtos pelo id passado
router.post('/product/create', checkToken, userController.newProduct) // Cria um novo produto
router.delete('/product/remove/:id', userController.deleteProduct) // Deleta um produto

module.exports = router


