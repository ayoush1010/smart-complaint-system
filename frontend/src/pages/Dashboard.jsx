import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FiPlus, FiSearch, FiFileText, FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/complaints");
        const complaints = data.complaints;
        setStats({
          total: complaints.length,
          pending: complaints.filter((c) => c.status === "Pending").length,
          inProgress: complaints.filter((c) => c.status === "In Progress").length,
          resolved: complaints.filter((c) => c.status === "Resolved").length,
        });
        setRecentComplaints(complaints.slice(0, 5));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    const map = { Pending: "status-pending", "In Progress": "status-progress", Resolved: "status-resolved", Rejected: "status-rejected" };
    return map[status] || "";
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Manage and track complaints efficiently</p>
        </div>
        <Link to="/new-complaint" className="btn-primary">
          <FiPlus /> New Complaint
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-total">
          <FiFileText className="stat-icon" />
          <div>
            <h3>{stats.total}</h3>
            <p>Total Complaints</p>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <FiClock className="stat-icon" />
          <div>
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card stat-progress">
          <FiAlertTriangle className="stat-icon" />
          <div>
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card stat-resolved">
          <FiCheckCircle className="stat-icon" />
          <div>
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Complaints</h2>
          <Link to="/complaints" className="btn-secondary">
            <FiSearch /> View All
          </Link>
        </div>
        {recentComplaints.length === 0 ? (
          <div className="empty-state">
            <p>No complaints yet. Create your first complaint!</p>
          </div>
        ) : (
          <div className="complaints-table-wrapper">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c._id}>
                    <td><Link to={`/complaints/${c._id}`}>{c.title}</Link></td>
                    <td>{c.category}</td>
                    <td>{c.location}</td>
                    <td><span className={`status-badge ${getStatusClass(c.status)}`}>{c.status}</span></td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
