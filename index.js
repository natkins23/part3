require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors()) //middleware to use and allow for requests from all origins
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ]

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((e) => response.status(404).end())
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const name = request.body.name
  const number = request.body.number
  const nameExists = Person.find({ name: request.body.name })

  if (name === undefined) {
    return response.status(400).json({
      error: 'name missing',
    })
  } else if (number === undefined) {
    return response.status(400).json({
      error: 'number missing',
    })
  }
  // } else if (nameExists) {
  //   return response.status(400).json({
  //     error: 'name must be unique',
  //   })
  // }
  const person = new Person({ name, number })

  person
    .save()
    .then((savedPerson) => {
      console.log(`${name} was added to phonebook`)
      response.json(savedPerson)
    })
    .catch((e) => {
      console.log(`couldnt save ${name}`)
      console.error(e)
    })
}) //end post

// app.get('/info', (request, response) => {
//   console.log(Person)
//   //   let content = `Phonebook has info for ${person.length} people
//   //   <br/><br/>
//   //  ${new Date()}
//   //  `
//   //   response.send(content)
// })

// app.get('/', (request, response) => {
//   response.json(persons)
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
