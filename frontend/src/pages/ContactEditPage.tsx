import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContactForm, { type ContactDetail } from "../components/ContactForm";

export default function ContactEditPage({
  isNew = false,
}: { isNew?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [initial, setInitial] = useState<ContactDetail>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    category: "",
    subcategory: null,
    phone: null,
    dateOfBirth: null,
  });

  useEffect(() => {
    if (!isNew && id) {
      // load existing
      fetch(`/api/contacts/${id}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data: ContactDetail) => setInitial(data))
        .catch(() => nav("/"));
    }
  }, [id, isNew]);

  const onSave = () => {
    // after create/update, go back to view
    const dest = isNew ? "/" : `/contacts/${id}`;
    nav(dest);
  };

  // wait until we have an initial.category set for edit
  if (!isNew && !initial.category) return <div>Loading…</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md">
      <ContactForm initial={initial} onSave={onSave} />
    </div>
  );
}
