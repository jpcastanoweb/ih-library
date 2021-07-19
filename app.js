/* 
    1. INSTALACIONES
*/

const express = require("express")
const app = express()
const hbs = require("hbs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

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

app.use(bodyParser.urlencoded({ extended: true }))
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
      res.render("books", {
        books: booksFound,
      })
    })
    .catch((e) => {
      console.log(e)
    })
})

app.get("/books/create", (req, res) => {
  res.render("book-create")
})

app.post("/books/create", (req, res) => {
  const { title, author, description, rating } = req.body

  console.log(title, author, description, rating)
  Book.create({ title, author, description, rating })
    .then((libroCreado) => {
      console.log(libroCreado)
      res.redirect("/books")
    })
    .catch((e) => console.log(e))
})

app.get("/books/:bookId", (req, res) => {
  const { bookId } = req.params

  Book.findById(bookId)
    .then((bookFound) => {
      res.render("singleBook", {
        book: bookFound,
      })
    })
    .catch((e) => console.log(e))
})

app.get("/search", (req, res) => {
  const queries = req.queries

  res.render("search", {
    busqueda: req.query,
  })
})

app.post("/search", (req, res) => {
  const valorFormulario = req.body
  res.redirect(
    `/search?palabra=${valorFormulario.palabra}&nombre=${valorFormulario.nombre}&apellido=${valorFormulario.apellido}`
  )
})

app.get("/books/:bookId/edit", (req, res) => {
  const { bookId } = req.params

  Book.findById(bookId)
    .then((libroEncontrado) => {
      console.log(libroEncontrado)

      res.render("book-edit", {
        libro: libroEncontrado,
      })
    })
    .catch((e) => console.log(e))
})

app.post("/books/:bookId/edit", (req, res) => {
  const { bookId } = req.params
  const { title, description, author, rating } = req.body

  console.log("here")
  Book.findByIdAndUpdate(
    bookId,
    { title, description, author, rating },
    { new: true }
  )
    .then((libroActualizado) => {
      console.log(libroActualizado)
      res.redirect(`/books/${libroActualizado._id}`)
    })
    .catch((e) => console.log(e))
})

app.post("/books/:bookId/delete", (req, res) => {
  const { bookId } = req.params

  Book.findByIdAndDelete(bookId)
    .then(() => {
      res.redirect("/books/")
    })
    .catch((e) => console.log(e))
})

/* 
    4. SERVIDOR
*/
app.listen(process.env.PORT, () => {
  console.log("Servidor conectado")
})
