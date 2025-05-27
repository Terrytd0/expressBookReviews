const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    return userswithsamename.length > 0;
  };

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Please provide a username and password" });
});

// Get the book list available in the shop
public_users.get('/promise/books', (req, res) => {
    new Promise((resolve, reject) => {
      resolve(books);
    }).then(data => {
      res.status(200).json(data);
    }).catch(err => {
      res.status(500).json({ message: 'error retrieving the books' });
    });
  });
  

// Get book details based on ISBN
public_users.get('/promise/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject();
    }).then(book => {
      res.status(200).json(book);
    }).catch(() => {
      res.status(404).json({ message: 'Book not found' });
    });
  });
  

  
// Get book details based on author
public_users.get('/promise/author/:author', (req, res) => {
    const authorQuery = req.params.author.toLowerCase();
    new Promise((resolve, reject) => {
      const matches = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(authorQuery)
      );
      if (matches.length) resolve(matches);
      else reject();
    }).then(matches => {
      res.status(200).json(matches);
    }).catch(() => {
      res.status(404).json({ message: 'No books found for this author' });
    });
  });
  
  

// Get all books based on title
public_users.get('/promise/title/:title', (req, res) => {
    const titleQuery = req.params.title.toLowerCase();
    new Promise((resolve, reject) => {
      const matches = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(titleQuery)
      );
      if (matches.length) resolve(matches);
      else reject();
    }).then(matches => {
      res.status(200).json(matches);
    }).catch(() => {
      res.status(404).json({ message: 'No books found for this title' });
    });
  });
  

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  });

module.exports.general = public_users;
