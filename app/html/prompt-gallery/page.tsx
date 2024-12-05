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

const PromptGallery = () => {
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
                    className="w-full sidebar-btn"
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
                    className="w-full sidebar-btn active"
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
                    Prompt Gallery
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
            <div className="grow overflow-auto p-5 pb-12 lg:p-6 lg:pb-20 all-prompts">
              <div className="container">
                <div className="pt-8 md:pt-14 mb-16 md:mb-28 text-center">
                  <h2 className="text-4xl lg:text-7xl font-normal mb-8 heading-title">
                    Prompt gallery
                  </h2>
                  <p className="text-base lg:text-xl">
                    Explore prompt ideas for working with the latest Gemini
                    models.
                  </p>
                </div>
                <Box className="list-prompts">
                  <div className="flex flex-wrap gap-y-2 sm:gap-y-6 -mx-3">
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/audio-diarization.svg"
                              width={32}
                              height={32}
                              alt="Time complexity"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Audio Diarization
                            </p>
                            <p className="des">
                              Transcribe audio with speaker details and
                              timestamps.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/video-qa.svg"
                              width={32}
                              height={32}
                              alt="Video Q&A"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Video Q&A
                            </p>
                            <p className="des">
                              Ask questions about key details in a video.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/recipe-to-json.svg"
                              width={32}
                              height={32}
                              alt="Recipe to JSON"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              recipe-to-json.
                            </p>
                            <p className="des">
                              Create recipe in JSON mode using an image.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/json-schema.svg"
                              width={32}
                              height={32}
                              alt="Listing recipes using JSON schema"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Listing recipes using JSON schema
                            </p>
                            <p className="des">
                              Create JSON based on specified schema.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/math-tutor.svg"
                              width={32}
                              height={32}
                              alt="Math Tutor"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Math Tutor
                            </p>
                            <p className="des">
                              Teach me a lesson on quadratic equations.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/math-worksheet.svg"
                              width={32}
                              height={32}
                              alt="Math Worksheet Generator"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Math Worksheet Generator
                            </p>
                            <p className="des">
                              Create a set of elementary math worksheets for
                              math educators and parents.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/scavenger-hunt.svg"
                              width={32}
                              height={32}
                              alt="Scavenger Hunt"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Scavenger Hunt
                            </p>
                            <p className="des">
                              Create a curated list of scavenger hunt concepts.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/unit-testing.svg"
                              width={32}
                              height={32}
                              alt="Unit Testing"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Unit Testing
                            </p>
                            <p className="des">
                              Add unit tests for a Python function.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/geometry-problem-solving.svg"
                              width={32}
                              height={32}
                              alt="Geometry problem solving"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Geometry problem solving
                            </p>
                            <p className="des">Solve for X in an image.</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/trip-recommendations.svg"
                              width={32}
                              height={32}
                              alt="Trip recommendations"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Trip recommendations
                            </p>
                            <p className="des">
                              Convert unorganized text into structured tables.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/time-complexity.svg"
                              width={32}
                              height={32}
                              alt="Time complexity"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Time complexity
                            </p>
                            <p className="des">
                              Identify the time complexity of a function and
                              optimize it.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/opossum-search.svg"
                              width={32}
                              height={32}
                              alt="Opossum Search"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Opossum Search
                            </p>
                            <p className="des">
                              Create a webpage based on the user's
                              specifications.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/recipe-creator.svg"
                              width={32}
                              height={32}
                              alt="Recipe creator"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Recipe creator
                            </p>
                            <p className="des">
                              Generate a custom recipe from a photo of what you
                              want to eat.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/object-identifier.svg"
                              width={32}
                              height={32}
                              alt="Object identifier"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Object identifier
                            </p>
                            <p className="des">
                              Get a description of an object and its uses from a
                              photo.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/marketing-writer.svg"
                              width={32}
                              height={32}
                              alt="Marketing writer"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Marketing writer
                            </p>
                            <p className="des">
                              Get catchy advertising copy tailored to your
                              product and target audience.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/list-items-from-image.svg"
                              width={32}
                              height={32}
                              alt="List items from image"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              List items from image
                            </p>
                            <p className="des">
                              Get a list of objects in a photo.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/hurricane-charting.svg"
                              width={32}
                              height={32}
                              alt="Hurricane charting"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Hurricane charting
                            </p>
                            <p className="des">
                              Explore a major event from a single image
                              snapshot.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/blog-post-creator.svg"
                              width={32}
                              height={32}
                              alt="Blog post creator"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Blog post creator
                            </p>
                            <p className="des">
                              Generate a unique blog post from a single image.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/barista-bot.svg"
                              width={32}
                              height={32}
                              alt="Barista Bot"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Barista Bot
                            </p>
                            <p className="des">
                              Order common coffee drinks from this virtual
                              barista.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/ml-confusion-matrix.svg"
                              width={32}
                              height={32}
                              alt="ML confusion matrix"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              ML confusion matrix
                            </p>
                            <p className="des">
                              Get help generating a confusion matrix and metrics
                              for your classifier.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/sentiment-analysis.svg"
                              width={32}
                              height={32}
                              alt="Sentiment analysis"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Sentiment analysis
                            </p>
                            <p className="des">
                              Analyze the sentiment of text messages.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/research-assistant.svg"
                              width={32}
                              height={32}
                              alt="Research Assistant"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Research Assistant
                            </p>
                            <p className="des">
                              Understand the key attributes of the research
                              paper's methodology.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/which-shape.svg"
                              width={32}
                              height={32}
                              alt="Which shape comes next?"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Which shape comes next?
                            </p>
                            <p className="des">
                              Given a series of shapes, guess which shape comes
                              next.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/plant-care.svg"
                              width={32}
                              height={32}
                              alt="Plant care"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Plant care
                            </p>
                            <p className="des">
                              How do I best care for this plant.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/docker-script.svg"
                              width={32}
                              height={32}
                              alt="Docker Script"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Docker Script
                            </p>
                            <p className="des">
                              Writing a script in Docker to set up your
                              environment.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/santa-mailbox.svg"
                              width={32}
                              height={32}
                              alt="Santa's Mailbox"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Santa's Mailbox
                            </p>
                            <p className="des">
                              Capture a handwritten letter to Santa and write
                              back as him.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/brand-extractor.svg"
                              width={32}
                              height={32}
                              alt="Brand Extractor"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Brand Extractor
                            </p>
                            <p className="des">
                              Extract product and brand names from text.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/cook-helper.svg"
                              width={32}
                              height={32}
                              alt="Cook Helper"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Cook Helper
                            </p>
                            <p className="des">
                              Get recipe ideas based on an image of ingredients
                              you have on hand.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/game-character-brainstorm.svg"
                              width={32}
                              height={32}
                              alt="Game Character Brainstorm"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Game Character Brainstorm
                            </p>
                            <p className="des">
                              Create a character design based on a provided
                              context.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/modify-writing-style.svg"
                              width={32}
                              height={32}
                              alt="Modify writing style"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Modify writing style
                            </p>
                            <p className="des">
                              Change the tone and writing style of a blurb.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/regexed.svg"
                              width={32}
                              height={32}
                              alt="Regexed"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Regexed
                            </p>
                            <p className="des">
                              Convert natural language queries and constraints
                              to regex constructs.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-3 item">
                      <Link
                        className="w-full h-full"
                        href="/html/library/detail"
                      >
                        <div className="w-full h-full p-5 sm:p-8 flex gap-x-5 sm:gap-x-8 rounded-3xl border border-solid border-color cursor-pointer prompt-card">
                          <div className="w-8 flex-shrink-0 icon">
                            <Image
                              src="/images/icon/search-spark.svg"
                              width={32}
                              height={32}
                              alt="Eclipse Search Grounding"
                            />
                          </div>
                          <div className="caption">
                            <p className="text-sm sm:text-base font-medium mb-2 name">
                              Eclipse Search Grounding
                            </p>
                            <p className="des">
                              Use Search Grounding to identify the next eclipse.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
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
            <div className="mb-2 flex items-center justify-between rounded-full border border-token-border-medium bg-token-main-surface-primary p-1.5 text-token-text-secondary last:mb-2 sm:p-2">
              <div className="relative ml-1 flex-grow">
                <input
                  readOnly
                  className="w-full rounded-xl border-0 bg-token-main-surface-primary px-2 py-1 text-lg sm:py-2.5 text-token-text-tertiary"
                  type="text"
                  defaultValue="https://chatgpt.com/share/..."
                />
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-12 bg-gradient-to-l from-token-main-surface-primary" />
              </div>
              <button
                className="btn relative btn-primary ml-4 mr-0 mt-0 rounded-full px-4 py-1 text-base font-bold sm:py-3"
                type="button"
                data-testid="create-link-shared-chat-button"
              >
                <span className="flex w-full items-center justify-center gap-1.5">
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
                  Create link
                </span>
              </button>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default PromptGallery;
