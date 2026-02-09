import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color Design Tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: { main: "#3b82f6" }, // Blue 500
        secondary: { main: "#10b981" }, // Emerald 500
        background: { default: "#0f172a", paper: "#1e293b" }, // Slate 900/800
        text: { primary: "#f8fafc", secondary: "#94a3b8" },
      }
    : {
        primary: { main: "#2563eb" }, // Blue 600
        secondary: { main: "#059669" }, // Emerald 600
        background: { default: "#f1f5f9", paper: "#ffffff" }, // Slate 100
        text: { primary: "#0f172a", secondary: "#64748b" },
      }),
});

// Context for Color Mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...tokens(mode),
        },
        typography: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          h1: { fontSize: 32, fontWeight: 700 },
          h2: { fontSize: 26, fontWeight: 700 },
          h3: { fontSize: 22, fontWeight: 600 },
          h4: { fontSize: 18, fontWeight: 600 },
          h5: { fontSize: 16, fontWeight: 500 },
          h6: { fontSize: 14, fontWeight: 500 },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontWeight: 600
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: '12px',
                        boxShadow: mode === 'light' ? '0px 4px 20px rgba(0,0,0,0.05)' : 'none'
                    }
                }
            }
        }
      }),
    [mode]
  );

  return [theme, colorMode];
};