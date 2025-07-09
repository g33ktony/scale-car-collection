import os from 'os'

function getLocalIp() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return '127.0.0.1'
}

const ENV = {
  API_URL: `http://${getLocalIp()}:4000/api`,
  PORT: 4000,
  MONGO_URI: 'mongodb+srv://tecnoapps15:G33ktony21@carcollection.3ibhmm9.mongodb.net/?retryWrites=true&w=majority&appName=CarCollection',
  CLOUDINARY_CLOUD_NAME: 'deyzkucre',
  CLOUDINARY_API_KEY: '744814371298353',
  CLOUDINARY_API_SECRET: 'CDTr5JEAiWIHK_hor5fn7wC7ZQE'

}

export default ENV