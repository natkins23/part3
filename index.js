const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('build'))
morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0
  const entryExists = persons.find(
    (person) => person.name === request.body.name
  )

  const person = request.body
  if (!person.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  } else if (!person.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  } else if (entryExists) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  person.id = maxId + 1

  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  let content = `Phonebook has info for ${persons.length} people
  <br/><br/>
 ${new Date()}
 `
  response.send(content)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/', (request, response) => {
  response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
