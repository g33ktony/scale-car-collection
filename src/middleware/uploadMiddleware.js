import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Crear carpeta si no existe
const uploadsDir = 'uploads'
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

export const upload = multer({ storage })
