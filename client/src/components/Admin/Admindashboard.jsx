import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [invites, setInvites] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Fetch invites
  const fetchInvites = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/invites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInvites(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage('Failed to fetch invites');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvites();
    // eslint-disable-next-line
  }, []);

  // Create invite
  const handleCreateInvite = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email) {
      setMessage('Officer email is required');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create invite');
      setMessage(`Invite created for ${data.email} with code: ${data.code}`);
      setEmail('');
      fetchInvites();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Revoke invite
  const handleRevoke = async (code) => {
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/invites/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to revoke invite');
      setMessage('Invite revoked');
      fetchInvites();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ marginLeft: 16 }}>Logout</button>
      </div>
      <p>Welcome, Admin!</p>
      <hr />
      <h3>Officer Invitations</h3>
      <form onSubmit={handleCreateInvite} style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Officer email (required)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginRight: 8 }}
          required
        />
        <button type="submit">Generate Invite</button>
      </form>
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading invites...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: 16, width: '100%', maxWidth: 600 }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Email</th>
              <th>Status</th>
              <th>Used By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invites.length === 0 && (
              <tr><td colSpan={5}>No invites</td></tr>
            )}
            {invites.map(invite => (
              <tr key={invite.code}>
                <td>{invite.code}</td>
                <td>{invite.email || '-'}</td>
                <td>{invite.used ? 'Used' : 'Unused'}</td>
                <td>{invite.usedBy ? `${invite.usedBy.name} (${invite.usedBy.email})` : '-'}</td>
                <td>
                  {!invite.used && (
                    <button onClick={() => handleRevoke(invite.code)} style={{ color: 'red' }}>Revoke</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
  