import Car from '../models/Car.js'
import { recognizeCar } from '../services/recognitionService.js'
import stringSimilarity from 'string-similarity'
import { extractTextFromImage } from '../ocr/ocrService.js'
import cloudinary from '../config/cloudinary.js'

export const extractCarInfo = async (req, res) => {
    console.log("🚀 ~ extractCarInfo ~ extractCarInfo:")
    try {
        const filePath = req.file.path
        const extractedText = await extractTextFromImage(filePath)

        // Optionally: you could parse the text to guess fields like name/color/etc.

        res.json({
            rawText: extractedText,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'OCR failed' })
    }
}


export const checkDuplicate = async (req, res) => {
    console.log("🚀 ~ checkDuplicate ~ checkDuplicate:")
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
    console.log("🚀 ~ getAllCars ~ getAllCars:")
    try {
        const cars = await Car.find().sort({ acquiredAt: -1 })
        res.json(cars)

    } catch (error) {
        console.log("🚀 ~ getAllCars ~ error:", error)

    }
}

// export const addCar = async (req, res) => {
//     try {
//         console.log("🚀 ~ addCar ~ addCar:", req)
//         const file = req.file
//         // const concepts = await recognizeCar(file.path)

//         const carData = {
//             brand: req.body.brand || 'Desconocida',
//             model: req.body.model || 'Desconocido',
//             color: req.body.color || 'Desconocido',
//             toyBrand: req.body.toyBrand || 'Hot Wheels',
//             rarity: req.body.rarity || 'normal',
//             type: req.body.type || 'basic',
//             notes: req.body.notes || '',
//             casting: req.body.casting || '',
//             year: req.body.year || '',
//             // imageUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
//             imageUrl: `/uploads/${file.filename}`,
//         }

//         const car = new Car(carData)
//         await car.save()
//         res.status(201).json(car)
//     } catch (err) {
//         console.error(err)
//         res.status(500).json({ message: 'Error al agregar auto' })
//     }
// }

export const addCar = async (req, res) => {
    console.log("🚀 ~ addCar ~ addCar:")
    try {
        const { model, year, brand, series, color, acquisitionDate, cost, imageUrl, rarity, notes } = req.body

        let finalImageUrl = '';
        let imageUrlPublicId = '';

        if (req.file) {
            // Case 1: A new file was uploaded to Cloudinary
            finalImageUrl = req.file.path;
            imageUrlPublicId = req.file.filename;
        } else if (imageUrl) {
            // Case 2: An existing URL was provided in the body
            finalImageUrl = imageUrl;
        }

        const newCar = new Car({
            model,
            year,
            brand,
            series,
            color: color || 'N/A',
            rarity,
            notes,
            acquisitionDate,
            cost,
            imageUrl: finalImageUrl,
            imageUrl_public_id: imageUrlPublicId
        })
        await newCar.save()
        res.status(201).json(newCar)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al añadir el coche' })
    }
}

export const addCarBatch = async (req, res) => {
    console.log("🚀 ~ addCarBatch ~ addCarBatch:")
    try {
        const carsData = JSON.parse(req.body.cars) // Assuming cars data is in a JSON string
        const files = req.files
        const newCars = []

        for (let i = 0; i < carsData.length; i++) {
            const carData = carsData[i]
            const file = files[i]

            const newCar = new Car({
                ...carData,
                imageUrl: file.path, // Cloudinary URL
                imageUrl_public_id: file.filename // Cloudinary public_id
            })
            newCars.push(newCar)
        }

        const savedCars = await Car.insertMany(newCars)
        res.status(201).json(savedCars)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al añadir los coches' })
    }
}


export const updateCar = async (req, res) => {
    console.log("🚀 ~ updateCar ~ updateCar:")
    try {
        const updatedData = req.body

        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).json({ message: 'Coche no encontrado' })
        }

        // If a new photo is uploaded, delete the old one from Cloudinary
        if (req.file) {
            if (car.imageUrl_public_id) {
                await cloudinary.uploader.destroy(car.imageUrl_public_id);
            }
            updatedData.imageUrl = req.file.path;
            updatedData.imageUrl_public_id = req.file.filename;
        }


        const updatedCar = await Car.findByIdAndUpdate(req.params.id, updatedData, { new: true })
        res.json(updatedCar)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al actualizar el coche' })
    }
}

export const deleteCar = async (req, res) => {
    console.log("🚀 ~ deleteCar ~ deleteCar:")
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).json({ message: 'Coche no encontrado' })
        }

        // Delete the photo from Cloudinary before deleting the car from the DB
        if (car.imageUrl_public_id) {
            await cloudinary.uploader.destroy(car.imageUrl_public_id);
        }

        await Car.findByIdAndDelete(req.params.id)
        res.json({ message: 'Coche eliminado' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al eliminar el coche' })
    }
}
