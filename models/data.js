const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('Connecting to', url)
mongoose.connect(url).then(result => {
     console.log('Connected in Database')
}).catch((error) => {
     console.log('error , you not connectig', error.message)
})

personSchema = new mongoose.Schema({
    name:String,
    phone:String,
    important:Boolean
})

//For deleting expression
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)