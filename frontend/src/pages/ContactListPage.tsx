import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export default function ContactListPage() {
  const [list, setList] = useState<Contact[]>([]);

  useEffect(() => {
    fetch("/api/contacts", { credentials: "include" })
      .then((res) => res.json())
      .then(setList)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Contacts</h2>
        <Link to="/new" className="bg-blue-500 text-white px-3 py-1 rounded">
          + New
        </Link>
      </div>
      <ul className="bg-white shadow rounded">
        {list.map((c) => (
          <li
            key={c.id}
            className="border-b last:border-none p-2 hover:bg-gray-50"
          >
            <Link to={`/contacts/${c.id}`} className="block">
              {c.firstName} {c.lastName} ({c.email})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
