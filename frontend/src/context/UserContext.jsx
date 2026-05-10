//src\context\UserContext.jsx
import { createContext, useContext, useState } from "react";

// Dummy user data
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    hasCard: true,
    lateFees: 50,
    issueHistory: ["Book A", "Book B"],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    hasCard: false,
    lateFees: 0,
    issueHistory: [],
  },
];

const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);

  const issueCard = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === parseInt(userId) ? { ...u, hasCard: true } : u))
    );
  };

  const clearLateFees = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, lateFees: 0 } : u))
    );
  };

  return (
    <UserContext.Provider value={{ users, issueCard, clearLateFees }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => useContext(UserContext);
