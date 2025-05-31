import Car from '../models/Car.js'
import { recognizeCar } from '../services/recognitionService.js'
import stringSimilarity from 'string-similarity'

export const checkDuplicate = async (req, res) => {
    try {
        const file = req.file
        const concepts = await recognizeCar(file.path)
        const modelDetected = concepts[0]?.name || ''
        const colorDetected = concepts.find(c => c.name.includes('color'))?.name || ''

        const cars = await Car.find()

        const similarCar = cars.find(car => {
            const modelSimilarity = stringSimilarity.compareTwoStrings(car.model, modelDetected)
            const colorMatch = car.color?.toLowerCase() === colorDetected.toLowerCase()
            return modelSimilarity > 0.7 && colorMatch
        })

        if (similarCar) {
            return res.status(200).json({
                duplicate: true,
                car: similarCar
            })
        }

        res.status(200).json({ duplicate: false })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al verificar duplicado' })
    }
}


export const getAllCars = async (req, res) => {
    const cars = await Car.find().sort({ acquiredAt: -1 })
    res.json(cars)
}

export const addCar = async (req, res) => {
    try {
        const file = req.file
        const concepts = await recognizeCar(file.path)

        const carData = {
            brand: 'Desconocida',
            model: concepts[0]?.name || 'Desconocido',
            color: concepts.find(c => c.name.includes('color'))?.name || 'Desconocido',
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        }

        const car = new Car(carData)
        await car.save()
        res.status(201).json(car)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al agregar auto' })
    }
}

export const addCarsBulk = async (req, res) => {
    try {
        const files = req.files

        const results = await Promise.all(files.map(async (file) => {
            const concepts = await recognizeCar(file.path)
            const carData = {
                brand: 'Desconocida',
                model: concepts[0]?.name || 'Desconocido',
                color: concepts.find(c => c.name.includes('color'))?.name || 'Desconocido',
                imageUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            }
            const car = new Car(carData)
            await car.save()
            return car
        }))

        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al subir múltiples autos' })
    }
}

export const updateCar = async (req, res) => {
    try {
        const { id } = req.params
        const updatedCar = await Car.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedCar)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al actualizar auto' })
    }
}
