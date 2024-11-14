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

const Connections = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Collapse Menu
  const [toggleSidebarLeft, setToggleSidebarLeft] = React.useState(true);
  const [toggleSidebarRight, setToggleSidebarRight] = React.useState(true);
  const handleClickSidebarLeft = () => {
    setToggleSidebarLeft(!toggleSidebarLeft);
  };
  const handleClickSidebarRight = () => {
    setToggleSidebarRight(!toggleSidebarRight);
  };
  const handleOutsideClickSideLeft = () => {
    setToggleSidebarLeft(true);
  };
  const handleOutsideClickSideRight = () => {
    setToggleSidebarRight(true);
  };
  const sideLeftRef = useOutsideClick(handleOutsideClickSideLeft);
  const sideRightRef = useOutsideClick(handleOutsideClickSideRight);
  const refNull = useRef(null);
  const viewPort = useViewport();
  const isMobile = typeof window !== "undefined" && viewPort.width <= 1100;

  // Popover
  const [popoverAccount, setPopoverAccount] = React.useState<CustomPopover>({
    anchorEl: null,
    child: <PopoverAccount />,
  });

  // Modal
  const [showModalNewConnection, setShowModalNewConnection] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  // Focus Input
  const inputNameRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalNewConnection) {
      inputNameRef.current?.focus();
    }
  }, [showModalNewConnection]);

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
            toggleSidebarLeft ? "expanded" : "compact"
          }`}
          id="sidebar-left"
        >
          <div
            onClick={() => setToggleSidebarLeft(true)}
            className="overlay-sidebar"
          ></div>
          <div
            className="w-full h-full flex flex-col justify-between inner"
            // ref={isMobile ? sideLeftRef : refNull}
          >
            <div className="h-16 flex-shrink-0 flex items-center nav-logo">
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
            <div className="w-full grow overflow-y-auto top-sidebar">
              <div className="py-6 overflow-hidden menus">
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
                <div className="sidebar-menu">
                  <Button
                    component="a"
                    variant="plain"
                    aria-label="Connections"
                    href="/html/connections"
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
                      <span className="material-symbols-outlined">share</span>
                    </span>
                    <span className="whitespace-nowrap opacity-transition font-medium leading-snug name">
                      Connections
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full pt-2 pb-4 border-t border-solid border-color bot-sidebar">
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
              <div className="mt-2 mb-3 profile">
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
              <div className="btn-click-menu">
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
                        background: "var(--cl-neutral-20)",
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
                  <div>
                    {toggleSidebarLeft ? (
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
                            bgcolor: "var(--cl-neutral-20)",
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
                            bgcolor: "var(--cl-neutral-20)",
                            color: "var(--cl-primary)",
                          },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </IconButton>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
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
            <div className="grow overflow-auto p-5 lg:p-6 all-posts">
              <div className="container">
                <Box className="list-posts">
                  <div className="sm:flex items-center justify-between mb-4 page-heading">
                    <h2 className="text-xl font-normal mb-3 sm:mb-0 heading-title">
                      All connections
                    </h2>
                    <div className="flex items-center gap-x-3">
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
                        title="New Connection"
                      >
                        <IconButton
                          variant="plain"
                          onClick={() => setShowModalNewConnection(true)}
                          sx={{
                            minWidth: "36px",
                            minHeight: "36px",
                            borderRadius: "100%",
                            color: "var(--cl-primary)",
                            "&:hover": {
                              background: "var(--bg-color)",
                              color: "var(--cl-primary)",
                            },
                          }}
                        >
                          <span className="material-symbols-outlined">
                            add_circle
                          </span>
                        </IconButton>
                      </Tooltip>
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
                    <table className="table-auto w-full data-table tbl-mb whitespace-nowrap tbl-library">
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
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="w-12 text-center">
                            <span className="material-symbols-outlined mt-1 connection-icon">
                              language
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium truncate tend"
                            >
                              Caready
                            </button>
                          </td>
                          <td></td>
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
                        <tr>
                          <td className="w-12 text-center">
                            <span className="material-symbols-outlined mt-1 connection-icon">
                              thumb_up
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium truncate tend"
                            >
                              Facebook Post
                            </button>
                          </td>
                          <td></td>
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
                        <tr>
                          <td className="w-12 text-center">
                            <span className="material-symbols-outlined mt-1 connection-icon">
                              language
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium truncate tend"
                            >
                              Soft.io
                            </button>
                          </td>
                          <td></td>
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
        open={showModalNewConnection}
        onClose={() => setShowModalNewConnection(false)}
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
            <span className="text-base font-medium">New Connection</span>
          </DialogTitle>
          <Divider />
          <DialogContent className="py-3" sx={{ color: "var(--cl-primary)" }}>
            <FormControl className="mb-4">
              <FormLabel
                className="form-label"
                sx={{ color: "var(--cl-primary)" }}
              >
                Name
              </FormLabel>
              <Input
                type="text"
                className="input"
                slotProps={{
                  input: {
                    ref: inputNameRef,
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
                Webhook
              </FormLabel>
              <Input
                type="text"
                className="input"
                // defaultValue="Untitled prompt"
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
              Delete
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setShowModalNewConnection(false)}
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
    </div>
  );
};

export default Connections;
