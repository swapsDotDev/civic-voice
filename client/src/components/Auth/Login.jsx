import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, InputAdornment, IconButton, Card, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Users, UserCheck, Shield } from 'lucide-react';

const roleConfig = {
  citizen: {
    title: 'Citizen Portal',
    description: 'Access municipal services and report issues',
    icon: Users,
    color: 'bg-blue-500'
  }
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('citizen');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && roleConfig[roleParam]) {
      setRole(roleParam);
    }
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        if (data.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.role === 'officer') {
          navigate('/officer-dashboard');
        } else {
          navigate('/citizen-dashboard');
        }
      }, 1000);
    } catch (err) {
      setMessage(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = roleConfig[role];
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
        {/* Role Badge
        <div className="flex justify-center mb-8">
          <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow ${currentRole.color} text-white`}>
            <RoleIcon className="w-4 h-4" />
            {currentRole.title}
          </span>
        </div> */}
        {/* Login Card */}
        <Card className="glass-card border-0 p-8 animate-scale-in">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${currentRole.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <RoleIcon className="w-8 h-8 text-white" />
            </div>
            <Typography variant="h5" className="font-bold mb-2 text-gray-800">Welcome Back</Typography>
            <Typography variant="body2" className="text-gray-600 mb-2">{currentRole.description}</Typography>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isLoading}
              className="rounded-lg h-12 font-semibold"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          {/* Register Link */}
          <div className="mt-6 text-center">
            <Typography variant="body2" className="text-gray-600">
              New {role}?{' '}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate(`/register?role=${role}`)}
                className="text-blue-600 hover:underline font-medium"
              >
                Create an account
              </Button>
            </Typography>
          </div>
          {/* Role Switcher */}
          {/* <div className="mt-8 pt-6 border-t border-gray-200">
            <Typography variant="caption" className="text-gray-500 text-center block mb-3">
              Different role?
            </Typography>
            <div className="flex gap-2 justify-center">
              {Object.entries(roleConfig).map(([key, config]) => (
                <Button
                  key={key}
                  variant={role === key ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => navigate(`/login?role=${key}`)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${role === key ? 'bg-blue-600 text-white' : 'bg-white/10 text-blue-700 hover:bg-blue-50'}`}
                >
                  {config.title.split(' ')[0]}
                </Button>
              ))}
            </div>
          </div> */}
          {message && <Typography className="mt-4 text-center text-red-600">{message}</Typography>}
        </Card>
      </div>
    </div>
  );
}
