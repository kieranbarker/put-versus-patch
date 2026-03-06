const express = require("express");
const { createBook, findBook, updateBook } = require("./db");

const app = express();
app.use(express.json());

app.put("/books/:id", (req, res) => {
	const errors = [];

	// Check for errors.
	if (!req.body?.title) errors.push("Missing title");
	if (!req.body?.author) errors.push("Missing author");
	if (!req.body?.genre) errors.push("Missing genre");

	// If there are errors, send them.
	if (errors.length) {
		res.status(400).json({ errors });
		return;
	}

	const updates = {
		id: req.params.id,
		title: req.body.title,
		author: req.body.author,
		genre: req.body.genre,
	};

	// Attempt to find the book.
	let book = findBook.get({ id: updates.id });

	// If the book exists, replace it.
	if (book) {
		updateBook.run(updates);
		book = findBook.get({ id: updates.id });
		res.status(200).json(book);
		return;
	}

	// Create the book.
	const { lastInsertRowid } = createBook.run(updates);
	book = findBook.get({ id: lastInsertRowid });
	res.status(201).set("Location", `/books/${book.id}`).json(book);
});

app.patch("/books/:id", (req, res) => {
	// Attempt to find the book.
	let book = findBook.get({ id: req.params.id });

	// If the book doesn't exist, send an error.
	if (!book) {
		res.status(404).json({ errors: ["Book not found"] });
		return;
	}

	const updates = {
		id: req.params.id,
		title: req.body?.title ?? book.title,
		author: req.body?.author ?? book.author,
		genre: req.body?.genre ?? book.genre,
	};

	// Update the book.
	updateBook.run(updates);
	book = findBook.get({ id: req.params.id });
	res.status(200).json(book);
});

app.listen(3000);
