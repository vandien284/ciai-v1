"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/joy";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Box
      className="flex items-center overflow-hidden"
      sx={{
        border: "1px solid var(--cl-neutral-20)",
        borderRadius: "4px",
      }}
    >
      <Button
        onClick={toggleTheme}
        sx={{
          bgcolor: "var(--bg-body)",
          borderRadius: 0,
          fontFamily: "var(--font)",
          color: "var(--cl-primary)",
          "&:hover": {
            background: "none",
          },
        }}
        className={`${theme === "light" ? "active pointer-events-none" : ""}`}
      >
        <span className="flex leading-9">
          {theme === "light" ? (
            <span className="mr-2 flex items-center icon-wrap">
              <span className="material-symbols-outlined">light_mode</span>
            </span>
          ) : (
            ""
          )}
          <span className="text-sm font-medium">Light</span>
        </span>
      </Button>
      <Button
        onClick={toggleTheme}
        sx={{
          bgcolor: "var(--bg-body)",
          borderRadius: 0,
          borderLeft: "1px solid var(--cl-neutral-20)",
          fontFamily: "var(--font)",
          color: "var(--cl-primary)",
          "&:hover": {
            background: "none",
          },
        }}
        className={`${theme === "dark" ? "active pointer-events-none" : ""}`}
      >
        <span className="flex leading-9">
          {theme === "light" ? (
            ""
          ) : (
            <span className="mr-2 flex items-center icon-wrap">
              <span className="material-symbols-outlined">dark_mode</span>
            </span>
          )}

          <span className="text-sm font-medium">Dark</span>
        </span>
      </Button>
    </Box>
  );
}
