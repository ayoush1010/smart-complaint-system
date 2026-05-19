import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { FiSearch, FiFilter, FiTrash2, FiEdit } from "react-icons/fi";

const categories = ["All", "Water Supply", "Electricity", "Road Maintenance", "Garbage/Sanitation", "Public Safety", "Noise Pollution", "Other"];

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchLoc, setSearchLoc] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get("/complaints");
      setComplaints(data.complaints);
      setFiltered(data.complaints);
    } catch (err) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  useEffect(() => {
    let result = complaints;
    if (filterCat !== "All") {
      result = result.filter((c) => c.category === filterCat);
    }
    if (searchLoc.trim()) {
      result = result.filter((c) => c.location.toLowerCase().includes(searchLoc.toLowerCase()));
    }
    setFiltered(result);
  }, [filterCat, searchLoc, complaints]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/complaints/${id}`);
      toast.success("Complaint removed");
      fetchComplaints();
    } catch (err) {
      toast.error("Failed to delete complaint");
    }
  };

  const getStatusClass = (status) => {
    const map = { Pending: "status-pending", "In Progress": "status-progress", Resolved: "status-resolved", Rejected: "status-rejected" };
    return map[status] || "";
  };

  const getPriorityClass = (priority) => {
    const map = { Low: "priority-low", Medium: "priority-medium", High: "priority-high", Critical: "priority-critical" };
    return map[priority] || "";
  };

  if (loading) return <div className="loading-screen">Loading complaints...</div>;

  return (
    <div className="complaint-list-page">
      <div className="page-header">
        <h1>📑 All Complaints</h1>
        <Link to="/new-complaint" className="btn-primary">+ New Complaint</Link>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch />
          <input type="text" placeholder="Search by location..." value={searchLoc} onChange={(e) => setSearchLoc(e.target.value)} />
        </div>
        <div className="category-filter">
          <FiFilter />
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <p className="results-count">Showing {filtered.length} complaint{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="empty-state"><p>No complaints found matching your filters.</p></div>
      ) : (
        <div className="complaints-card-grid">
          {filtered.map((c) => (
            <div key={c._id} className="complaint-card">
              <div className="card-header">
                <h3><Link to={`/complaints/${c._id}`}>{c.title}</Link></h3>
                <span className={`status-badge ${getStatusClass(c.status)}`}>{c.status}</span>
              </div>
              <p className="card-desc">{c.description.substring(0, 120)}...</p>
              <div className="card-meta">
                <span>📂 {c.category}</span>
                <span>📍 {c.location}</span>
                <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              {c.priority && (
                <span className={`priority-badge ${getPriorityClass(c.priority)}`}>{c.priority} Priority</span>
              )}
              <div className="card-actions">
                <Link to={`/complaints/${c._id}`} className="btn-small btn-edit"><FiEdit /> Update</Link>
                <button className="btn-small btn-delete" onClick={() => handleDelete(c._id)}><FiTrash2 /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
