import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, Fab, Drawer } from '@mui/material';
import { SmartToy } from '@mui/icons-material';
import { ColorModeContext, useMode } from '../theme';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';
import ERPBrain from '../pages/ERPBrain';
import { motion } from 'framer-motion';

const Layout = () => {
    const [theme, colorMode] = useMode();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [aiOpen, setAiOpen] = useState(false);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box display="flex" height="100vh">
                    <Sidebar open={isSidebarOpen} handleDrawerClose={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <Box flexGrow={1} display="flex" flexDirection="column" height="100%" overflow="hidden">
                        <Topbar />
                        <Box flexGrow={1} p={3} overflow="auto" sx={{ backgroundColor: theme.palette.background.default }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Outlet />
                            </motion.div>
                        </Box>
                    </Box>

                    {/* Global AI Assistant */}
                    <Fab 
                        color="primary" 
                        aria-label="ai-brain" 
                        sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}
                        onClick={() => setAiOpen(true)}
                    >
                        <SmartToy />
                    </Fab>

                    <Drawer anchor="right" open={aiOpen} onClose={() => setAiOpen(false)}>
                        <Box width={400} height="100%">
                            <ERPBrain onClose={() => setAiOpen(false)} />
                        </Box>
                    </Drawer>
                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default Layout;