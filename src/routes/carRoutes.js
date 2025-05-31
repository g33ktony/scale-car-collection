import express from 'express'
import { getAllCars, addCar, addCarsBulk } from '../controllers/carController.js'
import { upload } from '../middleware/uploadMiddleware.js'
import { checkDuplicate } from '../controllers/carController.js'
import { updateCar } from '../controllers/carController.js'


const router = express.Router()

router.get('/', getAllCars)
router.post('/', upload.single('image'), addCar)
router.post('/bulk', upload.array('images', 10), addCarsBulk)
router.post('/check-duplicate', upload.single('image'), checkDuplicate)
router.put('/:id', updateCar)

export default router
