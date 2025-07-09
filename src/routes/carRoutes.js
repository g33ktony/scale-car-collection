import express from 'express'
import { getAllCars, addCar, updateCar, deleteCar, checkDuplicate, extractCarInfo } from '../controllers/carController.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', getAllCars)
router.post('/ocr', upload.single('photo'), extractCarInfo)
// The middleware needs to handle both 'photo' and 'imageUrl' fields.
// 'any()' allows multer to accept any file. We handle the logic in the controller.
router.post('/', upload.any(), addCar)
router.post('/check-duplicate', upload.single('photo'), checkDuplicate)
router.put('/:id', upload.single('photo'), updateCar)
router.delete('/:id', deleteCar)

export default router
