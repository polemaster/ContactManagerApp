import React, { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
}

export interface ContactDetail {
  id: number;                // 0 for "new"
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  category: string;
  subcategory: string | null;
  phone: string | null;
  dateOfBirth: string | null;
}

interface Props {
  initial: ContactDetail;
  onSave: () => void;
}

export default function ContactForm({ initial, onSave }: Props) {
  // determine mode
  const isNew = initial.id === 0;

  // form state
  const [firstName, setFirstName]   = useState(initial.firstName);
  const [lastName, setLastName]     = useState(initial.lastName);
  const [email, setEmail]           = useState(initial.email);
  const [password, setPassword]     = useState(initial.password);
  const [phone, setPhone]           = useState(initial.phone || "");
  const [dob, setDob]               = useState(initial.dateOfBirth || "");

  // categories & subcats
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null);
  const [otherSubcategory, setOtherSubcategory] = useState<string>(
    initial.subcategory || ""
  );

  // load categories + subcategories
  useEffect(() => {
    fetch("/api/categories", { credentials: "include" })
      .then((r) => r.json())
      .then((cats: Category[]) => {
        setCategories(cats);
        // pick the matching category by name, or default to first
        const initCat = cats.find((c) => c.name === initial.category);
        setCategoryId(initCat?.id ?? cats[0].id);
      });
  }, [initial.category]);

  // when category changes, reset sub‐fields
  useEffect(() => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    if (cat.subcategories.length > 0) {
      // business: pick the matching subcategory or none
      const init = cat.subcategories.find((s) => s.name === initial.subcategory);
      setSubcategoryId(init ? init.id : null);
      setOtherSubcategory("");
    } else if (cat.name === "Other") {
      // other: free‐text
      setOtherSubcategory(initial.subcategory || "");
      setSubcategoryId(null);
    } else {
      // private: no subfield
      setSubcategoryId(null);
      setOtherSubcategory("");
    }
  }, [categoryId, categories, initial.subcategory]);

  // submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // build payload exactly as API expects
    const payload: any = {
      firstName,
      lastName,
      email,
      password,        
      categoryId,
      phone: phone || undefined,
      dateOfBirth: dob || undefined,
    };
    const cat = categories.find((c) => c.id === categoryId)!;
    if (cat.subcategories.length > 0) {
      payload.subcategoryId = subcategoryId;
    } else if (cat.name === "Other") {
      payload.otherSubcategory = otherSubcategory;
    }

    // decide URL + method
    const url    = isNew ? "/api/contacts" : `/api/contacts/${initial.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      onSave();
    } else {
      const txt = await res.text();
      alert("Error saving: " + txt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg">{isNew ? "New Contact" : "Edit Contact"}</h2>

      {/* First & Last Name */}
      {["First Name", "Last Name"].map((label, i) => {
        const val = i === 0 ? firstName : lastName;
        const setter = i === 0 ? setFirstName : setLastName;
        return (
          <div key={label}>
            <label className="block">{label}</label>
            <input
              type="text"
              className="border w-full p-2"
              value={val}
              onChange={(e) => setter(e.target.value)}
              required
            />
          </div>
        );
      })}

      {/* Email */}
      <div>
        <label className="block">Email</label>
        <input
          type="email"
          className="border w-full p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password (always) */}
      <div>
        <label className="block">Password</label>
        <input
          type="text"
          className="border w-full p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block">Category</label>
        <select
          className="border w-full p-2"
          value={categoryId}
          onChange={(e) => setCategoryId(+e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory / Other */}
      {(() => {
        const cat = categories.find((c) => c.id === categoryId);
        if (!cat) return null;

        if (cat.subcategories.length > 0) {
          return (
            <div>
              <label className="block">Subcategory</label>
              <select
                className="border w-full p-2"
                value={subcategoryId ?? ""}
                onChange={(e) =>
                  setSubcategoryId(
                    e.target.value ? +e.target.value : null
                  )
                }
                required
              >
                <option value="">-- select --</option>
                {cat.subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          );
        } else if (cat.name === "Other") {
          return (
            <div>
              <label className="block">Other Subcategory</label>
              <input
                type="text"
                className="border w-full p-2"
                value={otherSubcategory}
                onChange={(e) => setOtherSubcategory(e.target.value)}
                required
              />
            </div>
          );
        }
        return null;
      })()}

      {/* Phone */}
      <div>
        <label className="block">Phone</label>
        <input
          type="tel"
          className="border w-full p-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block">Date of Birth</label>
        <input
          type="date"
          className="border w-full p-2"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {isNew ? "Create" : "Update"}
      </button>
    </form>
  );
}
