const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Returns true if username is non-empty after trimming whitespace
    return username && username.toString().trim().length > 0;
}

const authenticatedUser = (username, password) => {
    // Returns true if username/password match existing records
    return users.some(user => user.username === username && user.password === password);
}

// REGISTER endpoint - NEW
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered" });
});

// LOGIN endpoint - only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }
    
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT token
        const token = jwt.sign(
            { username: username },
            "jwtsecret",
            { expiresIn: '1h' }
        );

        // Store in SESSION for auth middleware
        req.session.authorization = {
            accessToken: token,
            username: username
        };

        return res.status(200).json({ 
            message: "Login successful", 
            token: token 
        });
    }
    
    return res.status(401).json({ message: "Invalid credentials" });
});
 
// Add a book review - PLACEHOLDER GetulioHF
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
        console.log("=== REVIEW REQUEST ===");
        console.log("ISBN:", req.params.isbn);
        console.log("Review:", req.query.review);
        console.log("Session:", req.session);
        
        const isbn = req.params.isbn;
        const review = req.query.review;

        if (!review) {
            return res.status(400).json({ message: "Review required" });
        }

        if (!req.session.authorization) {
            return res.status(403).json({ message: "No session - login first" });
        }

        const username = req.session.authorization.username || 
                        req.session.authorization.accessToken?.username;
        
        if (!username) {
            return res.status(404).json({ message: "Username not found in session" });
        }
        
        console.log("Username:", username);
        console.log("Books available:", Object.keys(books));

        if (!books || !books[isbn]) {
            return res.status(404).json({ message: `Book ${isbn} not found` });
        }
        
        const book = books[isbn];
        if (!book.reviews) book.reviews = {};

        const wasUpdated = book.reviews[username];
        book.reviews[username] = review;
        
        console.log("Book reviews after:", book.reviews);
        
        res.status(201).json({
            message: `Review ${wasUpdated ? 'updated' : 'added'} for ${isbn}`,
            username,
            review
        });
        
    } catch (error) {
        console.error("REVIEW ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

// Delete review - GetulioHF
regd_users.delete("/auth/review/:isbn", (req, res) => {
    try {
        const isbn = req.params.isbn;
        const username = req.session.authorization.username; // From session
        
        if (!req.session.authorization || !username) {
            return res.status(403).json({ message: "User not authenticated" });
        }
        
        if (!books || !books[isbn]) {
            return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
        }
        
        const book = books[isbn];
        
        if (!book.reviews || !book.reviews[username]) {
            return res.status(404).json({ 
                message: `No review found for user ${username} on book ${isbn}` 
            });
        }
        
        delete book.reviews[username];
        
        if (Object.keys(book.reviews).length === 0) {
            delete book.reviews;
        }
        
        return res.status(200).json({ 
            message: `Review for book ${isbn} deleted successfully`,
            username: username
        });
        
    } catch (error) {
        console.error("Delete review error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
