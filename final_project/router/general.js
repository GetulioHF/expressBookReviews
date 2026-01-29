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
        const booksData = await fetchBooksFromAPI();
        const book = booksData[isbn];
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch book' });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author.toLowerCase();
        const booksData = await fetchBooksFromAPI();
        const authorBooks = {};
        for (let isbn in booksData) {
            if (booksData[isbn].author.toLowerCase() === author) {
                authorBooks[isbn] = booksData[isbn];
            }
        }
        return res.status(200).json(authorBooks);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch author books' });
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
