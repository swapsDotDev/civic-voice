import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import NotificationPanel from '../NotificationPanel';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CitizenDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [animatedStats, setAnimatedStats] = useState({ resolved: 0, pending: 0, total: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        let url = 'http://localhost:5000/api/complaints';
        const params = [];
        if (filterStatus !== 'all') params.push(`status=${encodeURIComponent(filterStatus)}`);
        if (params.length) url += '?' + params.join('&');
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch complaints');
        setComplaints(data);
        // Update stats
        const resolved = data.filter(c => c.status === 'Resolved').length;
        const pending = data.filter(c => c.status === 'Pending').length;
        setAnimatedStats({
          resolved,
          pending,
          total: data.length
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [filterStatus]);

  // Animate stats on load (keep for effect)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ resolved: 45, pending: 12, total: 57 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddComplaint = () => {
    navigate('/add-complaint');
  };

  // After successful complaint submission, redirect here with a state flag
  useEffect(() => {
    if (location.state && location.state.complaintSubmitted) {
      // Optionally show a toast or message
      // e.g., setMessage('Complaint submitted!');
      window.history.replaceState({}, document.title); // Clear state
    }
  }, [location.state]);

  const recentComplaints = [
    {
      id: 1,
      title: "Garbage Collection Delayed",
      category: "Waste Management",
      status: "pending",
      votes: 23,
      comments: 5,
      time: "2 hours ago",
      priority: "high"
    },
    {
      id: 2,
      title: "Illegal Parking at Block B",
      category: "Traffic",
      status: "in-progress", 
      votes: 18,
      comments: 3,
      time: "4 hours ago",
      priority: "medium"
    },
    {
      id: 3,
      title: "Street Light Not Working",
      category: "Infrastructure",
      status: "resolved",
      votes: 12,
      comments: 2,
      time: "1 day ago",
      priority: "low"
    }
  ];

  const topIssues = [
    { title: "Broken Road in Sector 4", votes: 120, trending: true },
    { title: "Water Leakage - Lane 5", votes: 85, trending: false },
    { title: "Streetlight Out - Main Road", votes: 60, trending: true }
  ];

  // Map backend status/category to display color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'in progress': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar
          toggleSidebar={() => setSidebarOpen(true)}
          toggleNotifications={(e) => setNotificationAnchor(e.currentTarget)}
        />

        <main className="flex-1 p-2 sm:p-4 mt-14 overflow-y-auto w-full">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
                <p className="text-gray-600 text-sm sm:text-base">Monitor and manage community issues effectively</p>
              </div>
              <button
                onClick={handleAddComplaint}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium text-sm sm:text-base"
              >
                <span className="group-hover:rotate-90 transition-transform duration-300 text-xl">+</span>
                Add Complaint
              </button>
            </div>
          </div>

          {/* Filter Bar (Status only) */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-auto">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📊</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm appearance-none cursor-pointer w-full sm:w-auto text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Complaints</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{animatedStats.total}</p>
                </div>
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <span className="text-xl sm:text-2xl">📋</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
                <span>↗️ +12% from last month</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">{animatedStats.pending}</p>
                </div>
                <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                  <span className="text-xl sm:text-2xl">⏳</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-orange-600">
                <span>⚠️ Needs attention</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Resolved</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{animatedStats.resolved}</p>
                </div>
                <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                  <span className="text-xl sm:text-2xl">✅</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
                <span>🎉 Great progress!</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Smart Geo-Tagging - Large Card */}
            <div className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 overflow-hidden mb-6 xl:mb-0">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                      🗺️ Smart Geo-Tagging
                    </h2>
                    <p className="text-gray-600 mt-1 text-xs sm:text-sm">Live map with clustering & heatmap visualization</p>
                  </div>
                  <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm mt-2 sm:mt-0">
                    View Full Map
                  </button>
                </div>
              </div>
              <div className="h-48 sm:h-80 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-gray-500 relative overflow-hidden">
                <div className="text-center z-10">
                  <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">🗺️</div>
                  <p className="text-base sm:text-lg font-medium">Interactive Map Coming Soon</p>
                  <p className="text-xs sm:text-sm mt-2">Real-time complaint mapping & analytics</p>
                </div>
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-red-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 right-1/3 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full animate-pulse delay-700"></div>
                </div>
              </div>
            </div>

            {/* Top Voted Issues */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 mb-6 xl:mb-0">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  🗳️ Top Voted Issues
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {topIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{issue.title}</span>
                          {issue.trending && <span className="text-[10px] sm:text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">🔥 Trending</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1 sm:mt-2">
                          <span className="text-[10px] sm:text-xs text-gray-500">👍 {issue.votes} votes</span>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-600">
                        <span>Vote</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="mt-6 sm:mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  📬 Recent Complaints
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">View All</button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading complaints...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : complaints.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No complaints found.</div>
              ) : (
                complaints.map((complaint) => (
                  <div key={complaint._id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors duration-200 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{complaint.title}</h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(complaint.status)}`}>
                            {complaint.status?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{complaint.category} • {new Date(complaint.dateReported).toLocaleDateString()}</p>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                            📍 {complaint.location?.address || complaint.landmark || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                            🕒 {complaint.preferredTime || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        {complaint.imageUrl && (
                          <a href={complaint.imageUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors duration-200">View Image</a>
                        )}
                        <button className="bg-green-50 hover:bg-green-100 text-green-600 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors duration-200">
                          Support
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <NotificationPanel anchorEl={notificationAnchor} setAnchorEl={setNotificationAnchor} />
        </main>
      </div>
    </div>
  );
}



