import mongoose from "mongoose";
const { Schema } = mongoose;

const bookSchema = Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: null
    },
    genre: {
        type: String,
        default: null
    },
    published_year: {
        type: Date,
        default: null
    },
    ISBN: {
        type: String,
        default: null
    },
    summary: {
        type: String,
        default: null
    },
})

export const BookModel = mongoose.model('books', bookSchema)