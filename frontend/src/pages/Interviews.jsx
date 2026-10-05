import { useEffect, useState } from "react";
import api from "../api/axios";

const empty = { application: "", scheduled_at: "", round_name: "", mode: "online", notes: "" };

const toInputValue = (iso) => {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api.get("interviews/")
      .then((res) => setInterviews(res.data))
      .catch(() => setError("Could not load interviews"));

  useEffect(() => {
    api.get("applications/").then((res) => setApps(res.data));
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`interviews/${editingId}/`, form);
      else await api.post("interviews/", form);
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(" ") : "Save failed");
    }
  };

  const handleEdit = (i) => {
    setEditingId(i.id);
    setForm({
      application: i.application,
      scheduled_at: toInputValue(i.scheduled_at),
      round_name: i.round_name,
      mode: i.mode,
      notes: i.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this interview?")) return;
    await api.delete(`interviews/${id}/`);
    load();
  };

  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  return (
    <div className="container">
      <div className="page-head"><h2>Interviews</h2></div>
      {error && <div className="error">{error}</div>}

      {apps.length === 0 ? (
        <div className="card">Add an application on the Applications page first.</div>
      ) : (
        <form className="card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit interview" : "Schedule interview"}</h3>
          <div className="form-grid">
            <select name="application" value={form.application} onChange={handleChange} required>
              <option value="">Select application</option>
              {apps.map((a) => (
                <option key={a.id} value={a.id}>{a.company_name} - {a.role}</option>
              ))}
            </select>
            <input name="round_name" placeholder="Round (e.g. Technical Round 1)" value={form.round_name} onChange={handleChange} required />
            <input name="scheduled_at" type="datetime-local" value={form.scheduled_at} onChange={handleChange} required />
            <select name="mode" value={form.mode} onChange={handleChange}>
              <option value="online">Online</option>
              <option value="onsite">On-site</option>
              <option value="phone">Phone</option>
            </select>
            <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
          </div>
          <button type="submit">{editingId ? "Update" : "Schedule"}</button>{" "}
          {editingId && <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </form>
      )}

      <br />
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Company / Role</th><th>Round</th><th>Date & time</th><th>Mode</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {interviews.length === 0 && <tr><td colSpan="5">No interviews scheduled.</td></tr>}
            {interviews.map((i) => (
              <tr key={i.id}>
                <td>{i.application_title}</td>
                <td>{i.round_name}</td>
                <td>{new Date(i.scheduled_at).toLocaleString()}</td>
                <td>{i.mode}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(i)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(i.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}