const express = require('express')
const userRoutes = require('./src/routes/userRouter')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors());
app.use('/files', express.static(__dirname + "/uploads"))
app.use(userRoutes)
const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    console.log(`Server is runing or port: ${PORT}`);
})
 
