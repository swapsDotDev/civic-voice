import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  BarChart3,
  AlertCircle,
  ArrowRight,
  Mail,
  Github,
  Twitter,
} from 'lucide-react';
import { Button, Typography } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action === 'login' || action === 'register') {
      navigate(`/${action}`);
    } else if (action === 'report') {
      document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'dashboard') {
      navigate('/login');
    }
  };

  const keyFeatures = [
    {
      icon: <MapPin className="w-7 h-7 text-blue-500" />,
      title: 'Smart Geo-Tagging',
      description: 'Auto-locate and cluster civic issues on interactive maps',
    },
    {
      icon: <Users className="w-7 h-7 text-green-500" />,
      title: 'Community Voting',
      description: 'Vote on issues and see real community impact',
    },
    {
      icon: <BarChart3 className="w-7 h-7 text-purple-500" />,
      title: 'Transparency Dashboard',
      description: 'Public data on resolution rates and response times',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/30 sticky top-0 z-50 shadow-md rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse shadow-md">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <Typography variant="h5" className="!font-bold !text-gray-100 tracking-tight !text-xl">
                Civic Voice
              </Typography>
            </div>
            <div className="flex gap-3 w-full sm:w-auto justify-center">
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                onClick={() => handleAction('login')}
                className="!rounded-lg !px-4 !py-2 !font-semibold hover:scale-105 transition-transform w-full sm:w-auto bg-white/80 backdrop-blur-sm"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => handleAction('register')}
                className="!rounded-lg !px-4 !py-2 !font-semibold hover:scale-105 transition-transform w-full sm:w-auto shadow-md"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Typography variant="h2" className="!font-bold !text-gray-900 mb-4 !leading-tight text-4xl sm:text-5xl md:text-6xl">
            Bridge the Gap Between
            <span className="text-blue-600 block">Citizens & Government</span>
          </Typography>
          <Typography variant="subtitle1" className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Report civic issues, vote on community priorities, and track real-time progress through our transparent governance platform.
          </Typography>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => handleAction('report')}
              className="flex items-center justify-center gap-2 !rounded-lg !px-4 !py-2 !font-semibold hover:scale-105 transition-transform text-base"
              endIcon={<ArrowRight className="w-5 h-5" />}
            >
              Report an Issue
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              onClick={() => handleAction('dashboard')}
              className="!rounded-lg !px-4 !py-2 !font-semibold hover:scale-105 transition-transform text-base"
            >
              View Dashboard
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['🗺️ Smart Mapping', '🗳️ Community Driven', '📊 100% Transparent', '🔔 Real-time Updates', '🌐 Multilingual Support'].map((label, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-gray-800 border border-white/30 rounded-full text-sm font-medium shadow hover:scale-105 transition-all"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="max-w-5xl mx-auto">
          <Typography variant="h3" className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center shadow group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <Typography variant="h6" className="text-lg font-semibold mb-4 text-center text-gray-800 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </Typography>
                <Typography className="text-gray-700 text-center text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/30 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '2.8K+', label: 'Issues Resolved', color: 'text-blue-600' },
              { value: '89%', label: 'Resolution Rate', color: 'text-green-600' },
              { value: '3.2', label: 'Avg Response Days', color: 'text-purple-600' },
              { value: '15K+', label: 'Active Citizens', color: 'text-orange-600' }
            ].map((stat, i) => (
              <div key={i}>
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <p className="text-gray-700 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-white/10 backdrop-blur-xl rounded-3xl p-10 sm:p-14 text-white shadow-xl border border-white/20">
          <Typography variant="h4" className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </Typography>
          <Typography className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of citizens already using Civic Voice to improve their communities.
          </Typography>
          <Button
            variant="contained"
            size="medium"
            onClick={() => handleAction('register')}
            className="!rounded-full !px-4 !py-2 !font-bold bg-white/90 text-blue-700 hover:bg-white hover:text-blue-800 transition-all duration-200"
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-lg text-white py-10 mt-20 border-t border-white/10 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <Typography variant="h6" className="text-lg font-bold">
                Civic Voice
              </Typography>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Connect with us:</span>
              <div className="flex gap-2">
                {[
                  { icon: <Mail className="w-4 h-4" />, label: 'Email' },
                  { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                  { icon: <Github className="w-4 h-4" />, label: 'GitHub' }
                ].map((social, i) => (
                  <button
                    key={i}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                    title={social.label}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-6 pt-6 border-t border-gray-800">
            © 2024 Civic Voice. Empowering communities through technology.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
