"use client";
import React, { useState, useEffect, useRef,useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ThemeSwitcher } from "@/app/components/theme-switcher";
import {
  Button,
  ButtonGroup,
  IconButton,
  Avatar,
  Box,
  Dropdown,
  Menu,
  MenuItem,
  MenuButton,
  Card,
  CardContent,
  CardOverflow,
  CardActions,
  Typography,
} from "@mui/joy";
import { Switch, styled, Tooltip } from "@mui/material";
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  "&.MuiSwitch-root": {
    width: "64px",
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "var(--cl-neutral-80)",
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"  fill="white"><path d="M19,13H5V11H19V13Z"/></svg>') center no-repeat`,
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: "var(--cl-neutral-30)",
    opacity: 1,
  },
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      transform: "translateX(24px)",
      "& .MuiSwitch-thumb": {
        backgroundColor: "var(--cl-primary-30)",
        "&::before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="white"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        },
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "var(--cl-primary-70)",
      },
    },
  },
}));


import { useOutsideClick } from "outsideclick-react";

const useViewport = () => {
  const [width, setWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  React.useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width };
};

const Settings = () => {
  const router = useRouter();
  // Collapse Menu
  const [toggleSidebarLeft, setToggleSidebarLeft] = React.useState(true);
  const handleClickSidebarLeft = () => {
    setToggleSidebarLeft(!toggleSidebarLeft);
  };
  const handleOutsideClick = () => {
    setToggleSidebarLeft(true);
  };
  const viewPort = useViewport();
  const isMobile = typeof window !== "undefined" && viewPort.width <= 1100;


  const [activeTheme, setActiveTheme] = React.useState(true);
  const handleClickTheme = (activeTheme: any) => {
    setActiveTheme(!activeTheme);
  };

  const hasFetched = useRef(false);
  const [messages, setMessages] = useState(Array<any>);
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:1337/api/messages?sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=10`
      );
      setMessages(response.data.data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchMessages();
      hasFetched.current = true;
    }
  }, [fetchMessages]);

  return (
    <div id="app">
      <section className="flex h-full sec-main">
        <Header page="settings" data={messages} toggleSidebarLeft={toggleSidebarLeft} setToggleSidebarLeft={setToggleSidebarLeft}></Header>
        <div className="grow flex flex-col h-screen overflow-hidden">
          <nav className="w-full h-16 relative z-50">
            <div className="h-full px-3 lg:px-6 py-3 flex items-center justify-between gap-x-3 border-b border-solid bar">
              <div className="flex items-center gap-x-2 overflow-hidden bar-left">
                {isMobile && (
                  <div className="btn-click-menu">
                    <IconButton
                      variant="plain"
                      onClick={handleClickSidebarLeft}
                      sx={{
                        mr: 0.5,
                        minWidth: "40px",
                        minHeight: "40px",
                        borderRadius: "100%",
                        color: "var(--cl-primary)",
                        "&:hover": {
                          background: "var(--bg-color)",
                          color: "var(--cl-primary)",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">menu</span>
                    </IconButton>
                  </div>
                )}
                <div className="sm:flex sm:items-center gap-x-2 overflow-hidden">
                  <h1 className="text-2xl font-normal truncate heading-title">
                    Settings
                  </h1>
                </div>
              </div>
              <div className="bar-right">
                <Dropdown>
                  <Tooltip
                    componentsProps={{
                      tooltip: {
                        sx: {
                          maxWidth: "12rem",
                          bgcolor: "var(--cl-neutral-8)",
                          fontFamily: "var(--font)",
                          color: "var(--cl-neutral-80)",
                        },
                      },
                    }}
                    placement="left"
                    title="Open menu options"
                  >
                    <MenuButton
                      className="flex items-center justify-center w-10 h-10"
                      sx={{
                        p: 0,
                        border: "none",
                        borderRadius: "100%",
                        minHeight: "40px",
                        color: "var(--cl-primary)",
                        "&:hover": {
                          background: "var(--bg-color)",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </MenuButton>
                  </Tooltip>
                  <Menu
                    placement="bottom-end"
                    className="dropdown-menu"
                    sx={{
                      py: 0,
                      bgcolor: "var(--cl-bg-dropdown)",
                      borderColor: "var(--cl-neutral-8)",
                    }}
                  >
                    <MenuItem
                      className="flex"
                      sx={{
                        background: "none",
                        p: 1.25,
                        minHeight: "auto",
                        fontSize: 15,
                        gap: 1.25,
                        color: "var(--cl-primary)",
                        "&:hover": {
                          background: "var(--cl-item-dropdown) !important",
                          color: "var(--cl-primary) !important",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">save</span>
                      Save
                    </MenuItem>
                    <MenuItem
                      className="flex"
                      sx={{
                        background: "none",
                        p: 1.25,
                        minHeight: "auto",
                        fontSize: 15,
                        gap: 1.25,
                        color: "var(--cl-primary)",
                        "&:hover": {
                          background: "var(--cl-item-dropdown) !important",
                          color: "var(--cl-primary) !important",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">share</span>
                      Share
                    </MenuItem>
                    <MenuItem
                      className="flex"
                      sx={{
                        background: "none",
                        p: 1.25,
                        minHeight: "auto",
                        fontSize: 15,
                        gap: 1.25,
                        color: "var(--cl-primary)",
                        "&:hover": {
                          background: "var(--cl-item-dropdown) !important",
                          color: "var(--cl-primary) !important",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">
                        assignment
                      </span>
                      Terms of service
                    </MenuItem>
                    <MenuItem
                      className="flex"
                      sx={{
                        background: "none",
                        p: 1.25,
                        minHeight: "auto",
                        fontSize: 15,
                        gap: 1.25,
                        color: "var(--cl-primary)",
                        "&:hover": {
                          background: "var(--cl-item-dropdown) !important",
                          color: "var(--cl-primary) !important",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">
                        shield_person
                      </span>
                      Privacy policy
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </div>
            </div>
          </nav>
          <main className="w-full grow flex" id="main-content">
            <div className="grow overflow-auto p-5 lg:p-6 settings">
              <div className="container">
                <Box className="theme-options">
                  <h2 className="text-base font-medium my-6">
                    General app settings
                  </h2>
                  <div className="flex items-center max-w-sm pl-3 choose-theme">
                    <p className="mr-6 md:mr-16">Theme</p>
                    <ThemeSwitcher />
                  </div>
                  <h2 className="text-base font-medium my-6">Save Settings</h2>
                  <div className="pl-3">
                    <p className="mb-3">Autosaving Enabled</p>
                    <div className="-ml-3">
                      <MaterialUISwitch
                        defaultChecked
                        inputProps={{ "aria-label": "Autosaving Enabled" }}
                      />
                    </div>
                  </div>
                </Box>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default Settings;
