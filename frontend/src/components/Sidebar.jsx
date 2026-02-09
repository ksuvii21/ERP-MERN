import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, IconButton, useTheme } from '@mui/material';
import { Home, People, Receipt, Inventory, AccountBalance, Psychology, Settings, MenuOpen, ChevronLeft, AccountTree } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open, handleDrawerClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <Home />, path: '/dashboard' },
        { text: 'Employees', icon: <People />, path: '/hr/employees' },
        { text: 'Payroll', icon: <Receipt />, path: '/hr/payroll' },
        { text: 'Projects', icon: <AccountTree />, path: '/projects' },
        { text: 'Inventory', icon: <Inventory />, path: '/inventory' },
        { text: 'Finance', icon: <AccountBalance />, path: '/finance' },
        { text: 'AI Insights', icon: <Psychology />, path: '/ai-insights' },
        { text: 'Settings', icon: <Settings />, path: '/settings' },
    ];

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                width: open ? 240 : 65,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? 240 : 65,
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.background.paper,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: 'hidden',
                },
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                {open && <Typography variant="h6" fontWeight="bold" color="primary">ERP System</Typography>}
                <IconButton onClick={handleDrawerClose}>
                    {open ? <ChevronLeft /> : <MenuOpen />}
                </IconButton>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                bgcolor: location.pathname === item.path ? theme.palette.action.selected : 'transparent',
                                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;