// client/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Pages/Homepage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Admin/Admindashboard';
import CitizenDashboard from './components/Member/Citizendashboard';
import OfficerDashboard from './components/Officer/Officerdahboard';
import AddComplaint from './components/Member/AddComplaint';
import Error404Page from './components/Pages/404errorpage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Protected Officer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['officer']} />}>
          <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        </Route>

        {/* Protected Citizen Routes */}
        <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
          <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
          <Route path="/add-complaint" element={<AddComplaint />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </Router>
  );
}

export default App;
