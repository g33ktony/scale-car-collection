import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import carRoutes from './routes/carRoutes.js'

dotenv.config()
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})

// Rutas
app.use('/api/cars', carRoutes)

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB conectado')
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Servidor en http://localhost:${process.env.PORT}`)
    })
}).catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err)
})
