const db = require("better-sqlite3")("books.db");

db.exec(
	`CREATE TABLE IF NOT EXISTS books (
		id INTEGER PRIMARY KEY,
		title TEXT NOT NULL,
		author TEXT NOT NULL,
		genre TEXT NOT NULL
	);`,
);

const createBook = db.prepare(
	`INSERT INTO books (id, title, author, genre)
	VALUES (:id, :title, :author, :genre)`,
);

const findBook = db.prepare(
	`SELECT id, title, author, genre
	FROM books
	WHERE id = :id`,
);

const updateBook = db.prepare(
	`UPDATE books
	SET title = :title, author = :author, genre = :genre
	WHERE id = :id`,
);

module.exports = {
	createBook,
	findBook,
	updateBook,
};
