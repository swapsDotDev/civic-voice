import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import MapIcon from '@mui/icons-material/Map';

const Sidebar = ({ open, onClose, onNavigate }) => {
  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '' },
    { text: 'Report Issue', icon: <ReportIcon />, path: '/citizen/add-complaint' },
    { text: 'Map View', icon: <MapIcon />, path: '/citizen/map' },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div className="w-64 p-4 bg-white/80 backdrop-blur-xl h-full border-r border-blue-100">
        <h2 className="text-xl font-semibold mb-6 text-blue-700">Citizen Menu</h2>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                onNavigate(item.path);
                onClose();
              }}
              className="rounded-lg mb-2 hover:bg-blue-100 transition"
            >
              <ListItemIcon className="text-blue-600">{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ className: 'text-gray-800 font-medium' }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
