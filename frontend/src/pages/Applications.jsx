import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUSES = ["applied", "interview", "offer", "rejected"];
const empty = { company: "", role: "", status: "applied", applied_date: "", job_link: "", notes: "" };

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadApps = () =>
    api.get("applications/", { params: { search, status: statusFilter } })
      .then((res) => setApps(res.data))
      .catch(() => setError("Could not load applications"));

  useEffect(() => {
    api.get("companies/").then((res) => setCompanies(res.data));
  }, []);

  useEffect(() => { loadApps(); }, [search, statusFilter]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`applications/${editingId}/`, form);
      else await api.post("applications/", form);
      setForm(empty);
      setEditingId(null);
      loadApps();
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(" ") : "Save failed");
    }
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setForm({
      company: a.company, role: a.role, status: a.status,
      applied_date: a.applied_date, job_link: a.job_link, notes: a.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await api.delete(`applications/${id}/`);
    loadApps();
  };

  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  return (
    <div className="container">
      <div className="page-head"><h2>Applications</h2></div>
      {error && <div className="error">{error}</div>}

      {companies.length === 0 ? (
        <div className="card">Add a company on the Companies page first.</div>
      ) : (
        <form className="card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit application" : "Add application"}</h3>
          <div className="form-grid">
            <select name="company" value={form.company} onChange={handleChange} required>
              <option value="">Select company</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input name="role" placeholder="Role (e.g. Python Developer)" value={form.role} onChange={handleChange} required />
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input name="applied_date" type="date" value={form.applied_date} onChange={handleChange} required />
            <input name="job_link" placeholder="Job link" value={form.job_link} onChange={handleChange} />
            <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
          </div>
          <button type="submit">{editingId ? "Update" : "Add"}</button>{" "}
          {editingId && <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </form>
      )}

      <br />
      <div className="filters">
        <input placeholder="Search by role or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Company</th><th>Role</th><th>Status</th><th>Applied</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {apps.length === 0 && <tr><td colSpan="5">No applications found.</td></tr>}
            {apps.map((a) => (
              <tr key={a.id}>
                <td>{a.company_name}</td>
                <td>{a.role}</td>
                <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                <td>{a.applied_date}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(a)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}