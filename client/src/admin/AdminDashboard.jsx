// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [betStats, setBetStats] = useState({});
  const [pendingEvents, setPendingEvents] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    odds: { YES: "", NO: "" }
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  useEffect(() => {
    if (!token) return;

    const fetchAllData = async () => {
      try {
        const [
          statsRes,
          usersRes,
          transRes,
          withRes,
          betStatsRes,
          pendingEventsRes,
        ] = await Promise.all([
          axios.get("http://localhost:4000/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:4000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:4000/api/admin/transactions", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:4000/api/admin/withdraw/pending", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:4000/api/admin/bets/breakdown", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:4000/api/bets/events/pending", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const withdrawalsData = Array.isArray(withRes.data)
          ? withRes.data
          : withRes.data.withdrawals || [];

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setTransactions(transRes.data);
        setWithdrawals(withdrawalsData);
        setBetStats(betStatsRes.data);

        // Map pending events properly for frontend
        setPendingEvents(pendingEventsRes.data.map(ev => ({
          _id: ev.eventId,
          title: ev.name,
          createdAt: ev.date,
          options: ev.options,
          totalBets: ev.totalBets,
          pendingBets: ev.pendingBets,
          selectedOption: ""
        })));

      } catch (err) {
        console.error("Error fetching admin data:", err.response?.data || err);
      }
    };

    fetchAllData();
  }, [token]);

  const handleWithdrawUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure to ${status} this withdrawal?`)) return;
    try {
      await axios.patch(
        `http://localhost:4000/api/admin/withdraw/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Withdrawal ${status}`);
      setWithdrawals(withdrawals.filter((w) => w._id !== id));
    } catch (err) {
      console.error("Error updating withdrawal:", err.response?.data || err);
      alert("Error updating withdrawal");
    }
  };

  const handleEventAction = async (eventId, action, winningOption) => {
    const confirmText = action === "resolve" ? "resolve" : "cancel";
    if (!window.confirm(`Are you sure to ${confirmText} this event?`)) return;

    try {
      const url =
        action === "resolve"
          ? `http://localhost:4000/api/bets/events/resolve/${eventId}`
          : `http://localhost:4000/api/bets/events/cancel/${eventId}`;
      
      const body = action === "resolve" ? { winningOption } : {};
      await axios.patch(url, body, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Event ${confirmText}d successfully`);
      setPendingEvents(pendingEvents.filter((e) => e._id !== eventId));
    } catch (err) {
      console.error(`Error ${action}ing event:`, err.response?.data || err);
      alert(`Failed to ${confirmText} event`);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const body = {
        title: newEvent.title,
        description: newEvent.description,
        odds: { YES: parseFloat(newEvent.odds.YES), NO: parseFloat(newEvent.odds.NO) }
      };
      const res = await axios.post("http://localhost:4000/api/bets/events", body, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.message || "Event created successfully");
      setNewEvent({ title: "", description: "", odds: { YES: "", NO: "" } });
    } catch (err) {
      console.error("Error creating event:", err.response?.data || err);
      alert("Failed to create event");
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          {["stats", "users", "transactions", "withdrawals", "bets", "create-event"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "active" : ""}
            >
              {tab.charAt(0).toUpperCase() + tab.replace("-", " ").slice(1)}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </aside>

      <main className="main-content">
        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div className="stats-grid">
            {[ 
              { label: "Total Users", value: stats.totalUsers },
              { label: "Total Bets", value: stats.totalBets },
              { label: "Total Withdrawals", value: `$${stats.totalWithdrawals}` },
              { label: "Total Wallet Balance", value: `$${stats.totalWalletBalance}` },
              { label: "Pending Withdrawals", value: stats.pendingWithdrawals },
            ].map((item) => (
              <div key={item.label} className="card">
                <h3>{item.label}</h3>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="table-container">
            <h2>All Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>${u.wallet?.balance || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <div className="table-container">
            <h2>Transactions</h2>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>{t.user?.email || "N/A"}</td>
                    <td>{t.type}</td>
                    <td>${t.amount}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* WITHDRAWALS TAB */}
        {activeTab === "withdrawals" && (
          <div className="table-container">
            <h2>Pending Withdrawals</h2>
            {withdrawals.length === 0 ? (
              <p className="no-data">No pending withdrawals found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Wallet Balance</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w._id}>
                      <td>{w.user?.name}</td>
                      <td>{w.user?.email}</td>
                      <td>${w.amount}</td>
                      <td>${w.wallet?.balance}</td>
                      <td>{new Date(w.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          onClick={() => handleWithdrawUpdate(w._id, "approved")}
                          className="approve"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleWithdrawUpdate(w._id, "declined")}
                          className="decline"
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* BETS TAB */}
        {activeTab === "bets" && (
          <div className="table-container">
            <h2>All Bets Summary</h2>
            <div className="stats-grid">
              {[ 
                { label: "Total Won Bets (By Users)", value: betStats.won?.count },
                { label: "Total Lost Bets (By Users)", value: betStats.lost?.count },
                { label: "Total Pending Bets for resolution", value: betStats.pending?.count },
              ].map((item) => (
                <div key={item.label} className="card">
                  <h3>{item.label}</h3>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Pending Events */}
            <h2>Pending Events (Resolve / Cancel)</h2>
            {pendingEvents.length === 0 ? (
              <p className="no-data">No pending events.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Total Bets</th>
                    <th>Pending Bets</th>
                    <th>Winning Option</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEvents.map((event) => (
                    <tr key={event._id}>
                      <td>{event.title}</td>
                      <td>{new Date(event.createdAt).toLocaleString()}</td>
                      <td>{event.totalBets || 0}</td>
                      <td>{event.pendingBets || 0}</td>
                      <td>
                        <select
                          value={event.selectedOption || ""}
                          onChange={(e) =>
                            setPendingEvents((prev) =>
                              prev.map((ev) =>
                                ev._id === event._id ? { ...ev, selectedOption: e.target.value } : ev
                              )
                            )
                          }
                        >
                          <option value="">Select</option>
                          {event.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEventAction(event._id, "resolve", event.selectedOption)}
                          className="approve"
                          disabled={!event.selectedOption}
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleEventAction(event._id, "cancel")}
                          className="decline"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* CREATE EVENT TAB */}
{activeTab === "create-event" && (
  <div className="table-container">
    <h2>Create New Event</h2>
    <div className="card create-event-card">
      <div className="grid-2cols">
        <div>
          <label>Title</label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="Event Title"
            required
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder="Event Description"
            required
          />
        </div>
        <div>
          <label>Odds YES</label>
          <input
            type="number"
            step="0.01"
            value={newEvent.odds.YES}
            onChange={(e) => setNewEvent({ ...newEvent, odds: { ...newEvent.odds, YES: e.target.value } })}
            required
          />
        </div>
        <div>
          <label>Odds NO</label>
          <input
            type="number"
            step="0.01"
            value={newEvent.odds.NO}
            onChange={(e) => setNewEvent({ ...newEvent, odds: { ...newEvent.odds, NO: e.target.value } })}
            required
          />
        </div>
      </div>
      <button
        onClick={handleCreateEvent}
        className="approve"
        style={{ marginTop: "20px" }}
      >
        Create Event
      </button>
    </div>
  </div>
)}

      </main>
    </div>
  );
}
