import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ toggleSidebar, toggleNotifications }) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      className="!bg-white/90 !backdrop-blur-md !border-b !border-blue-100 shadow-sm z-50"
    >
      <Toolbar className="flex justify-between px-4">
        <div className="flex items-center space-x-2">
          <IconButton edge="start" onClick={toggleSidebar} className="text-blue-600">
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" className="text-blue-700 font-bold tracking-tight">
            CivicVoice
          </Typography>
        </div>
        <IconButton onClick={toggleNotifications} className="text-blue-600">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
