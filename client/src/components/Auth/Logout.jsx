// client/src/components/Auth/Logout.jsx
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{ marginLeft: 16 }}>
      Logout
    </button>
  );
}