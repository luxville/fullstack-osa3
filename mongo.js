const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const dbName = 'phonebook'

const url = `mongodb+srv://luxville:${password}@cluster0.jbnxl.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connect.close()
})