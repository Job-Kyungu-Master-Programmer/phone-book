require('dotenv').config()
const express = require("express")
const app = express()
const Person = require('./models/data')
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

// Middleware error 
const errorHandler = (error, request, response, next) => {
     console.log(error.message)
     if(error.name == 'CastError') {
        return response.status(400).send({error : 'malformatted ID' })
     }
     next(error)
}
app.use(errorHandler)

let contact = [ 
]

app.get('/', (request, response) => {
    response.end("<h1>Node js</h1>")
})

// app.get('/api/contact', (request,response) => {
//      response.json(contact)
// })


//For DataBase for all
app.get('/api/contact', (request,response) => {
       Person.find({}).then(people => {
          response.json(people)
       })
})
//database
app.get('/api/contact/:id', (request,response,next) => {
      Person.findById(request.params.id)
      .then(people => {
        if(people) {
            response.json(people)
        }else {
            response.status(404).sendFile(__dirname + '/templates/error.html')
        }
      }).catch(error => next(error))
})
//for database
app.delete('/api/contact/:id', (request,response) => {
     Person.findByIdAndDelete(request.params.id).then(people => {
          response.json(people)
     })
})

//Post for database 
app.post('/api/contact', (request,response) => {
     const body = request.body

     if(body.name === undefined) {
        return response.status(400).json({
            error: "Le champ est vide !"
        })
     }

     const identity = new Person({
         name: body.name,
         phone: body.phone,
         important: body.important || false
     })

     identity.save().then(savedIdentity => {
        response.json(savedIdentity)
     })
})

//For update Importance database

app.put('/api/contact/:id', (request,response) => {
    const body = request.body

    const contactElement = {
        name:body.name,
        important:body.important,
    }

    Person.findByIdAndUpdate(request.params.id, contactElement, {new: true})
    .then(result => {
        response.json(result)
    })
})

// //For USER - ID
// app.get('/api/contact/:id', (request,response) => {
//     const userId = Number(request.params.id)
//     const userfind = contact.find(contacts => contacts.id == userId)
//     response.json(userfind)
// })

// // For Delete Id 
// app.delete('/api/contact/:id', (request,response) => {
//     const userId = Number(request.params.id)
//     const userDel = contact.filter(cont => cont.id !== userId)
//     response.json(userDel)
//     response.status(400).end()
// })

// For create , post  ++ obligation JSON-PARSER
  //Create Generated ID
  const generateId = () => {
      const maxId = contact.length > 0 ?
      Math.random(...contact.map(co => co)) : 0
      return maxId + 1
  }

// app.post('/api/contact', (request,response) => {
//      const body = request.body
//      console.log(body,'Infos imprie')

//      if(!body.name) {
//          return response.status(404).json({
//             error : "Votre champ nom est vide"
//          })
//      }

//      const contacts = {
//         name: body.name,
//         phone: body.phone,
//         important: body.important || false,
//         id: generateId()
//      }

//      contact = contact.concat(contacts)
//         response.json(contacts)
// })

const unknow = (request,response) => {
    return response.status(404).sendFile(__dirname + '/templates/error.html')
}
app.use(unknow)


const PORT= process.env.PORT || 2000
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})