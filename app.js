/* 
    1. INSTALACIONES
*/

const express = require("express")
const app = express()
const hbs = require("hbs")
const mongoose = require("mongoose")

const Book = require("./models/Book")

/* 
    2. MIDDLEWARES
*/
require("dotenv").config()

mongoose
  .connect(process.env.MONGODB, {
    useCreateIndex: true, // genera un objectid en cada documento
    useNewUrlParser: true, // conversion de datos hacia el backend
    useUnifiedTopology: true, // capa de topologia (???)
  })
  .then((db) =>
    console.log(
      `Conectados a MongoDB: ${db.connections[0].name} en ${db.connections[0].host}`
    )
  )
  .catch((e) => console.log(e))

app.use(express.static("public"))
app.set("view engine", "hbs")

/* 
    3. ROUTES
*/

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/books", (req, res) => {
  Book.find({})
    .then((booksFound) => {
      //   console.log("Books found: ", booksFound)
      res.render("books", {
        books: booksFound,
      })
    })
    .catch((e) => {
      console.log(e)
    })
})

app.get("/books/:bookId", (req, res) => {
  console.log("Este es el req params: ", req.params)
  const { bookId } = req.params

  Book.findById(bookId)
    .then((bookFound) => {
      console.log(bookFound)
      res.render("singleBook", {
        book: bookFound,
      })
    })
    .catch((e) => console.log(e))
})

/* 
    4. SERVIDOR
*/
app.listen(process.env.PORT, () => {
  console.log("Servidor conectado")
})
