import { useEffect, useState } from "react";
import api from "../api/axios";

const empty = { name: "", website: "", location: "", notes: "" };

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api.get("companies/")
      .then((res) => setCompanies(res.data))
      .catch(() => setError("Could not load companies"));

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`companies/${editingId}/`, form);
      else await api.post("companies/", form);
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(" ") : "Save failed");
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, website: c.website, location: c.location, notes: c.notes });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company and all its applications?")) return;
    await api.delete(`companies/${id}/`);
    load();
  };

  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  return (
    <div className="container">
      <div className="page-head"><h2>Companies</h2></div>
      {error && <div className="error">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit company" : "Add company"}</h3>
        <div className="form-grid">
          <input name="name" placeholder="Company name" value={form.name} onChange={handleChange} required />
          <input name="website" placeholder="Website (https://...)" value={form.website} onChange={handleChange} />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        </div>
        <button type="submit">{editingId ? "Update" : "Add"}</button>{" "}
        {editingId && <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>}
      </form>

      <br />
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Location</th><th>Website</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {companies.length === 0 && <tr><td colSpan="4">No companies yet.</td></tr>}
            {companies.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.location}</td>
                <td>{c.website && <a href={c.website} target="_blank" rel="noreferrer">Visit</a>}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(c)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}