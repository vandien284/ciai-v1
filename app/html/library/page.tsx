"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { ArrowDropDownOutlined } from "@mui/icons-material";

import {
  Button,
  IconButton,
  Avatar,
  DialogTitle,
  DialogContent,
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
  DialogActions,
  FormControl,
  FormLabel,
  Input,
  Textarea,
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
import { Tooltip, Popover, TablePagination } from "@mui/material";

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

interface CustomPopover {
  anchorEl: null | HTMLElement;
  child: any;
}

function PopoverAccount() {
  return (
    <Card
      sx={{
        width: 260,
        maxWidth: "100%",
        borderRadius: "8px",
        bgcolor: "var(--cl-bg-dropdown)",
        borderColor: "var(--cl-neutral-20)",
      }}
    >
      <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
        <Avatar
          src="https://mui.com/static/images/avatar/3.jpg"
          sx={{ "--Avatar-size": "3rem" }}
        />
        <Typography
          level="title-md"
          className="mt-2"
          sx={{ color: "var(--cl-neutral-90)", lineHeight: 1.3 }}
        >
          Đào Lê
        </Typography>
        <Typography
          level="body-md"
          sx={{ color: "var(--cl-neutral-80)", lineHeight: 1.3 }}
        >
          dao.le@caready.vn
        </Typography>
      </CardContent>
      <CardOverflow>
        <CardActions
          sx={{
            pt: 0.25,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              px: 2,
              mx: "auto",
              maxWidth: "150px",
              minHeight: "36px",
              fontFamily: "var(--font)",
              fontWeight: 500,
              color: "var(--cl-primary-70)",
              borderRadius: "8px",
              borderColor: "var(--cl-neutral-30)",
              "&:hover": {
                background: "var(--cl-neutral-8)",
                borderColor: "var(--cl-primary-70)",
                color: "var(--cl-primary-70)",
              },
            }}
          >
            Sign out
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}

const Library = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Set full height in Iphone
  const [height, setHeight] = useState("100vh");
  useEffect(() => {
    const updateHeight = () => {
      setHeight(`${window.innerHeight}px`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Set ViewPort
  const viewPort = useViewport();
  const isMobile = typeof window !== "undefined" && viewPort.width < 768;
  const isTablet =
    typeof window !== "undefined" &&
    viewPort.width >= 767 &&
    viewPort.width < 1024;

  // Collapse Menu
  const [sidebarOpenLeft, setSidebarOpenLeft] = React.useState(() =>
    isTablet ? false : true
  );
  useEffect(() => {
    setSidebarOpenLeft(isTablet || isMobile ? false : true);
  }, [isTablet, isMobile]);

  console.log(sidebarOpenLeft);
  const [sidebarOpenRight, setSidebarOpenRight] = React.useState(() =>
    isMobile ? false : true
  );
  useEffect(() => {
    setSidebarOpenRight(isMobile ? false : true);
  }, [isMobile]);
  const handleClickSidebarLeft = () => {
    setSidebarOpenLeft(!sidebarOpenLeft);
  };
  const handleClickSidebarRight = () => {
    setSidebarOpenRight(!sidebarOpenRight);
  };
  const handleOutsideClickSideLeft = () => {
    setSidebarOpenLeft(true);
  };
  const handleOutsideClickSideRight = () => {
    setSidebarOpenRight(true);
  };
  const sideLeftRef = useOutsideClick(handleOutsideClickSideLeft);
  const sideRightRef = useOutsideClick(handleOutsideClickSideRight);
  const refNull = useRef(null);

  // Popover
  const [popoverAccount, setPopoverAccount] = React.useState<CustomPopover>({
    anchorEl: null,
    child: <PopoverAccount />,
  });

  // Modal
  const [showModalEditHeading, setShowModalEditHeading] = useState(false);
  const [showModalSharePrompt, setShowModalSharePrompt] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  // Focus Input
  const inputTitleRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalEditHeading) {
      inputTitleRef.current?.focus();
    }
  }, [showModalEditHeading]);

  // Search bar
  const [inputValue, setInputValue] = useState("");
  const handleInputSearchChange = (event: any) => {
    setInputValue(event.target.value);
  };

  // Pagination
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div id="app">
      <section className="flex h-full sec-main">
        <aside
          className={`flex-shrink-0 sidebar ${
            sidebarOpenLeft ? "expanded" : "compact"
          }`}
          id="sidebar-left"
        >
          {isMobile && (
            <div
              onClick={() => setSidebarOpenLeft(false)}
              className="overlay-sidebar"
            ></div>
          )}
          <div
            className="w-full h-full flex flex-col overflow-x-hidden overflow-y-auto justify-between inner"
            // ref={isMobile ? sideLeftRef : refNull}
          >
            <div className="h-16 flex-shrink-0 flex items-center sticky top-0 z-10 nav-logo">
              <a
                href="/html/home"
                className="flex flex-start cursor-pointer logo"
              >
                <Image
                  src="/images/favicon.png"
                  priority
                  alt="CIAI"
                  width={32}
                  height={31}
                  className="light-logo i1 hide-mb"
                />
                <Image
                  src="/images/logo.png"
                  priority
                  alt="CIAI"
                  width={80}
                  height={31}
                  className="light-logo i2"
                />
                <Image
                  src="/images/favicon-white.png"
                  priority
                  alt="CIAI"
                  width={32}
                  height={31}
                  className="dark-logo i1 hide-mb"
                />
                <Image
                  src="/images/logo-white.png"
                  priority
                  alt="CIAI"
                  width={80}
                  height={31}
                  className="dark-logo i2"
                />
              </a>
            </div>
            <div
              className="min-h-6 cursor-pointer clickable-space"
              onClick={handleClickSidebarLeft}
            ></div>
            <div className="top-sidebar">
              <div className="overflow-hidden menus">
                <div className="sidebar-menu">
                  <Button
                    component="a"
                    variant="plain"
                    aria-label="New Prompt"
                    href="/html/home"
                    sx={{
                      pl: 0,
                      pr: 1,
                      py: 0,
                      justifyContent: "flex-start",
                      fontFamily: "var(--font)",
                      color: "var(--cl-neutral-80)",
                      borderRadius: "20px",
                      "&.MuiButton-root:hover": {
                        background: "var(--cl-surface-container-lowest)",
                      },
                    }}
                    className="w-full sidebar-btn"
                  >
                    <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">
                        add_circle
                      </span>
                    </span>
                    <span className="whitespace-nowrap opacity-transition font-medium leading-snug name">
                      New Prompt
                    </span>
                  </Button>
                </div>
                <div className="sidebar-menu">
                  <Button
                    component="a"
                    variant="plain"
                    aria-label="My Library"
                    href="/html/library"
                    sx={{
                      pl: 0,
                      pr: 1,
                      py: 0,
                      justifyContent: "flex-start",
                      fontFamily: "var(--font)",
                      color: "var(--cl-neutral-80)",
                      borderRadius: "20px",
                      "&.MuiButton-root:hover": {
                        background: "var(--cl-surface-container-lowest)",
                      },
                    }}
                    className="w-full sidebar-btn active"
                  >
                    <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">
                        home_storage
                      </span>
                    </span>
                    <span className="whitespace-nowrap opacity-transition font-medium leading-snug name">
                      My Library
                    </span>
                  </Button>
                </div>
                <div className="pl-6 recent-post">
                  <div className="sidebar-menu">
                    <Button
                      component="a"
                      variant="plain"
                      aria-label="Croissant Recipe in JSON"
                      href="/html/library/detail"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        justifyContent: "flex-start",
                        fontFamily: "var(--font)",
                        color: "var(--cl-neutral-80)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "var(--cl-surface-container-lowest)",
                        },
                      }}
                      className="w-full sidebar-btn"
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Croissant Recipe in JSON
                      </span>
                      <div className="w-6 flex-shrink-0 ml-3 group-edit">
                        <Dropdown>
                          <Tooltip
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  maxWidth: "12rem",
                                  bgcolor:
                                    "var(--cl-surface-container-highest)",
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-neutral-80)",
                                },
                              },
                            }}
                            placement="top"
                            title="Options"
                          >
                            <MenuButton
                              className="flex items-center justify-center icon-click-menu"
                              sx={{
                                padding: 0,
                                background: "none!important",
                                border: "none",
                                borderRadius: "100%",
                                width: "24px",
                                minHeight: "24px",
                                color: "var(--cl-neutral-80)",
                              }}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"
                                ></path>
                              </svg>
                            </MenuButton>
                          </Tooltip>
                          <Menu
                            placement="bottom-start"
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                              onClick={() => setShowModalSharePrompt(true)}
                            >
                              <span className="material-symbols-outlined">
                                share
                              </span>
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                              onClick={() => setShowModalEditHeading(true)}
                            >
                              <span className="material-symbols-outlined">
                                edit
                              </span>
                              Rename
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                            >
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                              Delete
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </div>
                    </Button>
                  </div>
                  <div className="sidebar-menu">
                    <Button
                      component="a"
                      variant="plain"
                      aria-label="Croissant Recipe: JSON Format"
                      href="/html/library/detail"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        justifyContent: "flex-start",
                        fontFamily: "var(--font)",
                        color: "var(--cl-neutral-80)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "var(--cl-surface-container-lowest)",
                        },
                      }}
                      className="w-full sidebar-btn"
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Croissant Recipe: JSON Format
                      </span>
                      <div className="w-6 flex-shrink-0 ml-3 group-edit">
                        <Dropdown>
                          <Tooltip
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  maxWidth: "12rem",
                                  bgcolor:
                                    "var(--cl-surface-container-highest)",
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-neutral-80)",
                                },
                              },
                            }}
                            placement="top"
                            title="Options"
                          >
                            <MenuButton
                              className="flex items-center justify-center icon-click-menu"
                              sx={{
                                padding: 0,
                                background: "none!important",
                                border: "none",
                                borderRadius: "100%",
                                width: "24px",
                                minHeight: "24px",
                                color: "var(--cl-neutral-80)",
                              }}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"
                                ></path>
                              </svg>
                            </MenuButton>
                          </Tooltip>
                          <Menu
                            placement="bottom-start"
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                              onClick={() => setShowModalSharePrompt(true)}
                            >
                              <span className="material-symbols-outlined">
                                share
                              </span>
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                              onClick={() => setShowModalEditHeading(true)}
                            >
                              <span className="material-symbols-outlined">
                                edit
                              </span>
                              Rename
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                            >
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                              Delete
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </div>
                    </Button>
                  </div>
                  <div className="sidebar-menu">
                    <Button
                      component="a"
                      variant="plain"
                      aria-label="Write an article about include relevant statistics
                            (add the links of the sources you use) and consider
                            diverse perspectives"
                      href="/html/library/detail"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        justifyContent: "flex-start",
                        fontFamily: "var(--font)",
                        color: "var(--cl-neutral-80)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "var(--cl-surface-container-lowest)",
                        },
                      }}
                      className="w-full sidebar-btn"
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Write an article about include relevant statistics (add
                        the links of the sources you use) and consider diverse
                        perspectives
                      </span>
                      <div className="w-6 flex-shrink-0 ml-3 group-edit">
                        <Dropdown>
                          <Tooltip
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  maxWidth: "12rem",
                                  bgcolor:
                                    "var(--cl-surface-container-highest)",
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-neutral-80)",
                                },
                              },
                            }}
                            placement="top"
                            title="Options"
                          >
                            <MenuButton
                              className="flex items-center justify-center icon-click-menu"
                              sx={{
                                padding: 0,
                                background: "none!important",
                                border: "none",
                                borderRadius: "100%",
                                width: "24px",
                                minHeight: "24px",
                                color: "var(--cl-neutral-80)",
                              }}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"
                                ></path>
                              </svg>
                            </MenuButton>
                          </Tooltip>
                          <Menu
                            placement="bottom-start"
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                              onClick={() => setShowModalSharePrompt(true)}
                            >
                              <span className="material-symbols-outlined">
                                share
                              </span>
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                              onClick={() => setShowModalEditHeading(true)}
                            >
                              <span className="material-symbols-outlined">
                                edit
                              </span>
                              Rename
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
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
                                },
                              }}
                            >
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                              Delete
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </div>
                    </Button>
                  </div>
                  <div className="sidebar-menu">
                    <Button
                      component="a"
                      variant="plain"
                      aria-label="View more"
                      href="/html/library"
                      sx={{
                        pl: 1.25,
                        pr: 1,
                        py: 0,
                        justifyContent: "flex-start",
                        fontFamily: "var(--font)",
                        color: "var(--cl-neutral-80)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "var(--cl-surface-container-lowest)",
                        },
                      }}
                      className="w-full sidebar-btn"
                    >
                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name more">
                        View all
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="sidebar-menu">
                  <Button
                    component="a"
                    variant="plain"
                    aria-label="Prompt Gallery"
                    href="/html/prompt-gallery"
                    sx={{
                      pl: 0,
                      pr: 1,
                      py: 0,
                      justifyContent: "flex-start",
                      fontFamily: "var(--font)",
                      color: "var(--cl-neutral-80)",
                      borderRadius: "20px",
                      "&.MuiButton-root:hover": {
                        background: "var(--cl-surface-container-lowest)",
                      },
                    }}
                    className="w-full sidebar-btn"
                  >
                    <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">book_2</span>
                    </span>
                    <span className="whitespace-nowrap opacity-transition font-medium leading-snug name">
                      Prompt Gallery
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="grow cursor-pointer clickable-space"
              onClick={handleClickSidebarLeft}
            ></div>
            <div className="pt-2 mt-2 border-t border-solid border-color bot-sidebar">
              <div className="sidebar-menu">
                <Button
                  component="a"
                  variant="plain"
                  aria-label="Settings"
                  href="/html/settings"
                  sx={{
                    pl: 0,
                    pr: 1,
                    py: 0,
                    justifyContent: "flex-start",
                    fontFamily: "var(--font)",
                    color: "var(--cl-neutral-80)",
                    borderRadius: "20px",
                    "&.MuiButton-root:hover": {
                      background: "var(--cl-surface-container-lowest)",
                    },
                  }}
                  className="w-full sidebar-btn"
                >
                  <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">settings</span>
                  </span>
                  <span className="whitespace-nowrap opacity-transition font-medium leading-snug name">
                    Settings
                  </span>
                </Button>
              </div>
              <div className="my-2 profile">
                <button
                  type="button"
                  className="flex items-center info-account"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                    setPopoverAccount({
                      ...popoverAccount,
                      anchorEl: event.currentTarget,
                    })
                  }
                  aria-describedby="descriptionPopover"
                  aria-haspopup="true"
                >
                  <Avatar
                    alt="Avatar"
                    src="https://mui.com/static/images/avatar/3.jpg"
                    sx={{ "--Avatar-size": "2.25rem" }}
                  />
                  <p className="whitespace-nowrap opacity-transition pl-2 name">
                    daole.ci1985@gmail.com
                  </p>
                </button>
                <Popover
                  id="descriptionPopover"
                  open={Boolean(popoverAccount.anchorEl)}
                  onClose={() =>
                    setPopoverAccount({ ...popoverAccount, anchorEl: null })
                  }
                  anchorEl={popoverAccount.anchorEl}
                  disableRestoreFocus
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: "8px",
                      bgcolor: "var(--cl-bg-dropdown)",
                    },
                  }}
                >
                  {popoverAccount.child}
                </Popover>
              </div>
            </div>
            <div className="sticky bottom-0 z-10 pb-4 btn-click-menu">
              <div className="py-1">
                {isMobile && (
                  <IconButton
                    variant="plain"
                    onClick={handleClickSidebarLeft}
                    className="w-8 h-8 flex items-center justify-center transition"
                    sx={{
                      borderRadius: "9999px",
                      minWidth: "32px",
                      minHeight: "32px",
                      color: "var(--cl-primary)",
                      "&.MuiIconButton-root:hover": {
                        background: "var(--cl-toggle)",
                        color: "var(--cl-primary)",
                      },
                    }}
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </IconButton>
                )}
                {!isMobile && (
                  <>
                    {sidebarOpenLeft ? (
                      <IconButton
                        variant="plain"
                        onClick={handleClickSidebarLeft}
                        className="w-8 h-8 flex items-center justify-center transition"
                        sx={{
                          borderRadius: "9999px",
                          minWidth: "32px",
                          minHeight: "32px",
                          color: "var(--cl-primary)",
                          "&.MuiIconButton-root:hover": {
                            background: "var(--cl-toggle)",
                            color: "var(--cl-primary)",
                          },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          chevron_left
                        </span>
                      </IconButton>
                    ) : (
                      <IconButton
                        variant="plain"
                        onClick={handleClickSidebarLeft}
                        className="w-8 h-8 flex items-center justify-center transition"
                        sx={{
                          borderRadius: "9999px",
                          minWidth: "32px",
                          minHeight: "32px",
                          color: "var(--cl-primary)",
                          "&.MuiIconButton-root:hover": {
                            background: "var(--cl-toggle)",
                            color: "var(--cl-primary)",
                          },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </IconButton>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>
        <div className="grow flex flex-col h-full overflow-hidden">
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
                    My library
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
                          bgcolor: "var(--cl-surface-container-highest)",
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
            <div className="grow overflow-auto p-5 lg:p-6 all-posts">
              <div className="container">
                <Box className="list-posts">
                  <div className="sm:flex items-center justify-between mb-4 page-heading">
                    <h2 className="text-xl font-normal mb-3 sm:mb-0 heading-title">
                      All files
                    </h2>
                    <div className="sm:flex items-center gap-x-3">
                      <div className="hidden sm:block">
                        <Button
                          component="a"
                          variant="plain"
                          aria-label="Drive Folder"
                          sx={{
                            px: 1,
                            fontFamily: "var(--font)",
                            fontWeight: 400,
                            color: "var(--cl-primary)",
                            lineHeight: "24px",
                            borderRadius: "8px",
                            "&:hover": {
                              background: "var(--bg-color)",
                            },
                          }}
                          className="gap-x-1.5 transition font-medium"
                        >
                          <span className="material-symbols-outlined">
                            add_to_drive
                          </span>
                          <span className="hidden md:inline-block">
                            Drive Folder
                          </span>
                        </Button>
                      </div>
                      <div
                        role="search"
                        className="h-9 flex items-center rounded-lg px-3 search-bar"
                      >
                        <span className="material-symbols-outlined">
                          search
                        </span>
                        <input
                          placeholder="Search"
                          aria-label="Search field for prompts"
                          className="grow w-44 bg-transparent search-bar-input"
                          onChange={(e) => handleInputSearchChange(e)}
                        />
                        <div className={`${inputValue ? "" : "opacity-0"}`}>
                          <IconButton
                            variant="plain"
                            aria-label="Click to clear search query"
                            className="close-button"
                            sx={{
                              minWidth: "28px",
                              minHeight: "28px",
                              borderRadius: "100%",
                              "&:hover": {
                                background: "var(--bg-color)",
                              },
                            }}
                          >
                            <span className="material-symbols-outlined">
                              close
                            </span>
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-auto">
                    <table className="table-auto w-full data-table tbl-mb tbl-library">
                      <thead>
                        <tr>
                          <th></th>
                          <th>
                            <div className="flex items-center">
                              <span className="font-medium">Name</span>
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-60)",
                                  "&:hover": {
                                    background: "var(--bg-color)",
                                    color: "var(--cl-neutral-60)",
                                  },
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition ml-2 icon-sort"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_upward
                                </span>
                                {/* <span className="material-symbols-outlined">
                                  arrow_downward
                                </span> */}
                              </IconButton>
                            </div>
                          </th>
                          <th>
                            <div className="flex items-center">
                              <span className="font-medium">Description</span>
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-60)",
                                  "&:hover": {
                                    background: "var(--bg-color)",
                                    color: "var(--cl-neutral-60)",
                                  },
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition ml-2 icon-sort"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_upward
                                </span>
                                {/* <span className="material-symbols-outlined">
                                  arrow_downward
                                </span> */}
                              </IconButton>
                            </div>
                          </th>
                          <th>
                            <div className="flex items-center">
                              <span className="font-medium">Type</span>
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-60)",
                                  "&:hover": {
                                    background: "var(--bg-color)",
                                    color: "var(--cl-neutral-60)",
                                  },
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition ml-2 icon-sort"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_upward
                                </span>
                                {/* <span className="material-symbols-outlined">
                                  arrow_downward
                                </span> */}
                              </IconButton>
                            </div>
                          </th>
                          <th>
                            <div className="flex items-center">
                              <span className="font-medium">Updated</span>
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-60)",
                                  "&:hover": {
                                    background: "var(--bg-color)",
                                    color: "var(--cl-neutral-60)",
                                  },
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition ml-2 icon-sort"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_upward
                                </span>
                                {/* <span className="material-symbols-outlined">
                                  arrow_downward
                                </span> */}
                              </IconButton>
                            </div>
                          </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="cursor-pointer"
                          onClick={() => router.push("/html/library/detail")}
                        >
                          <td className="w-12 text-center">
                            <span className="material-symbols-outlined mt-1 prompt-icon">
                              chat_bubble
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium truncate tend"
                            >
                              Microfinance in Hyderabad
                            </button>
                          </td>
                          <td></td>
                          <td className="whitespace-nowrap">Chat prompt</td>
                          <td>1 hour ago</td>
                          <td className="actions">
                            <Dropdown>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <span className="material-symbols-outlined">
                                  more_vert
                                </span>
                              </MenuButton>
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
                                      background:
                                        "var(--cl-item-dropdown) !important",
                                      color: "var(--cl-primary) !important",
                                    },
                                  }}
                                  onClick={(e) => {
                                    setShowModalDelete(true);
                                    e.stopPropagation();
                                  }}
                                >
                                  <span className="material-symbols-outlined">
                                    delete
                                  </span>
                                  Delete prompt
                                </MenuItem>
                              </Menu>
                            </Dropdown>
                          </td>
                        </tr>
                        <tr
                          className="cursor-pointer"
                          onClick={() => router.push("/html/library/detail")}
                        >
                          <td className="w-12 text-center">
                            <span className="material-symbols-outlined mt-1 prompt-icon">
                              draft
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium truncate tend"
                            >
                              Bubble Sort Optimization
                            </button>
                          </td>
                          <td></td>
                          <td className="whitespace-nowrap">Model</td>
                          <td>1 hour ago</td>
                          <td className="actions">
                            <Dropdown>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <span className="material-symbols-outlined">
                                  more_vert
                                </span>
                              </MenuButton>
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
                                      background:
                                        "var(--cl-item-dropdown) !important",
                                      color: "var(--cl-primary) !important",
                                    },
                                  }}
                                  onClick={(e) => {
                                    setShowModalDelete(true);
                                    e.stopPropagation();
                                  }}
                                >
                                  <span className="material-symbols-outlined">
                                    delete
                                  </span>
                                  Delete prompt
                                </MenuItem>
                              </Menu>
                            </Dropdown>
                          </td>
                        </tr>
                        <tr
                          className="cursor-pointer"
                          onClick={() => router.push("/html/library/detail")}
                        >
                          <td className="w-12 text-center">
                            <span className="material-symbols-outlined mt-1 prompt-icon">
                              chat_bubble
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium truncate tend"
                            >
                              Microfinance in Hyderabad
                            </button>
                          </td>
                          <td></td>
                          <td className="whitespace-nowrap">Chat prompt</td>
                          <td>1 hour ago</td>
                          <td className="actions">
                            <Dropdown>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <span className="material-symbols-outlined">
                                  more_vert
                                </span>
                              </MenuButton>
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
                                      background:
                                        "var(--cl-item-dropdown) !important",
                                      color: "var(--cl-primary) !important",
                                    },
                                  }}
                                  onClick={(e) => {
                                    setShowModalDelete(true);
                                    e.stopPropagation();
                                  }}
                                >
                                  <span className="material-symbols-outlined">
                                    delete
                                  </span>
                                  Delete prompt
                                </MenuItem>
                              </Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-start flex-shrink-0 pt-6">
                    <TablePagination
                      component="div"
                      className="navi-pagi"
                      count={100}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        color: "var(--cl-primary)",
                        "& .MuiToolbar-root": {
                          pl: 0,
                        },
                        "& .MuiTablePagination-toolbar": {
                          minHeight: 36,
                          "& .MuiTablePagination-actions": {
                            ml: 1,
                            "&>button": {
                              p: 0.5,
                            },
                          },
                        },
                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                          {
                            fontSize: "0.75rem",
                          },
                        "& .MuiTablePagination-input": {
                          ml: 1,
                          mr: 2,
                          bgcolor: "var(--cl-item-dropdown)",
                          borderRadius: "3px",
                          border: "1px solid var(--cl-neutral-30)",
                          fontSize: "0.75rem",
                          color: "var(--cl-primary)",
                        },
                        "& .MuiSvgIcon-root": {
                          fill: "var(--cl-primary)",
                        },
                        "& .MuiIconButton-root:hover": {
                          bgcolor: "var(--cl-item-dropdown)",
                        },
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              bgcolor: "var(--cl-bg-dropdown)",
                              color: "var(--cl-primary)",
                              "& .MuiMenuItem-root": {
                                fontSize: "0.75rem",
                                minHeight: 32,
                                "&.Mui-selected, &.Mui-selected:hover": {
                                  bgcolor: "var(--cl-item-dropdown)!important",
                                },
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </Box>
              </div>
            </div>
          </main>
        </div>
      </section>
      <Modal
        open={showModalEditHeading}
        onClose={() => setShowModalEditHeading(false)}
      >
        <ModalDialog
          variant="outlined"
          className="modal-dialog"
          sx={{
            "&.MuiModalDialog-root": {
              width: "94%",
              borderRadius: "20px",
              maxWidth: "480px",
              fontFamily: "var(--font)",
              fontSize: "0.875rem",
              bgcolor: "var(--cl-bg-dropdown)",
              borderColor: "var(--cl-surface-container-low)",
            },
          }}
        >
          <ModalClose
            sx={{
              top: 14,
              right: 16,
              zIndex: 3,
              "&:hover": {
                bgcolor: "var(--cl-item-dropdown)",
                color: "var(--cl-primary)",
              },
            }}
            className="modal-close"
          />
          <DialogTitle sx={{ color: "var(--cl-primary)" }}>
            <span className="text-base font-medium">Save prompt</span>
          </DialogTitle>
          <Divider />
          <DialogContent className="py-3">
            <FormControl className="mb-4">
              <FormLabel
                className="form-label"
                sx={{ color: "var(--cl-primary)" }}
              >
                Prompt name
              </FormLabel>
              <Input
                type="text"
                className="input"
                defaultValue="Untitled prompt"
                slotProps={{
                  input: {
                    ref: inputTitleRef,
                    autoFocus: true,
                  },
                }}
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel
                className="form-label"
                sx={{ color: "var(--cl-primary)" }}
              >
                Description
              </FormLabel>
              <Textarea
                placeholder="optional"
                minRows={3}
                className="input"
                sx={{
                  "& .MuiTextarea-textarea": {
                    maxHeight: "80px",
                    overflow: "auto!important",
                  },
                }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              sx={{
                px: 3,
                bgcolor: "var(--cl-primary-70)",
                color: "var(--cl-neutral-10)",
                borderRadius: "8px",
                fontWeight: 400,
                "&:hover": {
                  bgcolor: "var(--cl-primary-80)",
                  color: "var(--cl-neutral-10)",
                },
              }}
            >
              Save
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setShowModalEditHeading(false)}
              sx={{
                borderRadius: "8px",
                fontWeight: 400,
                color: "var(--cl-neutral-90)",
                "&:hover": {
                  bgcolor: "var(--cl-item-dropdown)",
                  color: "var(--cl-neutral-90)",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal open={showModalDelete} onClose={() => setShowModalDelete(false)}>
        <ModalDialog
          variant="outlined"
          className="modal-dialog"
          sx={{
            "&.MuiModalDialog-root": {
              width: "94%",
              borderRadius: "20px",
              maxWidth: "480px",
              fontFamily: "var(--font)",
              fontSize: "0.875rem",
              bgcolor: "var(--cl-bg-dropdown)",
              borderColor: "var(--cl-surface-container-low)",
            },
          }}
        >
          <ModalClose
            sx={{
              top: 14,
              right: 16,
              zIndex: 3,
              "&:hover": {
                bgcolor: "var(--cl-item-dropdown)",
                color: "var(--cl-primary)",
              },
            }}
            className="modal-close"
          />
          <DialogTitle sx={{ color: "var(--cl-primary)" }}>
            <span className="text-base font-medium">Delete prompt</span>
          </DialogTitle>
          <Divider />
          <DialogContent className="py-3" sx={{ color: "var(--cl-primary)" }}>
            <p className="text-md font-medium">Are you sure?</p>
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              sx={{
                px: 3,
                bgcolor: "var(--cl-primary-70)",
                color: "var(--cl-neutral-10)",
                borderRadius: "8px",
                fontWeight: 400,
                "&:hover": {
                  bgcolor: "var(--cl-primary-80)",
                  color: "var(--cl-neutral-10)",
                },
              }}
            >
              Delete
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setShowModalDelete(false)}
              sx={{
                borderRadius: "8px",
                fontWeight: 400,
                color: "var(--cl-neutral-90)",
                "&:hover": {
                  bgcolor: "var(--cl-item-dropdown)",
                  color: "var(--cl-neutral-90)",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal
        open={showModalSharePrompt}
        onClose={() => setShowModalSharePrompt(false)}
      >
        <ModalDialog
          variant="outlined"
          className="modal-dialog"
          sx={{
            "&.MuiModalDialog-root": {
              width: "94%",
              borderRadius: "20px",
              maxWidth: "550px",
              fontFamily: "var(--font)",
              fontSize: "0.875rem",
              bgcolor: "var(--cl-bg-dropdown)",
              borderColor: "var(--cl-surface-container-low)",
            },
          }}
        >
          <ModalClose
            sx={{
              top: 14,
              right: 16,
              zIndex: 3,
              "&:hover": {
                bgcolor: "var(--cl-item-dropdown)",
                color: "var(--cl-primary)",
              },
            }}
            className="modal-close"
          />
          <DialogTitle sx={{ color: "var(--cl-primary)" }}>
            <span className="text-base font-medium">
              Share public link to chat
            </span>
          </DialogTitle>
          <Divider />
          <DialogContent className="py-3" sx={{ color: "var(--cl-primary)" }}>
            <p className="mb-6">
              Your name, custom instructions, and any messages you add after
              sharing stay private.
            </p>
            <div className="mb-2 flex items-center justify-between rounded-lg border border-solid border-color p-1.5 last:mb-2 sm:p-2">
              <div className="relative ml-1 flex-grow">
                <input
                  readOnly
                  className="w-full bg-transparent border-0 px-2 py-2 text-base focus-visible:outline-none focus-visible:ring-0"
                  type="text"
                  defaultValue="https://ai.ci.com.vn/share/67404e1a-3b84-8001-a87d-51528675103d"
                />
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-12 bg-gradient-to-l from-transparent" />
              </div>
              <Button
                aria-label="Create link shared chat button"
                variant="solid"
                sx={{
                  minHeight: 40,
                  bgcolor: "var(--cl-primary-70)",
                  color: "var(--cl-neutral-10)",
                  borderRadius: "8px",
                  fontWeight: 400,
                  "&:hover": {
                    bgcolor: "var(--cl-primary-80)",
                    color: "var(--cl-neutral-10)",
                  },
                }}
              >
                <span className="flex w-full items-center justify-center gap-x-2 whitespace-nowrap">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.2929 5.70711C16.4743 3.88849 13.5257 3.88849 11.7071 5.7071L10.7071 6.70711C10.3166 7.09763 9.68341 7.09763 9.29289 6.70711C8.90236 6.31658 8.90236 5.68342 9.29289 5.29289L10.2929 4.29289C12.8926 1.69323 17.1074 1.69323 19.7071 4.29289C22.3068 6.89256 22.3068 11.1074 19.7071 13.7071L18.7071 14.7071C18.3166 15.0976 17.6834 15.0976 17.2929 14.7071C16.9024 14.3166 16.9024 13.6834 17.2929 13.2929L18.2929 12.2929C20.1115 10.4743 20.1115 7.52572 18.2929 5.70711ZM15.7071 8.29289C16.0976 8.68342 16.0976 9.31658 15.7071 9.70711L9.7071 15.7071C9.31658 16.0976 8.68341 16.0976 8.29289 15.7071C7.90236 15.3166 7.90236 14.6834 8.29289 14.2929L14.2929 8.29289C14.6834 7.90237 15.3166 7.90237 15.7071 8.29289ZM6.7071 9.29289C7.09763 9.68342 7.09763 10.3166 6.7071 10.7071L5.7071 11.7071C3.88849 13.5257 3.88849 16.4743 5.7071 18.2929C7.52572 20.1115 10.4743 20.1115 12.2929 18.2929L13.2929 17.2929C13.6834 16.9024 14.3166 16.9024 14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071L13.7071 19.7071C11.1074 22.3068 6.89255 22.3068 4.29289 19.7071C1.69322 17.1074 1.69322 12.8926 4.29289 10.2929L5.29289 9.29289C5.68341 8.90237 6.31658 8.90237 6.7071 9.29289Z"
                      fill="currentColor"
                    />
                  </svg>
                  Copy link
                </span>
              </Button>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default Library;
