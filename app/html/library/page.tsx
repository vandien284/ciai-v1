"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MenuOutlined,
  CloseOutlined,
  ChatBubbleOutlineOutlined,
  TocOutlined,
  WorkOutlineOutlined,
  DatasetOutlined,
  LocalLibraryOutlined,
  HistoryOutlined,
  LightbulbOutlined,
  ExploreOutlined,
  WarningAmber,
  ContentCopyOutlined,
  QuestionAnswerOutlined,
  SearchOutlined,
  FolderOutlined,
  PublishOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";

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
  List,
  ListItem,
  Select,
  selectClasses,
  Option,
  RadioGroup,
  Radio,
  Sheet,
} from "@mui/joy";
import { Tooltip, Popover, TablePagination } from "@mui/material";

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

const Library = () => {
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

  const [showUrlPrompt, setShowUrlPrompt] = React.useState(true);
  const [showTypePrompt, setShowTypePrompt] = React.useState(false);
  const [showContentPrompt, setShowContentPrompt] = React.useState(false);
  const handleClickPrompt = () => {
    if (!showTypePrompt) {
      setShowUrlPrompt(false);
      setShowTypePrompt(true);
      setShowContentPrompt(false);
    }
  };
  const handleClickContentPrompt = () => {
    setShowContentPrompt(true);
  };

  const handleOutsidePromptClick = () => {
    setShowTypePrompt(false);
    setShowContentPrompt(false);
  };
  const promptRef = useOutsideClick(handleOutsidePromptClick);

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

  const handleSpanClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.target as HTMLSpanElement;

    document.querySelectorAll(".keyword").forEach((el) => {
      el.classList.remove("border-keyword");
    });

    target.classList.add("border-keyword");

    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(target);
    selection?.removeAllRanges();
    selection?.addRange(range);

    const contentEditable = target.closest('[contentEditable="true"]');
    if (contentEditable) {
      const handleInput = () => {
        const selection = window.getSelection();
        if (selection) {
          const anchorNode = selection.anchorNode;

          if (anchorNode && target.contains(anchorNode)) {
            target.classList.remove("border-keyword");
            contentEditable.removeEventListener("input", handleInput);
          }
        }
      };

      contentEditable.addEventListener("input", handleInput);
    }
  };

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
                <div className="hide-mb btn-click-menu">
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
        <div className="grow flex flex-col h-screen">
          <nav className="w-full h-16 bg-white relative z-50">
            <div className="h-full px-6 py-3 flex items-center justify-between border-b border-solid border-gray-300 bar">
              <div className="flex items-center gap-x-2 bar-left">
                <h1 className="text-2xl font-normal heading-title">
                  My library
                </h1>
              </div>
            </div>
          </nav>
          <main className="w-full grow flex flex-col" id="main-content">
            <div className="grow overflow-auto p-5 lg:p-6 all-posts">
              <div className="container">
                <Box className="list-posts">
                  <div className="flex items-center justify-between mb-4 page-heading">
                    <h2 className="text-xl font-normal heading-title">
                      All files
                    </h2>
                    <div className="flex items-center gap-x-3">
                      <Button
                        component="a"
                        variant="plain"
                        aria-label="Drive Folder"
                        href="/html/home"
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
                        <span className="material-symbols-outlined">
                          add_to_drive
                        </span>
                        Drive Folder
                      </Button>
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
                  <div className="lg:overflow-auto">
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
                            <span className="material-symbols-outlined mt-1 prompt-icon">
                              chat_bubble
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium tend"
                            >
                              Microfinance in Hyderabad
                            </button>
                          </td>
                          <td></td>
                          <td>Chat prompt</td>
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
                                    "&:hover": {
                                      background: "#F6F6F6!important",
                                      color: "#000!important",
                                    },
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
                            <span className="material-symbols-outlined mt-1 prompt-icon">
                              model_training
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium tend"
                            >
                              Bubble Sort Optimization
                            </button>
                          </td>
                          <td></td>
                          <td>Model</td>
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
                                    "&:hover": {
                                      background: "#F6F6F6!important",
                                      color: "#000!important",
                                    },
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
                            <span className="material-symbols-outlined mt-1 prompt-icon">
                              chat_bubble
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-left font-medium tend"
                            >
                              Microfinance in Hyderabad
                            </button>
                          </td>
                          <td></td>
                          <td>Chat prompt</td>
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
                                    "&:hover": {
                                      background: "#F6F6F6!important",
                                      color: "#000!important",
                                    },
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
                          bgcolor: "#FFF",
                          borderRadius: "3px",
                          border: "1px solid #bdc1ca",
                          fontSize: "0.75rem",
                          color: "#000",
                        },
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              "& .MuiMenuItem-root": {
                                fontSize: "0.75rem",
                                minHeight: 32,
                                "&.Mui-selected": {
                                  bgcolor: "#f2f4fd",
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

export default Library;
