import React from "react";

export default function BookItem({ book, onEdit, onDelete }) {
  return (
    <div className="bookRow">
      <div className="bookMain">
        <div className="bookId">#{book.id}</div>
        <div className="bookName">{book.name}</div>
        <div className="bookCategory">{book.category}</div>
        <div className="bookPrice">{book.price} ₽</div>
        <div className="bookStock">В наличии: {book.stock} шт.</div>
      </div>
      <div className="bookDescription">{book.description}</div>
      <div className="bookActions">
        <button className="btn" onClick={() => onEdit(book)}>
          Редактировать
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(book.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}