// components/BookTable.jsx
const BookTable = ({ books }) => {
  return (
    <div className="bg-white shadow rounded-xl overflow-x-auto mb-8">
      <table className="min-w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">BookID</th>
            <th className="p-4">Title</th>
            <th className="p-4">Issue Date</th>
            <th className="p-4">Due Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No books issued currently.
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4">{book.issueDate}</td>
                <td className="p-4">{book.dueDate}</td>
                <td className="p-4">
                  <span className={`font-semibold ${book.status === "Due" ? "text-yellow-600" : "text-green-600"}`}>
                    {book.status}
                  </span>
                </td>
                <td className="p-4">
                  {book.status === "Due" ? (
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                      Return
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium">✔</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
