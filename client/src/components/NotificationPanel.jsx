import React, { useState } from 'react';
import {
  Popover,
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const mockNotifications = [
  {
    id: 1,
    type: 'mention',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: <><b>Dora Pash</b> published in <b>Project TM Tools in Design</b></>,
    time: '2m ago',
    unread: true,
  },
  {
    id: 2,
    type: 'file',
    avatar: <InsertDriveFileIcon className="text-blue-500" />,
    title: <><b>Max Lee</b> attached files</>,
    files: [
      { name: 'homegroup.pdf' },
      { name: 'illustration.png' },
    ],
    time: '10m ago',
    unread: true,
  },
  {
    id: 3,
    type: 'invite',
    avatar: <PersonAddIcon className="text-green-500" />,
    title: <><b>Sofie Cooper</b> sent a <b>Project Invitation</b></>,
    time: '1h ago',
    unread: false,
    actions: [
      { label: 'Accept', color: 'primary', icon: <CheckIcon fontSize="small" /> },
      { label: 'Decline', color: 'error', icon: <ClearIcon fontSize="small" /> },
    ],
  },
  {
    id: 4,
    type: 'message',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    title: <><b>John Owner</b> sent a message in <b>All Tools in Design</b></>,
    time: '2h ago',
    unread: false,
  },
];

const tabOptions = [
  { label: 'All', value: 'all' },
  { label: 'Mentions', value: 'mention' },
  { label: 'Files', value: 'file' },
  { label: 'Invites', value: 'invite' },
];

export default function NotificationPanel({ anchorEl, setAnchorEl }) {
  const [tab, setTab] = useState('all');

  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  const filtered =
    tab === 'all'
      ? mockNotifications
      : mockNotifications.filter((n) => n.type === tab);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        className:
          'w-80 max-w-full rounded-xl shadow-lg border border-gray-200 bg-white/95 backdrop-blur-xl',
        style: { marginTop: 10 },
      }}
    >
      <Box className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-gray-100">
        <Typography variant="subtitle1" className="font-semibold text-blue-700 text-sm">
          Notifications
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        className="px-2 min-h-0 h-8"
        TabIndicatorProps={{ className: 'bg-blue-600' }}
      >
        {tabOptions.map((t) => (
          <Tab
            key={t.value}
            value={t.value}
            label={t.label}
            className="capitalize text-xs font-medium min-w-[60px] px-2 py-1"
            style={{ minHeight: 0, height: 28 }}
          />
        ))}
      </Tabs>
      <Divider className="!my-0" />
      <Box className="max-h-80 overflow-y-auto">
        {filtered.length === 0 ? (
          <Typography className="p-6 text-center text-gray-400 text-xs">No notifications</Typography>
        ) : (
          filtered.map((n, i) => (
            <Box
              key={n.id}
              className={`flex items-start gap-2 px-3 py-2 ${n.unread ? 'bg-blue-50' : ''} hover:bg-blue-100/60 transition rounded-lg`}
            >
              {typeof n.avatar === 'string' ? (
                <Avatar src={n.avatar} className="w-8 h-8 mt-1" />
              ) : (
                <Avatar className="w-8 h-8 mt-1 bg-blue-100">{n.avatar}</Avatar>
              )}
              <Box className="flex-1">
                <Typography className="text-xs text-gray-800 leading-snug">
                  {n.title}
                </Typography>
                {n.files && (
                  <Box className="flex flex-col gap-1 mt-1">
                    {n.files.map((f, idx) => (
                      <Box key={idx} className="flex items-center gap-2 text-xs text-blue-700">
                        <InsertDriveFileIcon fontSize="small" />
                        <span>{f.name}</span>
                      </Box>
                    ))}
                  </Box>
                )}
                {n.actions && (
                  <Box className="flex gap-2 mt-1">
                    {n.actions.map((a, idx) => (
                      <Button
                        key={a.label}
                        size="small"
                        color={a.color}
                        variant="outlined"
                        startIcon={a.icon}
                        className="rounded-full text-xs px-2 py-0.5"
                        style={{ minHeight: 0, height: 24 }}
                      >
                        {a.label}
                      </Button>
                    ))}
                  </Box>
                )}
                <Typography className="text-[11px] text-gray-400 mt-0.5">{n.time}</Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
      <Divider className="!my-0" />
      <Box className="flex items-center justify-between px-3 py-2">
        <Button size="small" color="primary" className="text-xs font-medium px-2 py-0.5" style={{ minHeight: 0, height: 24 }}>
          Mark all as read
        </Button>
        <Button size="small" color="primary" className="text-xs font-medium px-2 py-0.5" style={{ minHeight: 0, height: 24 }}>
          See all notifications
        </Button>
      </Box>
    </Popover>
  );
}
