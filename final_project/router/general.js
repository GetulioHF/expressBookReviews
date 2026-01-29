const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here (GetulioHF)
  const booksJson = JSON.stringify(books, null, 2);
  return res.status(300).send(booksJson);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const bookJson = JSON.stringify(book, null, 2);
  return res.status(300).send(bookJson);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorBooks = {};
  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      authorBooks[isbn] = books[isbn];
    }
  }
  const authorJson = JSON.stringify(authorBooks, null, 2);
  return res.status(300).send(authorJson);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const titleBooks = {};
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase().includes(title)) {
      titleBooks[isbn] = books[isbn];
    }
  }
  
  if (Object.keys(titleBooks).length === 0) {
    return res.status(404).json({ message: 'No books found for this title' });
  }
  
  const titleJson = JSON.stringify(titleBooks, null, 2);
  return res.status(200).send(titleJson);
});
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book || !book.reviews) {
    return res.status(404).json({ message: 'Book or reviews not found' });
  }
  
  const reviewJson = JSON.stringify(book.reviews, null, 2);
  return res.status(200).send(reviewJson);
});

module.exports.general = public_users;
