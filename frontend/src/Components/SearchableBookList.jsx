//src/Components/SearchableBookList.jsx
import React from "react";
const SearchableBookList = ({
  books,
  query,
  category,
  onQueryChange,
  onCategoryChange,
  selected,
  toggleSelect,
  disabledIds,
}) => {
  const filtered = books.filter((book) => {
    const q = query.toLowerCase();
    const matchQuery =
      book.bookid?.toLowerCase().includes(q) ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q);
    const matchCategory = category === "" || book.category === category;
    return matchQuery && matchCategory;
  });

  const uniqueCategories = [...new Set(books.map((b) => b.category).filter(Boolean))];

  return (
    <>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Title, Author, or Book ID..."
          className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Categories</option>
          <option value="All">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow rounded-xl max-h-96 overflow-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 w-12"></th>
              <th className="p-4">Book ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Category</th>
              <th className="p-4">Available</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No books found.
                </td>
              </tr>
            ) : (
              filtered.map((book) => (
                <tr
                  key={book.id}
                  className={`border-b hover:bg-gray-50 ${
                    selected.includes(book.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(book.id)}
                      onChange={() => toggleSelect(book.id)}
                      disabled={disabledIds.includes(book.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="p-4">{book.bookid}</td>
                  <td className="p-4 font-medium text-gray-800">{book.title}</td>
                  <td className="p-4">{book.author}</td>
                  <td className="p-4">{book.category || "N/A"}</td>
                  <td className="p-4">
                    {book.available ? (
                      <span className="text-green-600 font-medium">Available</span>
                    ) : (
                      <span className="text-red-500 font-medium">Unavailable</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SearchableBookList;



