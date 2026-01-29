const express = require('express');
const axios = require('axios');   // GetulioHF
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// GetulioHF
const fetchBooksFromAPI = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books)}, 100);
    });
};

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const booksData = await fetchBooksFromAPI();
        return res.status(200).json(booksData);
    } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ 
            message: 'Failed to fetch books',
            error: error.message 
        });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const fetchBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const book = books[isbn];
                    if (book) {
                        resolve(book);
                    } else {
                        reject(new Error(`Book with the ISBN ${isbn} not located`));
                    }
                }, 100); 
            });
        };
        const book = await fetchBookByISBN(isbn);
        return res.status(200).json({
            message: 'Book located',
            book: book
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message || 'Book not found'
        });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author.toLowerCase();
        const fetchBooksByAuthor = (authorName) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const authorBooks = {};
                    let foundBooks = false;
                    for (let isbn in books) {
                        if (books[isbn].author.toLowerCase() === authorName) {
                            authorBooks[isbn] = books[isbn];
                            foundBooks = true;
                        }
                    }
                    if (foundBooks) {
                        resolve(authorBooks);
                    } else {
                        reject(new Error(`No books found for "${authorName}"`));
                    }
                }, 150);
            });
        };
        const authorBooks = await fetchBooksByAuthor(author);
        return res.status(200).json({
            message: `Books by ${author} located`,
            books: authorBooks,
            count: Object.keys(authorBooks).length
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message || 'No books found'
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();
        const booksData = await fetchBooksFromAPI();
        const titleBooks = {};
        for (let isbn in booksData) {
            if (booksData[isbn].title.toLowerCase().includes(title)) {
                titleBooks[isbn] = booksData[isbn];
            }
        }
        if (Object.keys(titleBooks).length === 0) {
            return res.status(404).json({ message: 'No books found for this title' });
        }
        return res.status(200).json(titleBooks);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch title books' });
    }
});
 
//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const booksData = await fetchBooksFromAPI();
        const book = booksData[isbn];
        if (!book || !book.reviews) {
            return res.status(404).json({ message: 'Book or reviews not found' });
        }
        return res.status(200).json(book.reviews);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

module.exports.general = public_users;
