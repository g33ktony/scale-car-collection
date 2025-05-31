import mongoose from 'mongoose'

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },          // Hot Wheels, Matchbox, etc.
    model: { type: String, required: true },          // Mustang, Civic, etc.
    year: { type: String },
    color: { type: String },
    imageUrl: { type: String },                       // URL pública del archivo subido
    rarity: { type: String },                         // TH, STH, etc.
    notes: { type: String },
    acquiredAt: { type: Date, default: Date.now }
})

const Car = mongoose.model('Car', carSchema)
export default Car
