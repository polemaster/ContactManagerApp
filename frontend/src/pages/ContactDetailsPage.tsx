import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ContactDetail {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  category: string;
  subcategory: string | null;
  phone: string | null;
  dateOfBirth: string | null;
}

export default function ContactDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ContactDetail | null>(null);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/contacts/${id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch(() => nav("/"));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Really delete this contact?")) return;
    await fetch(`/api/contacts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    nav("/");
  };

  if (!data) return <div>Loading…</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-2">
      <p><strong>First Name:</strong> {data.firstName}</p>
      <p><strong>Last Name::</strong> {data.lastName}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Password:</strong> {data.password}</p>
      <p><strong>Category:</strong> {data.category}</p>
      {data.subcategory && (
        <p><strong>Subcategory:</strong> {data.subcategory}</p>
      )}
      {data.phone && <p><strong>Phone:</strong> {data.phone}</p>}
      <p><strong>Phone:</strong> {data.phone}</p>
      {data.dateOfBirth && (
        <p><strong>Date of Birth:</strong> {data.dateOfBirth}</p>
      )}

      {user && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => nav(-1)}
            className="cursor-pointer bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={() => nav(`/contacts/${data.id}/edit`)}
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}