const express = require("express")
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

const requestLogger = (request,response,next) => {
      console.log('Metho', request.body)
      console.log('Path', request.path)
      console.log('Body', request.body)
      next();
}
app.use(requestLogger)

let contact = [ 
]

app.get('/', (request, response) => {
    response.end("<h1>Node js</h1>")
})

app.get('/api/contact', (request,response) => {
     response.json(contact)
})

//For USER - ID
app.get('/api/contact/:id', (request,response) => {
    const userId = Number(request.params.id)
    const userfind = contact.find(contacts => contacts.id == userId)
    response.json(userfind)
})

// For Delete Id 
app.delete('/api/contact/:id', (request,response) => {
    const userId = Number(request.params.id)
    const userDel = contact.filter(cont => cont.id !== userId)
    response.json(userDel)
    response.status(400).end()
})

// For create , post  ++ obligation JSON-PARSER
  //Create Generated ID
  const generateId = () => {
      const maxId = contact.length > 0 ?
      Math.random(...contact.map(co => co)) : 0
      return maxId + 1
  }

app.post('/api/contact', (request,response) => {
     const body = request.body
     console.log(body,'Infos imprie')

     if(!body.name) {
         return response.status(404).json({
            error : "Votre champ nom est vide"
         })
     }

     const contacts = {
        name: body.name,
        phone: body.phone,
        important: body.important || false,
        id: generateId()
     }

     contact = contact.concat(contacts)
        response.json(contacts)
})

const PORT= process.env.PORT || 2000
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})