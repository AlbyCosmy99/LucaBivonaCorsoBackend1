import express from 'express';
import { BookModel } from '../database/schemas/bookSchema.js';
import { body, validationResult } from 'express-validator';
import tokenAuth from '../middlewares/tokenAuth.js'

const bookRouter = express.Router();

bookRouter.post(
    '/',
    tokenAuth,
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('author').optional().isString().withMessage('Author must be a string'),
        body('genre').optional().isString().withMessage('Genre must be a string'),
        body('published_year').optional().isISO8601().withMessage('Published year must be a valid date'),
        body('ISBN').optional().isString().withMessage('ISBN must be a string'),
        body('summary').optional().isString().withMessage('Summary must be a string')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newBook = new BookModel(req.body);
            await newBook.save();
            res.status(201).json(newBook);
        } catch (err) {
            res.status(500).json({
                error: "Cannot save the new book to the database",
                message: err.message
            });
        }
    }
);

bookRouter.get('/', tokenAuth, async (req, res) => {
    try {
        const books = await BookModel.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({
            error: "Cannot retrieve books from the database",
            message: err.message
        });
    }
});

bookRouter.get('/:id', tokenAuth, async (req, res) => {
    try {
        const book = await BookModel.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({
            error: "Cannot retrieve the book from the database",
            message: err.message
        });
    }
});

bookRouter.put(
    '/:id',
    tokenAuth,
    [
        body('title').optional().isString().withMessage('Title must be a string'),
        body('author').optional().isString().withMessage('Author must be a string'),
        body('genre').optional().isString().withMessage('Genre must be a string'),
        body('published_year').optional().isISO8601().withMessage('Published year must be a valid date'),
        body('ISBN').optional().isString().withMessage('ISBN must be a string'),
        body('summary').optional().isString().withMessage('Summary must be a string')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedBook = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!updatedBook) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.status(200).json(updatedBook);
        } catch (err) {
            res.status(500).json({
                error: "Cannot update the book in the database",
                message: err.message
            });
        }
    }
);

bookRouter.delete('/:id', tokenAuth, async (req, res) => {
    try {
        const deletedBook = await BookModel.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({
            error: "Cannot delete the book from the database",
            message: err.message
        });
    }
});

export default bookRouter;
