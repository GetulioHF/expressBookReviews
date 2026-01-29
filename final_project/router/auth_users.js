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
    
    // Check if username/password provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Validate username
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }
    
    // Check if username exists
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }
    
    // Add new user
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
        return res.status(200).json({ 
            message: "Login successful", 
            token: token 
        });
    }
    
    return res.status(401).json({ message: "Invalid credentials" });
});

// Add a book review - PLACEHOLDER
regd_users.put("/auth/review/:isbn", (req, res) => {
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
