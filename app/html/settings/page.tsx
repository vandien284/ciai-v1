"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";

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
import { Switch, styled, Tooltip, Popover } from "@mui/material";
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

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
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
  const [showModalEditHeading, setShowModalEditHeading] = useState(false);

  // Focus Input
  const inputTitleRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalEditHeading) {
      inputTitleRef.current?.focus();
    }
  }, [showModalEditHeading]);

  return (
    <div id="app">
      <section className="flex h-full sec-main">
        <aside
          className={`h-screen flex-shrink-0 sidebar ${
            toggleSidebarLeft ? "expanded" : "compact"
          }`}
          id="sidebar-left"
        >
          <div
            className="w-full h-full flex flex-col justify-between inner"
            ref={isMobile ? sideLeftRef : refNull}
          >
            <div className="h-16 flex-shrink-0 flex items-center nav-logo">
              <a
                href="/html/home"
                className="flex flex-start cursor-pointer logo"
              >
                {theme === "light" ? (
                  <>
                    <Image
                      src="/images/favicon.png"
                      priority
                      alt="CIAI"
                      width={32}
                      height={31}
                      className="i1 hide-mb"
                    />
                    <Image
                      src="/images/logo.png"
                      priority
                      alt="CIAI"
                      width={80}
                      height={31}
                      className="i2"
                    />
                  </>
                ) : (
                  <>
                    <Image
                      src="/images/favicon-white.png"
                      priority
                      alt="CIAI"
                      width={32}
                      height={31}
                      className="i1 hide-mb"
                    />
                    <Image
                      src="/images/logo-white.png"
                      priority
                      alt="CIAI"
                      width={80}
                      height={31}
                      className="i2"
                    />
                  </>
                )}
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
                    aria-label="My Connectors"
                    href="/html/connectors"
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
                      My Connectors
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
                  className="w-full sidebar-btn active"
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
                    <ThemeToggle />
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
            sx={{ top: 14, right: 16, zIndex: 3 }}
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
    </div>
  );
};

export default Settings;