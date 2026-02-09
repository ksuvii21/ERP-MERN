import React, { useContext, useState } from 'react';
import { Box, IconButton, useTheme, InputBase, Badge, Avatar, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { DarkMode, LightMode, Notifications, Search, Settings, Logout as LogoutIcon } from '@mui/icons-material';
import { ColorModeContext } from '../theme';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../redux/slices/authSlice';

const Topbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
        handleClose();
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2} bgcolor={theme.palette.background.paper} boxShadow={1}>
            {/* Search Bar */}
            <Box display="flex" backgroundColor={theme.palette.background.default} borderRadius="8px">
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search..." />
                <IconButton type="button" sx={{ p: 1 }}>
                    <Search />
                </IconButton>
            </Box>

            {/* Icons */}
            <Box display="flex" gap={1}>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? <DarkMode /> : <LightMode />}
                </IconButton>
                <IconButton>
                    <Badge badgeContent={4} color="error">
                        <Notifications />
                    </Badge>
                </IconButton>
                <IconButton>
                    <Settings />
                </IconButton>
                <IconButton onClick={handleClick}>
                    <Avatar sx={{ width: 30, height: 30 }} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default Topbar;