import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import carRoutes from './routes/carRoutes.js'
import ENV from '../env.js'

dotenv.config()
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
// app.use('/uploads', express.static('uploads')) // This is no longer needed
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})

// Rutas
app.use('/api/cars', carRoutes)
console.log('env', ENV)

mongoose.connect(ENV.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB conectado')
    app.listen(ENV.PORT, () => {
        console.log(`🚀 Servidor en ${ENV.API_URL}`)
    })
}).catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err)
})
