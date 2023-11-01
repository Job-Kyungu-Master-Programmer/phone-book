// Data base 
const mongoose = require('mongoose')

if(process.argv.length <3) {
    console.log('Entrez votre mot de passe !')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://joblodo97:Mongos@cluster0.7i3dtxd.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    important: Boolean
})

const Person = new mongoose.model('Person', contactSchema)
const contactsInfos = new Person({
    name: "Mathiew",
    phone: 54541144457,
    important: true
})

contactsInfos.save().then(result => {
    console.log('Users bien enregistrer au serveur')
    mongoose.connection.close()
})

// Recuperation database 
Person.find({}).then(result => {
   result.forEach(people => {
       console.log(people)
       mongoose.connection.close()
   })
})