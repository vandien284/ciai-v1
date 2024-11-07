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
  Chip,
} from "@mui/joy";
import { Tooltip, Popover } from "@mui/material";

import { useOutsideClick } from "outsideclick-react";

import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";

import dynamic from "next/dynamic";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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

const Detail = () => {
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

  const [showEditPrompt, setShowEditPrompt] = React.useState(false);
  const [showEditArticle, setShowEditArticle] = React.useState(false);
  const handleClickEditPrompt = () => {
    setShowEditPrompt(true);
  };
  const handleClickCancelPrompt = () => {
    setShowEditPrompt(false);
  };
  const handleClickEditArticle = () => {
    setShowEditArticle(true);
  };
  const handleClickCancelArticle = () => {
    setShowEditArticle(false);
  };

  // Toggle role
  const [showRole, setShowRole] = React.useState(true);

  // React ContentEditable
  const [content, setContent] = React.useState("");
  const onContentChange = React.useCallback((evt: any) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p", "br"],
      allowedAttributes: { a: ["href"] },
    };
    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);

  // Quill
  const [contentArticle, setContentArticle] = useState("");
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }],
      ["code-block"],
      ["clean"],
    ],
  };
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "code-block",
  ];
  const handleEditorChange = (newContent: any) => {
    setContentArticle(newContent);
  };

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
              <div className="bar-right">
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
            </div>
          </nav>
          <main className="w-full grow flex" id="main-content">
            <div className="grow flex flex-col">
              <div className="grow overflow-auto detail-post">
                <div className="pt-4 px-4">
                  <div className="result-area">
                    <div className="result-item">
                      <div
                        className={`${
                          !showEditPrompt
                            ? "px-2 py-1 mb-2 rounded-xl border border-solid border-transparent single-role"
                            : "px-2 py-1 mb-2 rounded-xl border border-solid border-transparent single-role editing"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between sticky top-1 z-10 toggle-role">
                          <div className="flex items-center gap-x-3">
                            {showRole && (
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
                                placement="top"
                                title="Switch to Model"
                              >
                                <Chip
                                  sx={{
                                    pb: 0.125,
                                    "& .MuiChip-action": {
                                      background:
                                        "var(--cl-role-user-bg)!important",
                                    },
                                  }}
                                  onClick={() => setShowRole(!showRole)}
                                >
                                  <span className="text-white leading-6">
                                    User
                                  </span>
                                </Chip>
                              </Tooltip>
                            )}
                            {!showRole && (
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
                                placement="top"
                                title="Switch to User"
                              >
                                <Chip
                                  sx={{
                                    pb: 0.125,
                                    "& .MuiChip-action": {
                                      background:
                                        "var(--cl-role-model-bg)!important",
                                    },
                                  }}
                                  onClick={() => setShowRole(!showRole)}
                                >
                                  <span className="text-white leading-6">
                                    Model
                                  </span>
                                </Chip>
                              </Tooltip>
                            )}
                            {showEditPrompt && (
                              <span className="status">Editing</span>
                            )}
                          </div>
                          <div className="flex gap-x-3 ml-4 lg:opacity-0 rounded-4xl group-actions">
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
                              placement="top"
                              title="Move down"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_upward
                                </span>
                              </IconButton>
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
                              placement="top"
                              title="Move down"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_downward
                                </span>
                              </IconButton>
                            </Tooltip>
                            {!showEditPrompt && (
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
                                placement="top"
                                title="Edit"
                              >
                                <IconButton
                                  variant="plain"
                                  aria-label="Edit"
                                  sx={{
                                    borderRadius: "100%",
                                    minWidth: "24px",
                                    minHeight: "24px",
                                  }}
                                  className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                  onClick={() => handleClickEditPrompt()}
                                >
                                  <span className="material-symbols-outlined">
                                    edit
                                  </span>
                                </IconButton>
                              </Tooltip>
                            )}
                            {showEditPrompt && (
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
                                placement="top"
                                title="Stop editing"
                              >
                                <IconButton
                                  variant="plain"
                                  aria-label="Stop editing"
                                  sx={{
                                    borderRadius: "100%",
                                    minWidth: "24px",
                                    minHeight: "24px",
                                  }}
                                  className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                  onClick={() => handleClickCancelPrompt()}
                                >
                                  <span className="material-symbols-outlined">
                                    done_all
                                  </span>
                                </IconButton>
                              </Tooltip>
                            )}
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
                              placement="top"
                              title="Delete"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Delete"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                        {!showEditPrompt && (
                          <div className="px-2 leading-relaxed word-break info-prompt">
                            <p>
                              You are an expert regex string creator and
                              understand how regex works. Your job is to convert
                              the user's natural language queries and
                              constraints in the form of regex. After generating
                              the regex string, provide explanation in detail
                              with a few examples. Then demonstrate its use in a
                              python code.
                            </p>
                            <p>
                              User query:
                              <br />
                              Give me the regex equivalent of the following:
                              <br />
                              My requirements are:
                            </p>
                            <ol>
                              <li>I want my string to have 2-63 characters.</li>
                              <li>
                                The string should be alphanumeric and can
                                contain - also.
                              </li>
                              <li>
                                The string must start as well as end with
                                alphanumeric characters only.
                              </li>
                            </ol>
                            <ol>
                              <li>
                                Every time you make a search query, it should
                                redirect you to a Google search with the same
                                query, but with the word "opossum" added to it.
                              </li>
                              <li>
                                It should be visually similar to Google search.
                              </li>
                              <li>
                                Instead of the google logo, it should have a
                                picture of this opossum:{" "}
                                <a
                                  target="_blank"
                                  href="https://www.google.com/url?sa=E&q=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F27%2FOpossum_2.jpg%2F292px-Opossum_2.jpg"
                                >
                                  https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Opossum_2.jpg/292px-Opossum_2.jpg
                                </a>
                              </li>
                              <li>
                                It should be a single HTML file, with no
                                separate JS or CSS files.
                              </li>
                              <li>
                                It should say Powered by opossum search in the
                                footer.
                              </li>
                              <li>Do not use any unicode characters.</li>
                            </ol>
                          </div>
                        )}
                        {showEditPrompt && (
                          <div className="px-2 leading-relaxed word-break edit-prompt">
                            <div
                              contentEditable
                              data-placeholder="What do you want to create?"
                            >
                              <p>
                                You are an expert regex string creator and
                                understand how regex works. Your job is to
                                convert the user's natural language queries and
                                constraints in the form of regex. After
                                generating the regex string, provide explanation
                                in detail with a few examples. Then demonstrate
                                its use in a python code.
                              </p>
                              <p>
                                User query:
                                <br />
                                Give me the regex equivalent of the following:
                                <br />
                                My requirements are:
                              </p>
                              <ol>
                                <li>
                                  I want my string to have 2-63 characters.
                                </li>
                                <li>
                                  The string should be alphanumeric and can
                                  contain - also.
                                </li>
                                <li>
                                  The string must start as well as end with
                                  alphanumeric characters only.
                                </li>
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* single-role */}
                      <div
                        className={`${
                          !showEditPrompt
                            ? "px-2 py-1 mb-2 rounded-xl border border-solid border-transparent single-role"
                            : "px-2 py-1 mb-2 rounded-xl border border-solid border-transparent single-role editing"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between sticky top-1 z-10 toggle-role">
                          <div className="flex items-center gap-x-3">
                            {showRole && (
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
                                placement="top"
                                title="Switch to Model"
                              >
                                <Chip
                                  sx={{
                                    pb: 0.125,
                                    "& .MuiChip-action": {
                                      background:
                                        "var(--cl-role-user-bg)!important",
                                    },
                                  }}
                                  onClick={() => setShowRole(!showRole)}
                                >
                                  <span className="text-white leading-6">
                                    User
                                  </span>
                                </Chip>
                              </Tooltip>
                            )}
                            {!showRole && (
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
                                placement="top"
                                title="Switch to User"
                              >
                                <Chip
                                  sx={{
                                    pb: 0.125,
                                    "& .MuiChip-action": {
                                      background:
                                        "var(--cl-role-model-bg)!important",
                                    },
                                  }}
                                  onClick={() => setShowRole(!showRole)}
                                >
                                  <span className="text-white leading-6">
                                    Model
                                  </span>
                                </Chip>
                              </Tooltip>
                            )}
                            {showEditPrompt && (
                              <span className="status">Editing</span>
                            )}
                          </div>
                          <div className="flex gap-x-3 ml-4 lg:opacity-0 rounded-4xl group-actions">
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
                              placement="top"
                              title="Move down"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_upward
                                </span>
                              </IconButton>
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
                              placement="top"
                              title="Move down"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_downward
                                </span>
                              </IconButton>
                            </Tooltip>
                            {!showEditPrompt && (
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
                                placement="top"
                                title="Edit"
                              >
                                <IconButton
                                  variant="plain"
                                  aria-label="Edit"
                                  sx={{
                                    borderRadius: "100%",
                                    minWidth: "24px",
                                    minHeight: "24px",
                                  }}
                                  className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                  onClick={() => handleClickEditPrompt()}
                                >
                                  <span className="material-symbols-outlined">
                                    edit
                                  </span>
                                </IconButton>
                              </Tooltip>
                            )}
                            {showEditPrompt && (
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
                                placement="top"
                                title="Stop editing"
                              >
                                <IconButton
                                  variant="plain"
                                  aria-label="Stop editing"
                                  sx={{
                                    borderRadius: "100%",
                                    minWidth: "24px",
                                    minHeight: "24px",
                                  }}
                                  className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                  onClick={() => handleClickCancelPrompt()}
                                >
                                  <span className="material-symbols-outlined">
                                    done_all
                                  </span>
                                </IconButton>
                              </Tooltip>
                            )}
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
                              placement="top"
                              title="Delete"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Delete"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="px-2 leading-relaxed word-break info-prompt">
                          <div className="flex flex-wrap gap-x-3 image-container">
                            <div className="border border-solid rounded overflow-hidden relative mb-3 image-wrap">
                              <Image
                                className="loaded-image"
                                src="/data/photo1.jpg"
                                width={500}
                                height={333}
                                alt="what_shape_comes_next1"
                              />
                              {showEditPrompt && (
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
                                  title="Remove image"
                                >
                                  <IconButton
                                    variant="plain"
                                    aria-label="Remove image"
                                    sx={{
                                      borderRadius: "100%",
                                      backgroundColor: "var(--cl-neutral-60)",
                                      color: "#FFF",
                                      minWidth: "24px",
                                      minHeight: "24px",
                                    }}
                                    className="absolute top-2 right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full transition"
                                  >
                                    <span className="material-symbols-outlined">
                                      close
                                    </span>
                                  </IconButton>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* single-role */}
                      <div
                        className={`${
                          !showEditPrompt
                            ? "px-2 py-1 mb-2 rounded-xl border border-solid border-transparent single-role"
                            : "px-2 py-1 mb-2 rounded-xl border border-solid border-transparent single-role editing"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between sticky top-1 z-10 toggle-role">
                          <div className="flex items-center gap-x-3">
                            {!showRole && (
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
                                placement="top"
                                title="Switch to Model"
                              >
                                <Chip
                                  sx={{
                                    pb: 0.125,
                                    "& .MuiChip-action": {
                                      background:
                                        "var(--cl-role-user-bg)!important",
                                    },
                                  }}
                                  onClick={() => setShowRole(!showRole)}
                                >
                                  <span className="text-white leading-6">
                                    User
                                  </span>
                                </Chip>
                              </Tooltip>
                            )}
                            {showRole && (
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
                                placement="top"
                                title="Switch to User"
                              >
                                <Chip
                                  sx={{
                                    pb: 0.125,
                                    "& .MuiChip-action": {
                                      background:
                                        "var(--cl-role-model-bg)!important",
                                    },
                                  }}
                                  onClick={() => setShowRole(!showRole)}
                                >
                                  <span className="text-white leading-6">
                                    Model
                                  </span>
                                </Chip>
                              </Tooltip>
                            )}
                            {showEditPrompt && (
                              <span className="status">Editing</span>
                            )}
                          </div>
                          <div className="flex gap-x-3 ml-4 lg:opacity-0 rounded-4xl group-actions">
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
                              placement="top"
                              title="Move down"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_upward
                                </span>
                              </IconButton>
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
                              placement="top"
                              title="Move down"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  arrow_downward
                                </span>
                              </IconButton>
                            </Tooltip>
                            {!showEditPrompt && (
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
                                placement="top"
                                title="Edit"
                              >
                                <IconButton
                                  variant="plain"
                                  aria-label="Edit"
                                  sx={{
                                    borderRadius: "100%",
                                    minWidth: "24px",
                                    minHeight: "24px",
                                  }}
                                  className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                  onClick={() => handleClickEditPrompt()}
                                >
                                  <span className="material-symbols-outlined">
                                    edit
                                  </span>
                                </IconButton>
                              </Tooltip>
                            )}
                            {showEditPrompt && (
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
                                placement="top"
                                title="Stop editing"
                              >
                                <IconButton
                                  variant="plain"
                                  aria-label="Stop editing"
                                  sx={{
                                    borderRadius: "100%",
                                    minWidth: "24px",
                                    minHeight: "24px",
                                  }}
                                  className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                  onClick={() => handleClickCancelPrompt()}
                                >
                                  <span className="material-symbols-outlined">
                                    done_all
                                  </span>
                                </IconButton>
                              </Tooltip>
                            )}
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
                              placement="top"
                              title="Delete"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Delete"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="px-2 leading-relaxed word-break info-prompt">
                          <p>
                            The image is of a poke bowl, a Hawaiian dish. It
                            contains:
                          </p>
                          <ul>
                            <li>
                              <strong>
                                <span>White rice:</span>
                              </strong>
                              <span>&nbsp;The base of the bowl.</span>
                            </li>
                            <li>
                              <strong>
                                <span>Salmon:</span>
                              </strong>
                              <span>
                                &nbsp;Raw, sliced salmon is a common poke
                                protein.
                              </span>
                            </li>
                            <li>
                              <strong>
                                <span>Avocado:</span>
                              </strong>
                              <span>
                                &nbsp;Sliced avocado adds creaminess and healthy
                                fats.
                              </span>
                            </li>
                            <li>
                              <strong>
                                <span>Cucumber:</span>
                              </strong>
                              <span>
                                &nbsp;Diced cucumber provides freshness and
                                crunch.
                              </span>
                            </li>
                            <li>
                              <strong>
                                <span>Carrots:</span>
                              </strong>
                              <span>
                                &nbsp;Thinly sliced or shredded carrots add
                                color and sweetness.
                              </span>
                            </li>
                            <li>
                              <strong>
                                <span>Sesame seeds:</span>
                              </strong>
                              <span>
                                &nbsp;Black sesame seeds are sprinkled on top
                                for flavor and visual appeal.
                              </span>
                            </li>
                            <li>
                              <strong>
                                <span>Chopsticks:</span>
                              </strong>
                              <span>
                                &nbsp;Traditional eating utensils for poke and
                                other Asian-inspired dishes.
                              </span>
                            </li>
                          </ul>
                          <p>
                            <span>
                              The bowl is placed on a rustic wooden table or
                              surface, creating a visually appealing contrast.
                              The image is likely intended to showcase the poke
                              bowl and its ingredients, potentially for a
                              restaurant menu or food blog.
                            </span>
                          </p>
                          <div className="overflow-x-auto pt-3 mb-2 rounded-lg syntax-highlighted-code">
                            <div className="px-4 mb-3">
                              <pre>
                                <code>
                                  {"{"}
                                  {"\n"}
                                  {"  "}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">
                                    "Croissants"
                                  </span>
                                  ,{"\n"}
                                  {"  "}
                                  <span className="hljs-string">
                                    "ingredients"
                                  </span>
                                  : [{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">
                                    "All-purpose flour"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :{" "}
                                  <span className="hljs-string">"5 cups"</span>,
                                  {"\n"}
                                  <span className="hljs-string">
                                    "unit"
                                  </span>:{" "}
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">"Salt"</span>,
                                  {"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :{" "}
                                  <span className="hljs-string">
                                    "1 1/2 teaspoons"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "unit"
                                  </span>:{" "}
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">"Sugar"</span>,
                                  {"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :{" "}
                                  <span className="hljs-string">
                                    "1 tablespoon"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "unit"
                                  </span>:{" "}
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">
                                    "Active dry yeast"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :{" "}
                                  <span className="hljs-string">
                                    "2 1/4 teaspoons"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "unit"
                                  </span>:{" "}
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">
                                    "Warm water"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  : <span className="hljs-string">"1 cup"</span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "unit"
                                  </span>:{" "}
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">
                                    "Unsalted butter"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :{" "}
                                  <span className="hljs-string">"1/2 cup"</span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "unit"
                                  </span>:{" "}
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">
                                    "Cold unsalted butter"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :{" "}
                                  <span className="hljs-string">
                                    "1 1/4 cups"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "unit"
                                  </span>:{" "}
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">
                                    "name"
                                  </span>:{" "}
                                  <span className="hljs-string">
                                    "Egg wash"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  : <span className="hljs-string">"1"</span>,
                                  {"\n"}
                                  <span className="hljs-string">
                                    "unit"
                                  </span>:{" "}
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"}
                                  {"\n"}
                                  {"  "}],{"\n"}
                                  {"  "}
                                  <span className="hljs-string">
                                    "instructions"
                                  </span>
                                  : [{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "In a large bowl, whisk together flour,
                                    salt, and sugar."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "In a small bowl, dissolve yeast in warm
                                    water. Let stand for 5 minutes until foamy."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Add yeast mixture to flour mixture and stir
                                    until a shaggy dough forms."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Turn dough out onto a lightly floured
                                    surface and knead for 8-10 minutes, until
                                    smooth and elastic."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Place dough in a lightly greased bowl,
                                    cover with plastic wrap, and let rise in a
                                    warm place for 1 hour, until doubled in
                                    size."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "On a lightly floured surface, roll out
                                    dough into a 12x16 inch rectangle."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Place cold butter in the center of the
                                    dough, leaving a 1-inch border around the
                                    edges."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Fold dough over the butter, sealing the
                                    edges well."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Roll out dough again to a 12x16 inch
                                    rectangle."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Fold dough into thirds, like a letter."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Wrap dough in plastic wrap and refrigerate
                                    for 30 minutes."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Repeat steps 8-9 two more times."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Roll out dough to a 1/4 inch thickness."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Cut dough into triangles using a pizza
                                    cutter or sharp knife."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Roll up each triangle, starting from the
                                    base and working your way to the point."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Place croissants on a baking sheet lined
                                    with parchment paper."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Cover croissants with plastic wrap and let
                                    rise for 1 hour, until doubled in size."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Preheat oven to 375 degrees F (190 degrees
                                    C)."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Brush croissants with egg wash."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Bake for 15-20 minutes, until golden
                                    brown."
                                  </span>
                                  ,{"\n"}
                                  {"    "}
                                  <span className="hljs-string">
                                    "Let cool on a wire rack before serving."
                                  </span>
                                  {"\n"}
                                  {"  "}]{"\n"}
                                  {"}"}
                                </code>
                                {"\n"}
                                {"    "}
                              </pre>
                            </div>
                            <div
                              className="flex items-center justify-between bg-white pr-4"
                              style={{ fontSize: "0.7rem" }}
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
                                placement="right"
                                title="Copy to clipboard"
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
                                  <span className="material-symbols-outlined">
                                    content_copy
                                  </span>
                                </IconButton>
                              </Tooltip>
                              <span className="grow disclaimer">
                                Use code{" "}
                                <a
                                  href="https://support.google.com/legal/answer/13505487"
                                  target="_blank"
                                >
                                  with caution
                                </a>
                                .
                              </span>
                              <span className="language">Json</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* single-role */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-4 chat-prompt">
                <div className="px-4 lg:px-6">
                  <div
                    className="w-full pl-6 py-2 border border-solid rounded-4xl overflow-hidden flex items-end justify-between actions-prompt"
                    ref={promptRef}
                  >
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
                              defaultValue={"chatgpt"}
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
                              defaultValue={"caready"}
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
                  <div className="btn-click-menu">
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

export default Detail;
