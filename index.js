const { request, response } = require('express')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', function(request, response) {
  if (request.body.name) {
    return(
      `{"name": "${request.body.name}", "number": "${request.body.number}"}`
    )
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  //const id = Number(request.params.id)
  //const person = persons.find(person => person.id === id)

  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
  /*if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }*/
  //console.log(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  //const names = persons.map(person => person.name)

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  /*} else if (names.includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })*/
  } else if (body.number === undefined) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})