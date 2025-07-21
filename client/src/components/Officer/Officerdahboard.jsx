import { useNavigate } from 'react-router-dom';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Officer Dashboard</h2>
        <button onClick={handleLogout} style={{ marginLeft: 16 }}>Logout</button>
      </div>
      <p>Welcome, Officer!</p>
    </div>
  );
}
  