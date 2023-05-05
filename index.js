const express = require('express')
const userRoutes = require('./src/routes/userRouter')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(userRoutes)
app.use('/files', express.static('uploads'))
app.use(cors)
const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    console.log(`Server is runing or port: ${PORT}`);
})
 
