import axios from 'axios'
import fs from 'fs'
import ENV from '../../env.js'

const CLARIFAI_API_KEY = ENV.CLARIFAI_API_KEY
const CLARIFAI_URL = 'https://api.clarifai.com/v2/models/general-image-recognition/outputs'

export const recognizeCar = async (imagePath) => {
    const imageData = fs.readFileSync(imagePath, { encoding: 'base64' })

    try {
        const response = await axios.post(CLARIFAI_URL, {
            inputs: [
                {
                    data: {
                        image: { base64: imageData }
                    }
                }
            ]
        }, {
            headers: {
                Authorization: `Key ${CLARIFAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        const concepts = response.data.outputs[0].data.concepts
        const top5 = concepts.slice(0, 5).map(c => ({ name: c.name, value: c.value }))
        return top5
    } catch (error) {
        console.error('Error en reconocimiento:', error.response?.data || error.message)
        return []
    }
}
