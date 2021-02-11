const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

morgan.token('body', function(request, response) {
  if (request.body.name) {
    return(
      `{"name": "${request.body.name}", "number": "${request.body.number}"}`
    )
  }
})

let numbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${numbers.length} people</p>
    <p>${date}</p>`
  )
})

app.get('/api/numbers', (request, response) => {
  response.json(numbers)
})

app.get('/api/numbers/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = numbres.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  //console.log(person)
})

app.delete('/api/numbers/:id', (request, response) => {
  const id = Number(request.params.id)
  numbers = numbers.filter(number => number.id !== id)

  response.status(204).end()
})

app.post('/api/numbers', (request, response) => {
  const body = request.body
  const names = numbers.map(number => number.name)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (names.includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const number = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  numbers = numbers.concat(number)
  //console.log(number)
  response.json(number)
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000000)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})