"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { WarningAmber, ArrowDropDownOutlined } from "@mui/icons-material";

import {
  Button,
  IconButton,
  Avatar,
  Drawer,
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
  Stack,
  Dropdown,
  Menu,
  MenuItem,
  MenuButton,
  Card,
  CardContent,
  CardOverflow,
  CardActions,
  Typography,
  Select,
  selectClasses,
  Option,
  RadioGroup,
  Radio,
  Sheet,
} from "@mui/joy";
import { Tooltip, Popover } from "@mui/material";

import { useOutsideClick } from "outsideclick-react";

import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";

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
          sx={{ color: "#3c4043", lineHeight: 1.3 }}
        >
          Đào Lê
        </Typography>
        <Typography level="body-md" sx={{ color: "#5f6368", lineHeight: 1.3 }}>
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
              color: "var(--cl-drak-blue)",
              borderRadius: "8px",
              borderColor: "rgb(218,220,224)",
              "&:hover": {
                background: "#f5f7f9",
                borderColor: "#000f31",
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

const Home = () => {
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
  const handleOutsideClick = () => {
    setToggleSidebarLeft(true);
  };
  const sideNavRef = useOutsideClick(handleOutsideClick);
  const viewPort = useViewport();
  const isMobile = typeof window !== "undefined" && viewPort.width <= 1100;

  // React ContentEditable
  const [content, setContent] = React.useState("");
  const onContentChange = React.useCallback((evt: any) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p", "br"],
      allowedAttributes: { a: ["href"] },
    };
    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);

  // Popover
  const [popoverAccount, setPopoverAccount] = React.useState<CustomPopover>({
    anchorEl: null,
    child: <PopoverAccount />,
  });

  // Drawer
  const [openDrawerRename, setOpenDrawerRename] = React.useState(false);
  const [openDrawerPublish, setOpenDrawerPublish] = React.useState(false);

  // Modal
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEditHeading, setShowModalEditHeading] = useState(false);

  // Focus Input
  const inputTitleRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalEditHeading) {
      inputTitleRef.current?.focus();
    }
  }, [showModalEditHeading]);

  const onKeyPressHandler = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      router.push("/html/library/detail");
    }
    if (e.key === "Enter" && e.shiftKey) {
      // alert("Shift+Enter key Pressed");
    }
  };

  // Select Options
  const [selectedItem, setSelectedItem] = useState("content");
  const handleChangeActivities = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    setSelectedItem(newValue!);
  };
  // console.log(selectedItem);

  return (
    <div id="app">
      <section className="flex h-full sec-main">
        {!isMobile && (
          <aside
            className={
              toggleSidebarLeft
                ? "h-screen flex-shrink-0 sidebar expanded"
                : "h-screen flex-shrink-0 sidebar compact"
            }
            id="sidebar-left"
          >
            <div className="w-full h-full flex flex-col justify-between inner">
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
                    className="i1"
                  />
                  <Image
                    src="/images/logo.png"
                    priority
                    alt="CIAI"
                    width={80}
                    height={31}
                    className="i2"
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
                        color: "var(--cl-main)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#fff",
                        },
                      }}
                      className="w-full sidebar-btn active"
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
                        color: "var(--cl-main)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#fff",
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
                        href="/html/home"
                        sx={{
                          pl: 0,
                          pr: 1,
                          py: 0,
                          justifyContent: "flex-start",
                          fontFamily: "var(--font)",
                          color: "var(--cl-main)",
                          borderRadius: "20px",
                          "&.MuiButton-root:hover": {
                            background: "#fff",
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
                        href="/html/home"
                        sx={{
                          pl: 0,
                          pr: 1,
                          py: 0,
                          justifyContent: "flex-start",
                          fontFamily: "var(--font)",
                          color: "var(--cl-main)",
                          borderRadius: "20px",
                          "&.MuiButton-root:hover": {
                            background: "#fff",
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
                        href="/html/home"
                        sx={{
                          pl: 0,
                          pr: 1,
                          py: 0,
                          justifyContent: "flex-start",
                          fontFamily: "var(--font)",
                          color: "var(--cl-main)",
                          borderRadius: "20px",
                          "&.MuiButton-root:hover": {
                            background: "#fff",
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
                          Write an article about include relevant statistics
                          (add the links of the sources you use) and consider
                          diverse perspectives
                        </span>
                      </Button>
                    </div>
                    <div className="sidebar-menu">
                      <Button
                        component="a"
                        variant="plain"
                        aria-label="View more"
                        href="/html/home"
                        sx={{
                          pl: 1.25,
                          pr: 1,
                          py: 0,
                          justifyContent: "flex-start",
                          fontFamily: "var(--font)",
                          color: "var(--cl-main)",
                          borderRadius: "20px",
                          "&.MuiButton-root:hover": {
                            background: "#fff",
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
                      href="/html/home"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        justifyContent: "flex-start",
                        fontFamily: "var(--font)",
                        color: "var(--cl-main)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#fff",
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
              <div className="w-full pt-2 pb-4 border-t border-solid border-gray-300 bot-sidebar">
                <div className="sidebar-menu">
                  <Button
                    component="a"
                    variant="plain"
                    aria-label="Settings"
                    href="/html/home"
                    sx={{
                      pl: 0,
                      pr: 1,
                      py: 0,
                      justifyContent: "flex-start",
                      fontFamily: "var(--font)",
                      color: "var(--cl-main)",
                      borderRadius: "20px",
                      "&.MuiButton-root:hover": {
                        background: "#fff",
                      },
                    }}
                    className="w-full sidebar-btn"
                  >
                    <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">
                        settings
                      </span>
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
                      },
                    }}
                  >
                    {popoverAccount.child}
                  </Popover>
                </div>
                <div className="btn-click-menu">
                  {toggleSidebarLeft ? (
                    <IconButton
                      variant="plain"
                      onClick={handleClickSidebarLeft}
                      className="w-8 h-8 flex items-center justify-center transition"
                      sx={{
                        borderRadius: "9999px",
                        minWidth: "32px",
                        minHeight: "32px",
                        "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
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
                        "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
                      }}
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}
        {isMobile && (
          <aside
            className={
              toggleSidebarLeft
                ? "h-screen flex-shrink-0 sidebar expanded"
                : "h-screen flex-shrink-0 sidebar compact"
            }
            id="sidebar-left"
            ref={sideNavRef}
          >
            <div className="w-full h-full flex flex-col justify-between inner">
              <div className="h-16 flex-shrink-0 flex items-center nav-logo">
                <a
                  href="/html/home"
                  className="flex flex-start cursor-pointer logo"
                >
                  <Image
                    src="/images/logo.png"
                    priority
                    alt="CIAI"
                    width={80}
                    height={31}
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
                        color: "var(--cl-main)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#fff",
                        },
                      }}
                      className="w-full sidebar-btn active"
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
                        color: "var(--cl-main)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#fff",
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
                        href="/html/home"
                        sx={{
                          pl: 0,
                          pr: 1,
                          py: 0,
                          justifyContent: "flex-start",
                          fontFamily: "var(--font)",
                          color: "var(--cl-main)",
                          borderRadius: "20px",
                          "&.MuiButton-root:hover": {
                            background: "#fff",
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
                        href="/html/home"
                        sx={{
                          pl: 0,
                          pr: 1,
                          py: 0,
                          justifyContent: "flex-start",
                          fontFamily: "var(--font)",
                          color: "var(--cl-main)",
                          borderRadius: "20px",
                          "&.MuiButton-root:hover": {
                            background: "#fff",
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
                        href="/html/home"
                        sx={{
                          pl: 0,
                          pr: 1,
                          py: 0,
                          justifyContent: "flex-start",
                          fontFamily: "var(--font)",
                          color: "var(--cl-main)",
                          borderRadius: "20px",
                          "&.MuiButton-root:hover": {
                            background: "#fff",
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
                          Write an article about include relevant statistics
                          (add the links of the sources you use) and consider
                          diverse perspectives
                        </span>
                      </Button>
                    </div>
                    <div className="sidebar-menu">
                      <Button
                        component="a"
                        variant="plain"
                        aria-label="View more"
                        href="/html/home"
                        sx={{
                          pl: 1.25,
                          pr: 1,
                          py: 0,
                          justifyContent: "flex-start",
                          fontFamily: "var(--font)",
                          color: "var(--cl-main)",
                          borderRadius: "20px",
                          "&.MuiButton-root:hover": {
                            background: "#fff",
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
                      href="/html/home"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        justifyContent: "flex-start",
                        fontFamily: "var(--font)",
                        color: "var(--cl-main)",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#fff",
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
              <div className="w-full pt-2 pb-4 border-t border-solid border-gray-300 bot-sidebar">
                <div className="sidebar-menu">
                  <Button
                    component="a"
                    variant="plain"
                    aria-label="Settings"
                    href="/html/home"
                    sx={{
                      pl: 0,
                      pr: 1,
                      py: 0,
                      justifyContent: "flex-start",
                      fontFamily: "var(--font)",
                      color: "var(--cl-main)",
                      borderRadius: "20px",
                      "&.MuiButton-root:hover": {
                        background: "#fff",
                      },
                    }}
                    className="w-full sidebar-btn"
                  >
                    <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">
                        settings
                      </span>
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
                      },
                    }}
                  >
                    {popoverAccount.child}
                  </Popover>
                </div>
                <div className="btn-click-menu">
                  <IconButton
                    variant="plain"
                    onClick={handleClickSidebarLeft}
                    className="w-8 h-8 flex items-center justify-center transition"
                    sx={{
                      borderRadius: "9999px",
                      minWidth: "32px",
                      minHeight: "32px",
                      "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
                    }}
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </IconButton>
                </div>
              </div>
            </div>
          </aside>
        )}
        <div className="grow flex flex-col h-screen overflow-hidden">
          <nav className="w-full h-16 bg-white relative z-50">
            <div className="h-full px-3 lg:px-6 py-3 flex items-center justify-between gap-x-3 border-b border-solid border-gray-300 bar">
              <div className="flex items-center gap-x-2 overflow-hidden bar-left">
                <div className="show-mb btn-click-menu">
                  <IconButton
                    variant="plain"
                    onClick={handleClickSidebarLeft}
                    sx={{
                      mr: 0.5,
                      minWidth: "40px",
                      minHeight: "40px",
                      borderRadius: "100%",
                      "&:hover": {
                        background: "var(--bg-color)",
                      },
                    }}
                  >
                    <span className="material-symbols-outlined">menu</span>
                  </IconButton>
                </div>
                <div className="hidden sm:flex sm:items-center gap-x-2 overflow-hidden">
                  <h1 className="text-2xl font-normal truncate heading-title">
                    Untitled prompt
                  </h1>
                  <Tooltip
                    componentsProps={{
                      tooltip: {
                        sx: {
                          maxWidth: "12rem",
                          backgroundColor: "var(--cl-neutral-8)",
                          fontFamily: "var(--font)",
                          color: "var(--cl-neutral-80)",
                        },
                      },
                    }}
                    placement="right"
                    title="Edit title and description"
                  >
                    <IconButton
                      variant="plain"
                      onClick={() => setShowModalEditHeading(true)}
                      sx={{
                        minWidth: "40px",
                        minHeight: "40px",
                        borderRadius: "100%",
                        "&:hover": {
                          background: "var(--bg-color)",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className="sm:hidden">
                <FormControl className="ml-7 mr-8">
                  <Select
                    indicator={<ArrowDropDownOutlined />}
                    className="w-full custom-select"
                    name="select-models"
                    placeholder="Select Models"
                    defaultValue="chatgpt"
                    sx={{
                      fontFamily: "var(--font)",
                      fontSize: "0.875rem",
                      "& .MuiSelect-button": {
                        opacity: 1,
                      },
                      [`& .${selectClasses.indicator}`]: {
                        transition: "0.2s",
                        color: "var(--cl-main)",
                        [`&.${selectClasses.expanded}`]: {
                          transform: "rotate(-180deg)",
                        },
                      },
                    }}
                    slotProps={{
                      listbox: {
                        sx: {
                          py: 0,
                          borderColor: "#e2e2e5",
                          borderRadius: "8px",
                          width: "100%",
                          fontFamily: "var(--font)",
                          fontSize: "0.875rem",
                          "& .MuiOption-root.Mui-selected": {
                            bgcolor: "#f5f5f5",
                          },
                        },
                      },
                    }}
                  >
                    <Option value="chatgpt">ChatGPT 4o-mini</Option>
                    <Option value="germini">Germini 1.5</Option>
                  </Select>
                </FormControl>
              </div>
              <div className="flex items-center gap-x-3 bar-right">
                <div className="hidden md:block btn-save">
                  <Button
                    variant="plain"
                    sx={{
                      px: 1,
                      fontFamily: "var(--font)",
                      fontWeight: 400,
                      color: "var(--cl-main)",
                      lineHeight: "24px",
                      borderRadius: "8px",
                      "&:hover": {
                        background: "#d3d4d4",
                      },
                    }}
                    className="gap-x-1.5 transition font-medium"
                  >
                    <span className="material-symbols-outlined">save</span>
                    Save
                  </Button>
                </div>
                <div className="md:hidden btn-click-menu">
                  <IconButton
                    variant="plain"
                    onClick={handleClickSidebarRight}
                    className="w-8 h-8 flex items-center justify-center transition"
                    sx={{
                      borderRadius: "9999px",
                      minWidth: "40px",
                      minHeight: "40px",
                      "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
                    }}
                  >
                    <span className="material-symbols-outlined">settings</span>
                  </IconButton>
                </div>
              </div>
            </div>
          </nav>
          <main className="w-full grow flex" id="main-content">
            <div className="grow flex flex-col">
              <div className="grow overflow-auto guide-prompt">
                <div className="h-full flex data-area">
                  <div className="w-full px-4 lg:px-6 py-4 mt-auto sm:my-auto">
                    <div className="hidden sm:block">
                      <h2 className="text-3xl font-normal leading-tight mb-1 heading-title">
                        Get started
                      </h2>
                      <p className="text-base text-gray-600 font-medium">
                        Try a sample prompt or add your own input below
                      </p>
                    </div>
                    <Box
                      className="featured-guides"
                      sx={{
                        py: 2,
                      }}
                    >
                      <div className="flex flex-wrap gap-y-4 -mx-2">
                        <div className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-2 item">
                          <Link
                            className="w-full h-full"
                            href="/html/library/detail"
                          >
                            <div className="w-full h-full p-3 sm:p-6 bg-color flex gap-x-2 rounded-xl cursor-pointer box-guide">
                              <div className="w-8 flex-shrink-0 hidden sm:block icon">
                                <Image
                                  src="/images/icon/time-complexity.svg"
                                  width={32}
                                  height={32}
                                  alt="Time complexity"
                                />
                              </div>
                              <div className="caption">
                                <p className="text-base sm:text-xl font-normal mb-2 name">
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
                        <div className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-2 item">
                          <Link
                            className="w-full h-full"
                            href="/html/library/detail"
                          >
                            <div className="w-full h-full p-3 sm:p-6 bg-color flex gap-x-2 rounded-xl cursor-pointer box-guide">
                              <div className="w-8 flex-shrink-0 hidden sm:block icon">
                                <Image
                                  src="/images/icon/audio-diarization.svg"
                                  width={32}
                                  height={32}
                                  alt="Audio Diarization"
                                />
                              </div>
                              <div className="caption">
                                <p className="text-base sm:text-xl font-normal mb-2 name">
                                  Audio Diarization
                                </p>
                                <p className="des">
                                  Writing a script in Docker to set up your
                                  environment.
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-2 item">
                          <Link
                            className="w-full h-full"
                            href="/html/library/detail"
                          >
                            <div className="w-full h-full p-3 sm:p-6 bg-color flex gap-x-2 rounded-xl cursor-pointer box-guide">
                              <div className="w-8 flex-shrink-0 hidden sm:block icon">
                                <Image
                                  src="/images/icon/recipe-creator.svg"
                                  width={32}
                                  height={32}
                                  alt="Recipe creator"
                                />
                              </div>
                              <div className="caption">
                                <p className="text-base sm:text-xl font-normal mb-2 name">
                                  Recipe creator
                                </p>
                                <p className="des">
                                  Generate a custom recipe from a photo of what
                                  you want to eat.
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </Box>
                  </div>
                </div>
              </div>
              <div className="py-4 chat-prompt">
                <div className="px-4 lg:px-6">
                  <div className="w-full pl-6 py-2 border border-solid rounded-4xl overflow-hidden flex items-end justify-between actions-prompt">
                    <div className="grow max-h-28 overflow-y-auto pb-1.5 type-prompt">
                      <ContentEditable
                        onChange={onContentChange}
                        onBlur={onContentChange}
                        html={content}
                        data-placeholder="Type something"
                        suppressContentEditableWarning={true}
                        onKeyPress={onKeyPressHandler}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-x-2 pr-2">
                      <Dropdown>
                        <Tooltip
                          componentsProps={{
                            tooltip: {
                              sx: {
                                maxWidth: "12rem",
                                backgroundColor: "var(--cl-neutral-8)",
                                fontFamily: "var(--font)",
                                color: "var(--cl-neutral-80)",
                              },
                            },
                          }}
                          title="Insert assets such as images, videos, folders, files, or audio"
                        >
                          <MenuButton
                            className="flex items-center justify-center w-9 h-9"
                            sx={{
                              p: 0,
                              border: "none",
                              borderRadius: "100%",
                              minHeight: "36px",
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "1.5rem !important" }}
                            >
                              add_circle
                            </span>
                          </MenuButton>
                        </Tooltip>
                        <Menu
                          placement="bottom-end"
                          className="dropdown-menu"
                          sx={{
                            py: 0,
                          }}
                        >
                          <Tooltip
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  maxWidth: "12rem",
                                  backgroundColor: "var(--cl-neutral-8)",
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-neutral-80)",
                                },
                              },
                            }}
                            placement="left"
                            title="Select or upload a file on Google Drive to include in your prompt"
                          >
                            <MenuItem
                              className="flex"
                              sx={{
                                background: "none",
                                p: 1.25,
                                minHeight: "auto",
                                fontSize: 15,
                                gap: 1.25,
                                "&:hover": {
                                  background: "#F6F6F6!important",
                                  color: "#000!important",
                                },
                              }}
                            >
                              <span className="material-symbols-outlined">
                                add_to_drive
                              </span>
                              My Drive
                            </MenuItem>
                          </Tooltip>
                          <Tooltip
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  maxWidth: "12rem",
                                  backgroundColor: "var(--cl-neutral-8)",
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-neutral-80)",
                                },
                              },
                            }}
                            placement="left"
                            title="Upload a file to Google Drive to include in your prompt"
                          >
                            <MenuItem
                              className="flex"
                              sx={{
                                background: "none",
                                p: 1.25,
                                minHeight: "auto",
                                fontSize: 15,
                                gap: 1.25,
                                "&:hover": {
                                  background: "#F6F6F6!important",
                                  color: "#000!important",
                                },
                              }}
                            >
                              <span className="material-symbols-outlined">
                                upload
                              </span>
                              Upload File
                            </MenuItem>
                          </Tooltip>
                          <MenuItem
                            className="flex"
                            sx={{
                              background: "none",
                              p: 1.25,
                              minHeight: "auto",
                              fontSize: 15,
                              gap: 1.25,
                              "&:hover": {
                                background: "#F6F6F6!important",
                                color: "#000!important",
                              },
                            }}
                          >
                            <span className="material-symbols-outlined">
                              mic
                            </span>
                            Record Audio
                          </MenuItem>
                          <MenuItem
                            className="flex"
                            sx={{
                              background: "none",
                              p: 1.25,
                              minHeight: "auto",
                              fontSize: 15,
                              gap: 1.25,
                              "&:hover": {
                                background: "#F6F6F6!important",
                                color: "#000!important",
                              },
                            }}
                          >
                            <span className="material-symbols-outlined">
                              photo_camera
                            </span>
                            Take a photo
                          </MenuItem>
                          <MenuItem
                            className="flex"
                            sx={{
                              background: "none",
                              p: 1.25,
                              minHeight: "auto",
                              fontSize: 15,
                              gap: 1.25,
                              "&:hover": {
                                background: "#F6F6F6!important",
                                color: "#000!important",
                              },
                            }}
                          >
                            <span className="material-symbols-outlined">
                              image
                            </span>
                            Sample Media
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              maxWidth: "12rem",
                              backgroundColor: "var(--cl-neutral-8)",
                              fontFamily: "var(--font)",
                              color: "var(--cl-neutral-80)",
                            },
                          },
                        }}
                        title="Write text to run prompt (Ctrl + Enter)"
                      >
                        <button
                          type="button"
                          className="flex items-center justify-center gap-x-2 px-1 md:pl-3 md:pr-5 h-8 md:h-9 rounded-3xl transition text-white font-medium btn-color"
                          onClick={() => router.push("/html/library/detail")}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 21.5C12 20.1833 11.75 18.95 11.25 17.8C10.75 16.6333 10.075 15.625 9.225 14.775C8.375 13.925 7.36667 13.25 6.2 12.75C5.05 12.25 3.81667 12 2.5 12C3.81667 12 5.05 11.75 6.2 11.25C7.36667 10.75 8.375 10.075 9.225 9.225C10.075 8.375 10.75 7.375 11.25 6.225C11.75 5.05833 12 3.81667 12 2.5C12 3.81667 12.25 5.05833 12.75 6.225C13.25 7.375 13.925 8.375 14.775 9.225C15.625 10.075 16.625 10.75 17.775 11.25C18.9417 11.75 20.1833 12 21.5 12C20.1833 12 18.9417 12.25 17.775 12.75C16.625 13.25 15.625 13.925 14.775 14.775C13.925 15.625 13.25 16.6333 12.75 17.8C12.25 18.95 12 20.1833 12 21.5Z"
                              fill="#FFF"
                            ></path>
                          </svg>
                          <span className="hidden md:inline-block">Run</span>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <aside
              className={
                toggleSidebarRight
                  ? "flex-shrink-0 expanded sidebar"
                  : "flex-shrink-0 compact sidebar"
              }
              id="sidebar-right"
            >
              <div className="w-full h-full flex flex-col justify-between inner">
                <div className="h-11 border-b border-solid border-gray-300 flex items-center justify-between">
                  <h2 className="text-base font-medium">Run settings</h2>
                  <Button
                    variant="plain"
                    sx={{
                      fontFamily: "var(--font)",
                      fontWeight: 400,
                      color: "var(--cl-main)",
                      borderRadius: "8px",
                      minHeight: "32px",
                      "&:hover": {
                        background: "#d3d4d4",
                      },
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <div className="w-full grow overflow-y-auto top-sidebar">
                  <div className="py-4 overflow-hidden settings">
                    <Box sx={{ width: "260px" }}>
                      <Stack spacing={3}>
                        <div className="item">
                          <p className="flex items-center gap-x-2 mb-2">
                            <span className="material-symbols-outlined">
                              model_training
                            </span>
                            <span className="font-medium name">Model</span>
                          </p>
                          <FormControl className="ml-7 mr-8">
                            <Select
                              indicator={<ArrowDropDownOutlined />}
                              className="w-full custom-select"
                              name="select-models"
                              placeholder="Select Models"
                              defaultValue="chatgpt"
                              sx={{
                                fontFamily: "var(--font)",
                                fontSize: "0.875rem",
                                "& .MuiSelect-button": {
                                  opacity: 1,
                                },
                                [`& .${selectClasses.indicator}`]: {
                                  transition: "0.2s",
                                  color: "var(--cl-main)",
                                  [`&.${selectClasses.expanded}`]: {
                                    transform: "rotate(-180deg)",
                                  },
                                },
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    py: 0,
                                    borderColor: "#e2e2e5",
                                    borderRadius: "8px",
                                    width: "100%",
                                    fontFamily: "var(--font)",
                                    fontSize: "0.875rem",
                                    "& .MuiOption-root.Mui-selected": {
                                      bgcolor: "#f5f5f5",
                                    },
                                  },
                                },
                              }}
                            >
                              <Option value="chatgpt">ChatGPT 4o-mini</Option>
                              <Option value="germini">Germini 1.5</Option>
                            </Select>
                          </FormControl>
                        </div>
                        <div className="item">
                          <p className="flex items-center gap-x-2 mb-2">
                            <span className="material-symbols-outlined">
                              home_work
                            </span>
                            <span className="font-medium name">Company</span>
                          </p>
                          <FormControl className="ml-7 mr-8">
                            <Select
                              indicator={<ArrowDropDownOutlined />}
                              className="w-full custom-select"
                              name="select-company"
                              placeholder="Select Company"
                              defaultValue="caready"
                              sx={{
                                fontFamily: "var(--font)",
                                fontSize: "0.875rem",
                                "& .MuiSelect-button": {
                                  opacity: 1,
                                },
                                [`& .${selectClasses.indicator}`]: {
                                  transition: "0.2s",
                                  color: "var(--cl-main)",
                                  [`&.${selectClasses.expanded}`]: {
                                    transform: "rotate(-180deg)",
                                  },
                                },
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    py: 0,
                                    borderColor: "#e2e2e5",
                                    borderRadius: "8px",
                                    width: "100%",
                                    fontFamily: "var(--font)",
                                    fontSize: "0.875rem",
                                    "& .MuiOption-root.Mui-selected": {
                                      bgcolor: "#f5f5f5",
                                    },
                                  },
                                },
                              }}
                            >
                              <Option value="caready">Caready</Option>
                              <Option value="cosmix">Cosmix</Option>
                              <Option value="humology">Humology</Option>
                            </Select>
                          </FormControl>
                        </div>
                        <div className="item">
                          <p className="flex items-center gap-x-2 mb-2">
                            <span className="material-symbols-outlined">
                              construction
                            </span>
                            <span className="font-medium name">Activities</span>
                          </p>
                          <div className="ml-7">
                            <FormControl className="mr-8 mb-5">
                              <Select
                                indicator={<ArrowDropDownOutlined />}
                                className="w-full custom-select"
                                name="select-activities"
                                placeholder="Select Activities"
                                value={selectedItem}
                                defaultValue="content"
                                sx={{
                                  fontFamily: "var(--font)",
                                  fontSize: "0.875rem",
                                  "& .MuiSelect-button": {
                                    opacity: 1,
                                  },
                                  [`& .${selectClasses.indicator}`]: {
                                    transition: "0.2s",
                                    color: "var(--cl-main)",
                                    [`&.${selectClasses.expanded}`]: {
                                      transform: "rotate(-180deg)",
                                    },
                                  },
                                }}
                                slotProps={{
                                  listbox: {
                                    sx: {
                                      py: 0,
                                      borderColor: "#e2e2e5",
                                      borderRadius: "8px",
                                      width: "100%",
                                      fontFamily: "var(--font)",
                                      fontSize: "0.875rem",
                                      "& .MuiOption-root.Mui-selected": {
                                        bgcolor: "#f5f5f5",
                                      },
                                    },
                                  },
                                }}
                                onChange={handleChangeActivities}
                              >
                                <Option value="content">Content</Option>
                                <Option value="chatbox">Chatbox</Option>
                                <Option value="business">Business</Option>
                                <Option value="scraping">Scraping</Option>
                              </Select>
                            </FormControl>
                            <div className="setting-options">
                              <RadioGroup
                                name="content"
                                orientation="vertical"
                                defaultValue="content-writer"
                                className="flex-wrap"
                                aria-hidden={
                                  selectedItem !== "content" ? true : false
                                }
                              >
                                <Radio
                                  value="content-writer"
                                  label="Content writer"
                                  sx={{
                                    ml: 0,
                                    fontFamily: "var(--font)",
                                    fontSize: "0.875rem",
                                    "&.MuiRadio-root": {
                                      gap: "6px",
                                    },
                                    "& .MuiRadio-radio": {
                                      borderColor: "var(--cl-main)",
                                      ":hover": {
                                        background: "none",
                                      },
                                      "&.Mui-checked .MuiRadio-icon": {
                                        bgcolor: "var(--cl-main)",
                                      },
                                    },
                                  }}
                                />
                                <Radio
                                  value="copy-post"
                                  label="Copy post"
                                  sx={{
                                    ml: 0,
                                    fontFamily: "var(--font)",
                                    fontSize: "0.875rem",
                                    "&.MuiRadio-root": {
                                      gap: "6px",
                                    },
                                    "& .MuiRadio-radio": {
                                      borderColor: "var(--cl-main)",
                                      ":hover": {
                                        background: "none",
                                      },
                                      "&.Mui-checked .MuiRadio-icon": {
                                        bgcolor: "var(--cl-main)",
                                      },
                                    },
                                  }}
                                />
                              </RadioGroup>
                              <RadioGroup
                                name="chatbox"
                                orientation="vertical"
                                defaultValue="buy-a-car"
                                className="flex-wrap"
                                aria-hidden={
                                  selectedItem !== "chatbox" ? true : false
                                }
                              >
                                <Radio
                                  value="buy-a-car"
                                  label="Buy a car"
                                  sx={{
                                    ml: 0,
                                    fontFamily: "var(--font)",
                                    fontSize: "0.875rem",
                                    "&.MuiRadio-root": {
                                      gap: "6px",
                                    },
                                    "& .MuiRadio-radio": {
                                      borderColor: "var(--cl-main)",
                                      ":hover": {
                                        background: "none",
                                      },
                                      "&.Mui-checked .MuiRadio-icon": {
                                        bgcolor: "var(--cl-main)",
                                      },
                                    },
                                  }}
                                />
                                <Radio
                                  value="whats-new"
                                  label="What's new"
                                  sx={{
                                    ml: 0,
                                    fontFamily: "var(--font)",
                                    fontSize: "0.875rem",
                                    "&.MuiRadio-root": {
                                      gap: "6px",
                                    },
                                    "& .MuiRadio-radio": {
                                      borderColor: "var(--cl-main)",
                                      ":hover": {
                                        background: "none",
                                      },
                                      "&.Mui-checked .MuiRadio-icon": {
                                        bgcolor: "var(--cl-main)",
                                      },
                                    },
                                  }}
                                />
                              </RadioGroup>
                            </div>
                          </div>
                        </div>
                      </Stack>
                    </Box>
                  </div>
                </div>
                <div className="w-full py-3 flex justify-end bot-sidebar">
                  <div className="hide-mb btn-click-menu">
                    {toggleSidebarRight ? (
                      <IconButton
                        variant="plain"
                        onClick={handleClickSidebarRight}
                        className="w-9 h-9 flex items-center justify-center transition"
                        sx={{
                          borderRadius: "9999px",
                          minWidth: "40px",
                          minHeight: "40px",
                          "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </IconButton>
                    ) : (
                      <IconButton
                        variant="plain"
                        onClick={handleClickSidebarRight}
                        className="w-9 h-9 flex items-center justify-center transition"
                        sx={{
                          borderRadius: "9999px",
                          minWidth: "40px",
                          minHeight: "40px",
                          "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          chevron_left
                        </span>
                      </IconButton>
                    )}
                  </div>
                  <div className="show-mb btn-click-menu">
                    <IconButton
                      variant="plain"
                      onClick={handleClickSidebarRight}
                      className="w-9 h-9 flex items-center justify-center transition"
                      sx={{
                        borderRadius: "9999px",
                        minWidth: "40px",
                        minHeight: "40px",
                        "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
                      }}
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </IconButton>
                  </div>
                </div>
              </div>
            </aside>
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
            },
          }}
        >
          <ModalClose
            sx={{ top: 14, right: 16, zIndex: 3 }}
            className="modal-close"
          />
          <DialogTitle>
            <span className="text-base font-medium">Save prompt</span>
          </DialogTitle>
          <Divider />
          <DialogContent className="py-3">
            <FormControl className="mb-4">
              <FormLabel className="form-label">Prompt name</FormLabel>
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
              <FormLabel className="form-label">Description</FormLabel>
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
                bgcolor: "var(--cl-blue)",
                borderRadius: "8px",
                fontWeight: 400,
                "&:hover": {
                  background: "var(--cl-dark-blue)",
                },
              }}
            >
              Save
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setShowModalEditHeading(false)}
              sx={{ borderRadius: "8px", fontWeight: 400 }}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default Home;
