import mongoose from 'mongoose'

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },          // Hot Wheels, Matchbox, etc.
    model: { type: String, required: true },          // Mustang, Civic, etc.
    series: { type: String },
    toyBrand: { type: String, default: 'Hot Wheels' }, // Marca del juguete (Hot Wheels, Matchbox, etc.)
    year: { type: String },
    color: { type: String },
    imageUrl: { type: String },                       // URL pública del archivo subido
    imageUrl_public_id: { type: String },             // ID público de Cloudinary
    rarity: { type: String },
    type: { type: String, default: 'basic' },                       // Basic or premium
    notes: { type: String },
    casting: { type: String }, // Nombre del casting
    acquiredAt: { type: Date, default: Date.now },
})

const Car = mongoose.model('Car', carSchema)
export default Car
