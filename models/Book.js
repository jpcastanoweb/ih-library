// IMPORTACIONES
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// SCHEMA

const bookSchema = new Schema(
  {
    title: String,
    description: String,
    author: String,
    rating: Number,
  },
  {
    timestamps: true, // genera fecha de cuando se crea el documento
  }
)
// MODELO

const Book = mongoose.model("Book", bookSchema)

// EXPORTACION

module.exports = Book
