import React from "react";
import BookItem from "./BookItem";

export default function BooksList({ books, onEdit, onDelete }) {
  if (!books.length) {
    return <div className="empty">Книг пока нет</div>;
  }

  return (
    <div className="list">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}