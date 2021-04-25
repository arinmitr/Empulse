const mongoose = require('mongoose')
const app = require('./app')

const port = 3000
const DB =
  'mongodb+srv://dbUser_Arin:rP8FML2WaH7H9lBb@cluster-empulse0.t7svv.mongodb.net/EmpulseDB?retryWrites=true&w=majority'

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected')
  })

const server = app.listen(port, () => {
  console.log(`App running on Port ${port}...`)
})
