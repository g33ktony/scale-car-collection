import Tesseract from 'tesseract.js'
import path from 'path'

export const extractTextFromImage = async (imagePath) => {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
        logger: m => console.log(m), // optional: progress
    })
    return text
}
