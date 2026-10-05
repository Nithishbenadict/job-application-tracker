import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <strong>Job Tracker</strong>
      {isAuthenticated && (
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/applications">Applications</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/interviews">Interviews</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}