import React, { useContext } from 'react';
import { Box, IconButton, useTheme, InputBase, Badge, Avatar } from '@mui/material';
import { DarkMode, LightMode, Notifications, Search, Settings } from '@mui/icons-material';
import { ColorModeContext } from '../theme';

const Topbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

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
                <IconButton>
                    <Avatar sx={{ width: 30, height: 30 }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Topbar;