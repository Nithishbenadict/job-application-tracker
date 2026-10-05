import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("dashboard/")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load dashboard"));
  }, []);

  if (error) return <div className="container error">{error}</div>;
  if (!stats) return <div className="container">Loading...</div>;

  const items = [
    ["Total applications", stats.total_applications],
    ["Companies", stats.total_companies],
    ["Applied", stats.by_status.applied],
    ["Interview", stats.by_status.interview],
    ["Offers", stats.by_status.offer],
    ["Rejected", stats.by_status.rejected],
    ["Upcoming interviews", stats.upcoming_interviews],
  ];

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="stats">
        {items.map(([label, value]) => (
          <div className="card stat" key={label}>
            <h2>{value}</h2>
            <p>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}