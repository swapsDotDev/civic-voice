// src/components/Auth/Register.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, InputAdornment, IconButton, Card, Typography, MenuItem } from '@mui/material';
import { Users, UserCheck, Shield, Eye, EyeOff } from 'lucide-react';

const roleConfig = {
  citizen: {
    title: 'Registration',
    description: 'Join as a citizen to report issues and participate in your community.',
    icon: Users,
    color: 'bg-blue-500'
  }
};

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
    inviteCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Default role from query param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialRole = params.get('role');
    if (initialRole && (initialRole === 'officer' || initialRole === 'citizen') && form.role !== initialRole) {
      setForm(f => ({ ...f, role: initialRole, inviteCode: '' }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'inviteCode') setInviteError('');
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value, inviteCode: '' });
    setInviteError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInviteError('');
    setMessage('');
    if (form.role === 'officer' && !form.inviteCode) {
      setInviteError('Invite code is required for officer registration');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (form.role === 'officer' && data.message) setInviteError(data.message);
        throw new Error(data.message || 'Something went wrong');
      }
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login?role=' + form.role);
      }, 1000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const currentRole = roleConfig[form.role];
  const RoleIcon = currentRole.icon;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?city,light')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        {/* Role Badge */}
        {/* <div className="flex justify-center mb-8">
          <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow ${currentRole.color} text-white`}>
            <RoleIcon className="w-4 h-4" />
            {currentRole.title}
          </span>
        </div> */}
        {/* Register Card */}
        <Card className="glass-card border-0 p-8 animate-scale-in">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${currentRole.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <RoleIcon className="w-8 h-8 text-white" />
            </div>
            <Typography variant="h5" className="font-bold mb-2 text-gray-800">Create Your Account</Typography>
            <Typography variant="body2" className="text-gray-600 mb-2">{currentRole.description}</Typography>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              label="Full Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="medium"
              InputProps={{ className: 'bg-white/80 rounded-md' }}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="medium"
              InputProps={{ className: 'bg-white/80 rounded-md' }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="medium"
              InputProps={{
                className: 'bg-white/80 rounded-md',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleRoleChange}
              fullWidth
              variant="outlined"
              size="medium"
              InputProps={{ className: 'bg-white/80 rounded-md' }}
            >
              <MenuItem value="citizen">Citizen</MenuItem>
              <MenuItem value="officer">Officer</MenuItem>
            </TextField>
            {form.role === 'officer' && (
              <TextField
                label="Officer Invite Code"
                name="inviteCode"
                type="text"
                value={form.inviteCode}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                size="medium"
                error={!!inviteError}
                helperText={inviteError}
                InputProps={{ className: 'bg-white/80 rounded-md' }}
              />
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="rounded-lg h-12 font-semibold"
            >
              Register
            </Button>
          </form>
          {/* Login Link */}
          <div className="mt-6 text-center">
            <Typography variant="body2" className="text-gray-600">
              Already have an account?{' '}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate(`/login?role=${form.role}`)}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Button>
            </Typography>
          </div>
          {message && <Typography className="mt-4 text-center text-green-600">{message}</Typography>}
        </Card>
      </div>
    </div>
  );
}
