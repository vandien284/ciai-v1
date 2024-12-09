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
  Stack,
  Dropdown,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Card,
  CardContent,
  CardOverflow,
  CardActions,
  Typography,
  Select,
  selectClasses,
  SelectStaticProps,
  Option,
  Sheet,
  Chip,
  styled,
  Slider,
} from "@mui/joy";
import {
  Collapse,
  Tooltip,
  Popover,
  Popper,
  ClickAwayListener,
} from "@mui/material";

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

const Popup = styled(Popper)({
  zIndex: 1000,
});

interface UploadedFile {
  file: File;
  preview: string | null; // Image preview URL or null for non-images
}

const Detail = () => {
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

  // Collapse Button
  const [expanded, setExpanded] = React.useState(() =>
    isMobile ? false : true
  );
  useEffect(() => {
    setExpanded(isMobile ? false : true);
  }, [isTablet, isMobile]);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // React Textarea
  // State to store the content of each <textarea>
  const [texts, setTexts] = useState({
    textarea1: "",
    textarea2: "",
  });

  // Refs to store each <textarea> element
  const textareaRefs: { [key: string]: React.RefObject<HTMLTextAreaElement> } =
    {
      textarea1: useRef<HTMLTextAreaElement>(null),
      textarea2: useRef<HTMLTextAreaElement>(null),
    };

  // UseEffect hook to focus the first textarea when the component mounts
  useEffect(() => {
    if (textareaRefs?.textarea2.current) {
      textareaRefs.textarea2.current?.focus(); // Focus the first textarea
    }
  }, [textareaRefs.textarea2]);

  const handleChangeText = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    id: string
  ) => {
    const newText = event.target.value;
    setTexts((prevTexts) => ({
      ...prevTexts,
      [id]: newText,
    }));

    // Auto-resize the specific textarea if its ref exists
    const ref = textareaRefs[id];
    if (ref && ref.current) {
      ref.current.style.height = "21px"; // Reset height first
      ref.current.style.height = `${ref.current.scrollHeight}px`; // Adjust height based on content
    }
  };
  useEffect(() => {
    if (textareaRefs.textarea1?.current) {
      textareaRefs.textarea1.current.style.height = "21px"; // Reset height
      textareaRefs.textarea1.current.style.height = `${textareaRefs.textarea1.current.scrollHeight}px`; // Adjust height based on content
    }
  }, [textareaRefs.textarea1, expanded]);
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      router.push("/html/library/detail");
    }
  };
  // React ContentEditable
  const sanitizeConf = useRef({
    allowedTags: ["p"],
    allowedAttributes: {},
  });
  const [contentPrompt, setContentPrompt] = React.useState("Type something");
  const handleChangePrompt = React.useCallback((evt: any) => {
    setContentPrompt(
      sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf.current)
    );
  }, []);
  const editableRef = useRef(null);
  const onKeyPressHandler = (event: any) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault(); // Prevent default behavior for Shift + Enter

      const element = editableRef.current;
      if (element !== null) {
        // Get the selection and range
        document.execCommand("insertLineBreak");
        const htmlElement = element as HTMLElement;

        // Scroll the contentEditable to the bottom
        htmlElement.scrollTop = htmlElement.scrollHeight;

        // Maintain focus
        htmlElement.focus();
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setContentPrompt(
        sanitizeHtml(event.currentTarget.innerHTML, sanitizeConf.current)
      );
      router.push("/html/library/detail");
    }
  };

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

  // Select Options
  const [selectedOption, setSelectedOption] =
    useState<string>("content-creator");
  // State to track the selected radio button value
  const [selectedPromt, setSelectedPromt] = React.useState(false);
  const handleChangeCategories = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    // Set the selected option
    if (newValue !== null) {
      setSelectedOption(newValue);
    }
  };

  // Handle the change when a prompt button is clicked
  const handlePromptChange = () => {
    setSelectedPromt(true);
  };
  // console.log(selectedOption, selectedPromt);

  // Menu Dropdown
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Tab") {
      setOpenDropdown(false);
    } else if (event.key === "Escape") {
      buttonRef.current!.focus();
      setOpenDropdown(false);
    }
  };

  // Upload mutiple file
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const uploadedFiles: UploadedFile[] = Array.from(selectedFiles).map(
        (file) => ({
          file,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        })
      );
      // Add new files to existing ones
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    }
  };
  const handleRemoveFile = (index: number) => {
    // Remove file from the list and revoke URL for previews
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      const removedFile = updatedFiles.splice(index, 1)[0];
      if (removedFile.preview) {
        URL.revokeObjectURL(removedFile.preview); // Clean up object URL
      }
      return updatedFiles;
    });
  };

  // Edit Prompt
  const [showEditPrompt, setShowEditPrompt] = React.useState(false);
  const handleClickEditPrompt = () => {
    setShowEditPrompt(true);
  };
  const handleClickCancelPrompt = () => {
    setShowEditPrompt(false);
  };

  // Toggle role
  const [showRole, setShowRole] = React.useState(true);

  // Slider
  const [sliderValue, setSliderValue] = useState(1);
  const [sliderOutputLengthValue, setSliderOutputLengthValue] = useState(512);
  const handleSliderChange = (e: any, newValue: any) => {
    setSliderValue(newValue);
  };
  const handleInputSliderChange = (e: any) => {
    setSliderValue(e.target.value > 2 ? "2" : e.target.value);
  };
  const handleSliderOutputLengthChange = (e: any, newValue: any) => {
    setSliderOutputLengthValue(newValue);
  };
  const handleInputSliderOutputLengthChange = (e: any) => {
    setSliderOutputLengthValue(e.target.value > 4096 ? "4096" : e.target.value);
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
                      className="w-full sidebar-btn active"
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
                <div className="hidden sm:flex sm:items-center gap-x-2 overflow-hidden">
                  <h1 className="text-2xl font-normal truncate heading-title">
                    Untitled prompt
                  </h1>
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
                        color: "var(--cl-primary)",
                        "&:hover": {
                          background: "var(--bg-color)",
                          color: "var(--cl-primary)",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className="grow max-w-xs sm:hidden">
                <FormControl className="w-full px-4">
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
                        color: "var(--cl-primary)",
                        [`&.${selectClasses.expanded}`]: {
                          transform: "rotate(-180deg)",
                        },
                      },
                    }}
                    slotProps={{
                      listbox: {
                        sx: {
                          py: 0,
                          border: "none",
                          bgcolor: "var(--cl-bg-dropdown)",
                          borderRadius: "8px",
                          width: "100%",
                          fontFamily: "var(--font)",
                          fontSize: "0.875rem",
                          "& .MuiOption-root": {
                            color: "var(--cl-primary)",
                          },
                          "& .MuiOption-root:hover": {
                            bgcolor: "var(--cl-item-dropdown)!important",
                            color: "var(--cl-primary)!important",
                          },
                          "& .MuiOption-root.Mui-selected": {
                            bgcolor: "var(--cl-item-dropdown)",
                            color: "var(--cl-primary-70)!important",
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
              <div className="bar-right">
                {!isMobile && (
                  <div className="flex items-center gap-x-3">
                    <div className="btn-save">
                      <Button
                        variant="plain"
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
                        <span className="material-symbols-outlined">save</span>
                        Save
                      </Button>
                    </div>
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
                          <span className="material-symbols-outlined">
                            save
                          </span>
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
                )}
                {isMobile && (
                  <div className="btn-click-menu">
                    <IconButton
                      variant="plain"
                      onClick={handleClickSidebarRight}
                      className="w-8 h-8 flex items-center justify-center transition"
                      sx={{
                        borderRadius: "9999px",
                        minWidth: "40px",
                        minHeight: "40px",
                        color: "var(--cl-primary)",
                        "&.MuiIconButton-root:hover": {
                          bgcolor: "var(--bg-color)",
                          color: "var(--cl-primary)",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">
                        settings
                      </span>
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
          </nav>
          <main className="w-full grow flex" id="main-content">
            <div className="grow flex flex-col">
              <div className="w-full min-h-11 flex-shrink-0 px-3 border-b border-solid border-color">
                <div className="flex items-center gap-x-1 mt-0.5">
                  <IconButton
                    variant="plain"
                    aria-label="Show more"
                    onClick={handleExpandClick}
                    className="w-9 h-9 flex items-center justify-center transition show-more"
                    aria-expanded={expanded ? "true" : "false"}
                    sx={{
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
                    <span className="material-symbols-outlined">
                      keyboard_arrow_down
                    </span>
                  </IconButton>
                  <span className="text-base font-medium">
                    System Instructions
                  </span>
                </div>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <div className="sys-ins">
                    <div
                      className="ml-12 mb-2 lg:mb-3 overflow-auto"
                      style={{
                        minHeight: "21px",
                        maxHeight: "200px",
                      }}
                    >
                      <textarea
                        ref={textareaRefs.textarea1}
                        value={texts.textarea1}
                        onChange={(e) => handleChangeText(e, "textarea1")}
                        placeholder="Optional tone and style instructions for the model"
                        style={{
                          width: "100%",
                          height: "21px",
                          maxHeight: "200px",
                          resize: "none", // Disable manual resizing
                          whiteSpace: "pre-wrap",
                          verticalAlign: "middle",
                        }}
                      />
                    </div>
                  </div>
                </Collapse>
              </div>
              <div className="grow overflow-auto detail-post">
                <div className="pt-4 px-4">
                  <div className="result-area">
                    <div className="flex items-center gap-2 mb-3 dots-loading">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="result-item">
                      <div
                        className={`${
                          !showEditPrompt
                            ? "px-2 py-1 mb-2 rounded-xl border border-solid border-transparent single-role"
                            : "px-2 py-1 mb-2 rounded-xl border border-solid border-transparent single-role editing"
                        }`}
                      >
                        <div className="mb-3 flex toggle-role">
                          <div className="flex items-center gap-x-3">
                            {showRole && (
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                        </div>
                        <div className="flex justify-end sticky top-8 z-10 h-0 actions-wrap">
                          <div className="h-6 flex gap-x-3 ml-4 opacity-0 rounded-4xl -mt-9 group-actions">
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
                              placement="top"
                              title="Publish"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Publish"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <span className="material-symbols-outlined">
                                  publish
                                </span>
                              </IconButton>
                            </Tooltip>
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
                              placement="top"
                              title="Move up"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                    bgcolor: "var(--cl-neutral-8)",
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
                                aria-label="Move down"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                                    color: "var(--cl-neutral-80)",
                                    ":hover": {
                                      background: "var(--cl-neutral-8)",
                                      color: "var(--cl-neutral-80)",
                                    },
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                                    color: "var(--cl-neutral-80)",
                                    ":hover": {
                                      background: "var(--cl-neutral-8)",
                                      color: "var(--cl-neutral-80)",
                                    },
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
                                    bgcolor: "var(--cl-neutral-8)",
                                    fontFamily: "var(--font)",
                                    color: "var(--cl-neutral-80)",
                                  },
                                },
                              }}
                              placement="top"
                              title="Rerun"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Rerun"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full transition"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width="24"
                                  height="24"
                                >
                                  <defs>
                                    <clipPath
                                      clipPathUnits="userSpaceOnUse"
                                      id="cp1"
                                    >
                                      <path d="m29.14-5.14v34.28h-34.28v-34.28z" />
                                    </clipPath>
                                    <linearGradient
                                      id="g1"
                                      x2="1"
                                      gradientUnits="userSpaceOnUse"
                                      gradientTransform="matrix(0,34.286,-34.286,0,12,-5.143)"
                                    >
                                      <stop offset="0" stopColor="#87a9ff" />
                                      <stop offset=".44" stopColor="#a7b8ee" />
                                      <stop offset=".88" stopColor="#f1dcc7" />
                                    </linearGradient>
                                  </defs>
                                  <g id="Clip-Path" clip-path="url(#cp1)">
                                    <g>
                                      <path
                                        fill="url(#g1)"
                                        d="m12 25q0-2.7-1-5.1-1-2.3-2.8-4.1-1.8-1.8-4.1-2.8-2.4-1-5.1-1 2.7 0 5.1-1 2.3-1 4.1-2.8 1.8-1.8 2.8-4.1 1-2.4 1-5.1 0 2.7 1 5.1 1 2.3 2.8 4.1 1.8 1.8 4.1 2.8 2.4 1 5.1 1-2.7 0-5.1 1-2.3 1-4.1 2.8-1.8 1.8-2.8 4.1-1 2.4-1 5.1z"
                                      />
                                    </g>
                                  </g>
                                </svg>
                              </IconButton>
                            </Tooltip>
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
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                picture of this opossum:
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
                        <div className="mb-3 flex toggle-role">
                          <div className="flex items-center gap-x-3">
                            {showRole && (
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                        </div>
                        <div className="flex justify-end sticky top-8 z-10 h-0 actions-wrap">
                          <div className="h-6 flex gap-x-3 ml-4 opacity-0 rounded-4xl -mt-9 group-actions">
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
                              placement="top"
                              title="Move up"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                    bgcolor: "var(--cl-neutral-8)",
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
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                                    color: "var(--cl-neutral-80)",
                                    ":hover": {
                                      background: "var(--cl-neutral-8)",
                                      color: "var(--cl-neutral-80)",
                                    },
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                                    color: "var(--cl-neutral-80)",
                                    ":hover": {
                                      background: "var(--cl-neutral-8)",
                                      color: "var(--cl-neutral-80)",
                                    },
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
                                    bgcolor: "var(--cl-neutral-8)",
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
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                        bgcolor: "var(--cl-neutral-8)",
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
                                      bgcolor: "var(--cl-neutral-60)",
                                      color: "#FFF",
                                      minWidth: "24px",
                                      minHeight: "24px",
                                      ":hover": {
                                        background: "var(--cl-neutral-8)",
                                        color: "var(--cl-neutral-80)",
                                      },
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
                        <div className="mb-3 flex toggle-role">
                          <div className="flex items-center gap-x-3">
                            {!showRole && (
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                        </div>
                        <div className="flex justify-end sticky top-8 z-10 h-0 actions-wrap">
                          <div className="h-6 flex gap-x-3 ml-4 opacity-0 rounded-4xl -mt-9 group-actions">
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
                              placement="top"
                              title="Move up"
                            >
                              <IconButton
                                variant="plain"
                                aria-label="Move up"
                                sx={{
                                  borderRadius: "100%",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                    bgcolor: "var(--cl-neutral-8)",
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
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                                    color: "var(--cl-neutral-80)",
                                    ":hover": {
                                      background: "var(--cl-neutral-8)",
                                      color: "var(--cl-neutral-80)",
                                    },
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
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
                                    color: "var(--cl-neutral-80)",
                                    ":hover": {
                                      background: "var(--cl-neutral-8)",
                                      color: "var(--cl-neutral-80)",
                                    },
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
                                    bgcolor: "var(--cl-neutral-8)",
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
                                  color: "var(--cl-neutral-80)",
                                  ":hover": {
                                    background: "var(--cl-neutral-8)",
                                    color: "var(--cl-neutral-80)",
                                  },
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
                                  <span className="hljs-string">"name"</span>:
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
                                  <span className="hljs-string">"name"</span>:
                                  <span className="hljs-string">
                                    "All-purpose flour"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :<span className="hljs-string">"5 cups"</span>
                                  ,{"\n"}
                                  <span className="hljs-string">"unit"</span>:
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">"name"</span>:
                                  <span className="hljs-string">"Salt"</span>,
                                  {"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :
                                  <span className="hljs-string">
                                    "1 1/2 teaspoons"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">"unit"</span>:
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">"name"</span>:
                                  <span className="hljs-string">"Sugar"</span>,
                                  {"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :
                                  <span className="hljs-string">
                                    "1 tablespoon"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">"unit"</span>:
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">"name"</span>:
                                  <span className="hljs-string">
                                    "Active dry yeast"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :
                                  <span className="hljs-string">
                                    "2 1/4 teaspoons"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">"unit"</span>:
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">"name"</span>:
                                  <span className="hljs-string">
                                    "Warm water"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  : <span className="hljs-string">"1 cup"</span>
                                  ,{"\n"}
                                  <span className="hljs-string">"unit"</span>:
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">"name"</span>:
                                  <span className="hljs-string">
                                    "Unsalted butter"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :
                                  <span className="hljs-string">"1/2 cup"</span>
                                  ,{"\n"}
                                  <span className="hljs-string">"unit"</span>:
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">"name"</span>:
                                  <span className="hljs-string">
                                    "Cold unsalted butter"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  :
                                  <span className="hljs-string">
                                    "1 1/4 cups"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">"unit"</span>:
                                  <span className="hljs-string">""</span>
                                  {"\n"}
                                  {"    "}
                                  {"}"},{"\n"}
                                  {"    "}
                                  {"{"}
                                  {"\n"}
                                  <span className="hljs-string">"name"</span>:
                                  <span className="hljs-string">
                                    "Egg wash"
                                  </span>
                                  ,{"\n"}
                                  <span className="hljs-string">
                                    "quantity"
                                  </span>
                                  : <span className="hljs-string">"1"</span>,
                                  {"\n"}
                                  <span className="hljs-string">"unit"</span>:
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
                              className="flex items-center justify-between pr-4 note-highlighted-code"
                              style={{
                                fontSize: "0.7rem",
                              }}
                            >
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
                                placement="bottom"
                                title="Copy to clipboard"
                              >
                                <IconButton
                                  variant="plain"
                                  sx={{
                                    minWidth: "40px",
                                    minHeight: "40px",
                                    borderRadius: "100%",
                                    color: "var(--cl-primary)",
                                    "&:hover": {
                                      background: "var(--cl-neutral-8)",
                                      color: "var(--cl-primary)",
                                    },
                                  }}
                                >
                                  <span className="material-symbols-outlined">
                                    content_copy
                                  </span>
                                </IconButton>
                              </Tooltip>
                              <span className="grow disclaimer">
                                Use code&nbsp;
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
                  <div className="w-full pl-6 py-2 border border-solid rounded-4xl overflow-hidden flex items-end justify-between actions-prompt">
                    <div className="w-full input-prompt">
                      {(selectedOption === "" || !selectedPromt) && (
                        <div className="grow mb-2 type-prompt">
                          {/* <textarea
                            ref={textareaRefs.textarea2}
                            value={texts.textarea2}
                            onChange={(e) => handleChangeText(e, "textarea2")}
                            onKeyPress={onKeyPressHandler}
                            placeholder="Type something"
                            style={{
                              width: "100%",
                              height: "22px",
                              maxHeight: "100px",
                              resize: "none", // Disable manual resizing
                              whiteSpace: "pre-wrap",
                              verticalAlign: "middle",
                            }}
                          /> */}
                          <div
                            ref={editableRef}
                            className="max-h-24 overflow-x-hidden overflow-y-auto content-wrap"
                          >
                            <ContentEditable
                              onChange={handleChangePrompt}
                              onBlur={handleChangePrompt}
                              onKeyPress={onKeyPressHandler}
                              html={contentPrompt}
                              data-placeholder="Type something"
                              suppressContentEditableWarning={true}
                            />
                          </div>
                        </div>
                      )}
                      {selectedOption === "content-creator" && (
                        <div className="grow type-prompt">
                          {selectedPromt && (
                            <div
                              ref={editableRef}
                              className="max-h-24 overflow-x-hidden overflow-y-auto content-wrap"
                            >
                              <div
                                contentEditable
                                onChange={handleChangePrompt}
                                onBlur={handleChangePrompt}
                                onKeyPress={onKeyPressHandler}
                                data-placeholder="Type something"
                                suppressContentEditableWarning={true}
                              >
                                <p>
                                  Bạn là chuyên gia trong lĩnh vực &nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [marketting...]
                                  </span>
                                  &nbsp;tại khu vực&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [Sài Gòn, Hà Nội...]
                                  </span>
                                  &nbsp;hãy tạo bài viết với đề tài&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [Toyota Yaris Cross Hybrid 2024]
                                  </span>
                                  &nbsp;.
                                </p>
                                <p>
                                  Bài viết sẽ có giọng văn&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [chuyên nghiệp, dễ hiểu...]
                                  </span>
                                  &nbsp;và số lượng từ là&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [400, 600...]
                                  </span>
                                  &nbsp;
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedOption === "chatbot" && (
                        <div className="grow type-prompt">
                          {selectedPromt && (
                            <div
                              ref={editableRef}
                              className="max-h-24 overflow-x-hidden overflow-y-auto content-wrap"
                            >
                              <div
                                contentEditable
                                onChange={handleChangePrompt}
                                onBlur={handleChangePrompt}
                                onKeyPress={onKeyPressHandler}
                                data-placeholder="Type something"
                                suppressContentEditableWarning={true}
                              >
                                <p>
                                  Bạn là chuyên gia trong lĩnh vực &nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [o tô...]
                                  </span>
                                  &nbsp;tại khu vực&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [Sài Gòn, Hà Nội...]
                                  </span>
                                  &nbsp;hãy tạo bài viết với đề tài&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [Toyota Yaris Cross Hybrid 2024]
                                  </span>
                                  &nbsp;.
                                </p>
                                <p>
                                  Bài viết sẽ có giọng văn&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [chuyên nghiệp, dễ hiểu...]
                                  </span>
                                  &nbsp;và số lượng từ là&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [400, 600...]
                                  </span>
                                  &nbsp;
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedOption === "business-intelligent" && (
                        <div className="grow type-prompt">
                          {selectedPromt && (
                            <div
                              ref={editableRef}
                              className="max-h-24 overflow-x-hidden overflow-y-auto content-wrap"
                            >
                              <div
                                contentEditable
                                onChange={handleChangePrompt}
                                onBlur={handleChangePrompt}
                                onKeyPress={onKeyPressHandler}
                                data-placeholder="Type something"
                                suppressContentEditableWarning={true}
                              >
                                <p>
                                  Bạn là chuyên gia trong lĩnh vực &nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [business...]
                                  </span>
                                  &nbsp;tại khu vực&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [Sài Gòn, Hà Nội...]
                                  </span>
                                  &nbsp;hãy tạo bài viết với đề tài&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [Toyota Yaris Cross Hybrid 2024]
                                  </span>
                                  &nbsp;.
                                </p>
                                <p>
                                  Bài viết sẽ có giọng văn&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [chuyên nghiệp, dễ hiểu...]
                                  </span>
                                  &nbsp;và số lượng từ là&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [400, 600...]
                                  </span>
                                  &nbsp;
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedOption === "scraping" && (
                        <div className="grow type-prompt">
                          {selectedPromt && (
                            <div
                              ref={editableRef}
                              className="max-h-24 overflow-x-hidden overflow-y-auto content-wrap"
                            >
                              <div
                                contentEditable
                                onChange={handleChangePrompt}
                                onBlur={handleChangePrompt}
                                onKeyPress={onKeyPressHandler}
                                data-placeholder="Type something"
                                suppressContentEditableWarning={true}
                              >
                                <p>
                                  Bạn là chuyên gia trong lĩnh vực &nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [website]
                                  </span>
                                  &nbsp;tại khu vực&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [Sài Gòn, Hà Nội...]
                                  </span>
                                  &nbsp;hãy tạo bài viết với đề tài&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [Toyota Yaris Cross Hybrid 2024]
                                  </span>
                                  &nbsp;.
                                </p>
                                <p>
                                  Bài viết sẽ có giọng văn&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [chuyên nghiệp, dễ hiểu...]
                                  </span>
                                  &nbsp;và số lượng từ là&nbsp;
                                  <span
                                    className="keyword"
                                    onClick={handleSpanClick}
                                  >
                                    [400, 600...]
                                  </span>
                                  &nbsp;
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Preview Section */}
                      {files.length > 0 && (
                        <div
                          className="flex flex-wrap gap-x-3 pt-4 mt-3 overflow-y-auto file-container"
                          style={{
                            borderTop: "1px solid var(--cl-neutral-30)",
                            maxHeight: "33vh",
                          }}
                        >
                          {files.map((uploadedFile, index) => (
                            <div key={index} className="pb-2">
                              {uploadedFile.preview ? (
                                <div className="border border-solid rounded overflow-hidden relative image-wrap">
                                  <Image
                                    width={200}
                                    height={218}
                                    src={uploadedFile.preview}
                                    alt={`Preview ${index}`}
                                  />
                                  <IconButton
                                    variant="plain"
                                    aria-label="Remove image"
                                    sx={{
                                      borderRadius: "100%",
                                      bgcolor: "var(--cl-neutral-60)",
                                      color: "#FFF",
                                      minWidth: "24px",
                                      minHeight: "24px",
                                      ":hover": {
                                        background: "var(--cl-neutral-8)",
                                        color: "var(--cl-neutral-80)",
                                      },
                                    }}
                                    className="absolute top-2 right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full transition"
                                    onClick={() => handleRemoveFile(index)}
                                  >
                                    <span className="material-symbols-outlined">
                                      close
                                    </span>
                                  </IconButton>
                                </div>
                              ) : (
                                <div className="border border-solid rounded overflow-hidden relative flex flex-col file-wrap">
                                  <div className="flex flex-col items-center justify-center file-icon">
                                    <span className="material-symbols-outlined">
                                      docs
                                    </span>
                                  </div>
                                  <div className="file-info flex items-center justify-center">
                                    <p className="truncate">
                                      {uploadedFile.file.name}
                                    </p>
                                  </div>
                                  <IconButton
                                    variant="plain"
                                    aria-label="Remove image"
                                    sx={{
                                      borderRadius: "100%",
                                      bgcolor: "var(--cl-neutral-60)",
                                      color: "#FFF",
                                      minWidth: "24px",
                                      minHeight: "24px",
                                      ":hover": {
                                        background: "var(--cl-neutral-8)",
                                        color: "var(--cl-neutral-80)",
                                      },
                                    }}
                                    className="absolute top-2 right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full transition"
                                    onClick={() => handleRemoveFile(index)}
                                  >
                                    <span className="material-symbols-outlined">
                                      close
                                    </span>
                                  </IconButton>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-x-2 pr-2">
                      <div>
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
                          title="Insert assets such as images, videos, folders, files, or audio"
                        >
                          <Button
                            ref={buttonRef}
                            className="flex items-center justify-center w-9 h-9"
                            id="composition-button"
                            aria-controls={"composition-menu"}
                            aria-haspopup="true"
                            aria-expanded={openDropdown ? "true" : undefined}
                            variant="outlined"
                            sx={{
                              p: 0,
                              border: "none",
                              borderRadius: "100%",
                              minHeight: "36px",
                              background: "none",
                              color: "var(--cl-neutral-90)",
                              "&:hover": {
                                background: "var(--bg-color)",
                              },
                            }}
                            onClick={() => {
                              setOpenDropdown(!openDropdown);
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "1.5rem !important" }}
                            >
                              add_circle
                            </span>
                          </Button>
                        </Tooltip>
                        <Popup
                          role={undefined}
                          id="composition-menu"
                          open={openDropdown}
                          anchorEl={buttonRef.current}
                          disablePortal
                          modifiers={[
                            {
                              name: "offset",
                              options: {
                                offset: [60, -130],
                              },
                            },
                          ]}
                        >
                          <ClickAwayListener
                            onClickAway={(event) => {
                              if (event.target !== buttonRef.current) {
                                handleCloseDropdown();
                              }
                            }}
                          >
                            <MenuList
                              variant="outlined"
                              onKeyDown={handleListKeyDown}
                              className="dropdown-menu"
                              sx={{
                                bgcolor: "var(--cl-bg-dropdown)",
                                borderColor: "var(--cl-neutral-8)",
                                p: 0,
                              }}
                            >
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
                                    color: "var(--cl-primary)",
                                    "&:hover": {
                                      background:
                                        "var(--cl-item-dropdown) !important",
                                      color: "var(--cl-primary) !important",
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
                                      bgcolor:
                                        "var(--cl-surface-container-highest)",
                                      fontFamily: "var(--font)",
                                      color: "var(--cl-neutral-80)",
                                    },
                                  },
                                }}
                                placement="left"
                                title="Upload a file to include in your prompt"
                              >
                                <MenuItem
                                  sx={{
                                    background: "none",
                                    p: 1.25,
                                    minHeight: "auto",
                                    fontSize: 15,
                                    gap: 1.25,
                                    color: "var(--cl-primary)",
                                    cursor: "pointer",
                                    "&:hover": {
                                      background:
                                        "var(--cl-item-dropdown) !important",
                                      color: "var(--cl-primary) !important",
                                    },
                                  }}
                                >
                                  <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute top-0 left-0 w-full h-full z-10 opacity-0 cursor-pointer"
                                  />
                                  <button
                                    type="button"
                                    className="flex"
                                    style={{ columnGap: "10px" }}
                                  >
                                    <span className="material-symbols-outlined">
                                      upload
                                    </span>
                                    <label
                                      htmlFor="image-upload"
                                      className="flex items-center cursor-pointer"
                                    >
                                      Upload Files
                                    </label>
                                  </button>
                                </MenuItem>
                              </Tooltip>
                              {/* <MenuItem
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
                                  color: "var(--cl-primary)",
                                  "&:hover": {
                                    background:
                                      "var(--cl-item-dropdown) !important",
                                    color: "var(--cl-primary) !important",
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
                                  color: "var(--cl-primary)",
                                  "&:hover": {
                                    background:
                                      "var(--cl-item-dropdown) !important",
                                    color: "var(--cl-primary) !important",
                                  },
                                }}
                              >
                                <span className="material-symbols-outlined">
                                  image
                                </span>
                                Sample Media
                              </MenuItem> */}
                            </MenuList>
                          </ClickAwayListener>
                        </Popup>
                      </div>
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
                        title="Write text to run prompt (Shift + Enter to add a line break and Enter to view detail)"
                      >
                        <button
                          type="button"
                          className="flex items-center justify-center gap-x-2 px-1 md:pl-3 md:pr-5 h-8 md:h-9 rounded-3xl transition font-medium btn-color"
                          onClick={() => router.push("/html/library/detail")}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 21.5C12 20.1833 11.75 18.95 11.25 17.8C10.75 16.6333 10.075 15.625 9.225 14.775C8.375 13.925 7.36667 13.25 6.2 12.75C5.05 12.25 3.81667 12 2.5 12C3.81667 12 5.05 11.75 6.2 11.25C7.36667 10.75 8.375 10.075 9.225 9.225C10.075 8.375 10.75 7.375 11.25 6.225C11.75 5.05833 12 3.81667 12 2.5C12 3.81667 12.25 5.05833 12.75 6.225C13.25 7.375 13.925 8.375 14.775 9.225C15.625 10.075 16.625 10.75 17.775 11.25C18.9417 11.75 20.1833 12 21.5 12C20.1833 12 18.9417 12.25 17.775 12.75C16.625 13.25 15.625 13.925 14.775 14.775C13.925 15.625 13.25 16.6333 12.75 17.8C12.25 18.95 12 20.1833 12 21.5Z"></path>
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
              className={`flex-shrink-0 sidebar ${
                sidebarOpenRight ? "expanded" : "compact"
              }`}
              id="sidebar-right"
            >
              <div
                className="w-full h-full flex flex-col justify-between inner"
                // ref={isMobile ? sideRightRef : refNull}
              >
                {isMobile && (
                  <div
                    onClick={() => setSidebarOpenRight(false)}
                    className="overlay-sidebar"
                  ></div>
                )}
                <div className="min-h-11 border-b border-solid border-color flex items-center justify-between whitespace-nowrap title-setting">
                  <h2 className="grow text-base font-medium">Run settings</h2>
                  <Button
                    variant="plain"
                    sx={{
                      fontFamily: "var(--font)",
                      fontWeight: 400,
                      color: "var(--cl-primary)",
                      borderRadius: "8px",
                      minHeight: "36px",
                      "&:hover": {
                        background: "var(--bg-color)",
                      },
                    }}
                  >
                    Reset
                  </Button>
                  {isMobile && (
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
                          <span className="material-symbols-outlined">
                            save
                          </span>
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
                  )}
                </div>
                <div className="w-full grow overflow-x-hidden overflow-y-auto flex flex-col top-sidebar">
                  <div className="pt-4 settings">
                    <Box sx={{ width: "260px" }}>
                      <Stack>
                        <div className="item mb-6">
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
                                  color: "var(--cl-primary)",
                                  [`&.${selectClasses.expanded}`]: {
                                    transform: "rotate(-180deg)",
                                  },
                                },
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    py: 0,
                                    borderColor: "var(--cl-neutral-20)",
                                    bgcolor: "var(--cl-bg-dropdown)",
                                    borderRadius: "8px",
                                    width: "100%",
                                    fontFamily: "var(--font)",
                                    fontSize: "0.875rem",
                                    "& .MuiOption-root": {
                                      color: "var(--cl-primary)",
                                    },
                                    "& .MuiOption-root:hover": {
                                      bgcolor:
                                        "var(--cl-item-dropdown)!important",
                                      color: "var(--cl-primary)!important",
                                    },
                                    "& .MuiOption-root.Mui-selected": {
                                      bgcolor: "var(--cl-item-dropdown)",
                                      color: "var(--cl-primary-70)!important",
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
                        <div className="item mb-6">
                          <p className="flex items-center gap-x-2 mb-2">
                            <span className="material-symbols-outlined">
                              thermostat
                            </span>
                            <span className="font-medium name">
                              Temperature
                            </span>
                          </p>
                          <div className="ml-7">
                            <FormControl className="mr-8">
                              <Stack direction="row" spacing={2}>
                                <Slider
                                  defaultValue={1}
                                  max={2}
                                  step={0.05}
                                  sx={{
                                    width: "140px",
                                    "--Slider-trackSize": "6px",
                                    "--Slider-thumbSize": "20px",
                                    "& .MuiSlider-rail": {
                                      height: "4px",
                                      opacity: 0.24,
                                      backgroundColor: "var(--cl-primary-70)",
                                    },
                                    "& .MuiSlider-track": {
                                      backgroundColor: "var(--cl-primary-70)",
                                    },
                                    "& .MuiSlider-thumb": {
                                      "&:before": {
                                        backgroundColor: "var(--cl-primary-70)",
                                        borderColor: "var(--cl-primary-70)",
                                      },
                                    },
                                  }}
                                  value={sliderValue}
                                  onChange={handleSliderChange}
                                />
                                <Input
                                  type="number"
                                  className="input"
                                  sx={{
                                    px: 0.5,
                                    width: "48px",
                                    minHeight: "34px!important",
                                    height: "34px",
                                    "& .MuiInput-input": {
                                      textAlign: "center",
                                      fontSize: "0.75rem",
                                    },
                                  }}
                                  value={sliderValue}
                                  onChange={handleInputSliderChange}
                                />
                              </Stack>
                            </FormControl>
                          </div>
                        </div>
                        <div className="item mb-6">
                          <p className="flex items-center gap-x-2 mb-2">
                            <span className="material-symbols-outlined">
                              straighten
                            </span>
                            <span className="font-medium name">
                              Output length
                            </span>
                          </p>
                          <div className="ml-7">
                            <FormControl className="mr-8">
                              <Stack direction="row" spacing={2}>
                                <Slider
                                  defaultValue={512}
                                  max={4096}
                                  step={512}
                                  sx={{
                                    width: "140px",
                                    "--Slider-trackSize": "6px",
                                    "--Slider-thumbSize": "20px",
                                    "& .MuiSlider-rail": {
                                      height: "4px",
                                      opacity: 0.24,
                                      backgroundColor: "var(--cl-primary-70)",
                                    },
                                    "& .MuiSlider-track": {
                                      backgroundColor: "var(--cl-primary-70)",
                                    },
                                    "& .MuiSlider-thumb": {
                                      "&:before": {
                                        backgroundColor: "var(--cl-primary-70)",
                                        borderColor: "var(--cl-primary-70)",
                                      },
                                    },
                                  }}
                                  value={sliderOutputLengthValue}
                                  onChange={handleSliderOutputLengthChange}
                                />
                                <Input
                                  type="number"
                                  className="input"
                                  sx={{
                                    px: 0.5,
                                    width: "48px",
                                    minHeight: "34px!important",
                                    height: "34px",
                                    "& .MuiInput-input": {
                                      textAlign: "center",
                                      fontSize: "0.75rem",
                                    },
                                  }}
                                  value={sliderOutputLengthValue}
                                  onChange={handleInputSliderOutputLengthChange}
                                />
                              </Stack>
                            </FormControl>
                          </div>
                        </div>
                        <div className="item mb-6">
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
                                  color: "var(--cl-primary)",
                                  [`&.${selectClasses.expanded}`]: {
                                    transform: "rotate(-180deg)",
                                  },
                                },
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    py: 0,
                                    borderColor: "var(--cl-neutral-20)",
                                    bgcolor: "var(--cl-bg-dropdown)",
                                    borderRadius: "8px",
                                    width: "100%",
                                    fontFamily: "var(--font)",
                                    fontSize: "0.875rem",
                                    "& .MuiOption-root": {
                                      color: "var(--cl-primary)",
                                    },
                                    "& .MuiOption-root.MuiOption-highlighted": {
                                      bgcolor: "transparent!important",
                                    },
                                    "& .MuiOption-root:hover": {
                                      bgcolor:
                                        "var(--cl-item-dropdown)!important",
                                      color: "var(--cl-primary)!important",
                                    },
                                    "& .MuiOption-root.Mui-selected": {
                                      bgcolor:
                                        "var(--cl-item-dropdown)!important",
                                      color: "var(--cl-primary-70)!important",
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
                        <div className="item mb-6">
                          <p className="flex items-center gap-x-2 mb-2">
                            <span className="material-symbols-outlined">
                              category
                            </span>
                            <span className="font-medium name">Module</span>
                          </p>
                          <div className="ml-7">
                            <FormControl className="mr-8">
                              <Select
                                indicator={<ArrowDropDownOutlined />}
                                className="w-full custom-select"
                                name="select-module"
                                placeholder="Select Module"
                                defaultValue="chatbot"
                                sx={{
                                  fontFamily: "var(--font)",
                                  fontSize: "0.875rem",
                                  "& .MuiSelect-button": {
                                    opacity: 1,
                                  },
                                  [`& .${selectClasses.indicator}`]: {
                                    transition: "0.2s",
                                    color: "var(--cl-primary)",
                                    [`&.${selectClasses.expanded}`]: {
                                      transform: "rotate(-180deg)",
                                    },
                                  },
                                }}
                                slotProps={{
                                  listbox: {
                                    sx: {
                                      py: 0,
                                      borderColor: "var(--cl-neutral-20)",
                                      bgcolor: "var(--cl-bg-dropdown)",
                                      borderRadius: "8px",
                                      width: "100%",
                                      fontFamily: "var(--font)",
                                      fontSize: "0.875rem",
                                      "& .MuiOption-root": {
                                        color: "var(--cl-primary)",
                                      },
                                      "& .MuiOption-root.MuiOption-highlighted":
                                        {
                                          bgcolor: "transparent!important",
                                        },
                                      "& .MuiOption-root:hover": {
                                        bgcolor:
                                          "var(--cl-item-dropdown)!important",
                                        color: "var(--cl-primary)!important",
                                      },
                                      "& .MuiOption-root.Mui-selected": {
                                        bgcolor:
                                          "var(--cl-item-dropdown)!important",
                                        color: "var(--cl-primary-70)!important",
                                      },
                                    },
                                  },
                                }}
                                onChange={handleChangeCategories}
                              >
                                <Option value="content-creator">
                                  Content Creator
                                </Option>
                                <Option value="chatbot">Chatbot</Option>
                                <Option value="business-intelligent">
                                  Business Intelligence
                                </Option>
                                <Option value="scraping">Scraping</Option>
                              </Select>
                            </FormControl>
                            {selectedOption && (
                              <div className="setting-options mt-4">
                                {selectedOption === "content-creator" && (
                                  <>
                                    <p className="flex items-center gap-x-2 mb-2">
                                      <span className="font-medium name">
                                        Channel
                                      </span>
                                    </p>
                                    <FormControl className="mr-8 mb-4">
                                      <Select
                                        indicator={<ArrowDropDownOutlined />}
                                        className="w-full custom-select"
                                        name="select-channel"
                                        placeholder="Select Channel"
                                        sx={{
                                          fontFamily: "var(--font)",
                                          fontSize: "0.875rem",
                                          "& .MuiSelect-button": {
                                            opacity: 1,
                                          },
                                          [`& .${selectClasses.indicator}`]: {
                                            transition: "0.2s",
                                            color: "var(--cl-primary)",
                                            [`&.${selectClasses.expanded}`]: {
                                              transform: "rotate(-180deg)",
                                            },
                                          },
                                        }}
                                        slotProps={{
                                          listbox: {
                                            sx: {
                                              py: 0,
                                              borderColor:
                                                "var(--cl-neutral-20)",
                                              bgcolor: "var(--cl-bg-dropdown)",
                                              borderRadius: "8px",
                                              width: "100%",
                                              fontFamily: "var(--font)",
                                              fontSize: "0.875rem",
                                              "& .MuiOption-root": {
                                                color: "var(--cl-primary)",
                                              },
                                              "& .MuiOption-root.MuiOption-highlighted":
                                                {
                                                  bgcolor:
                                                    "transparent!important",
                                                },
                                              "& .MuiOption-root:hover": {
                                                bgcolor:
                                                  "var(--cl-item-dropdown)!important",
                                                color:
                                                  "var(--cl-primary)!important",
                                              },
                                              "& .MuiOption-root.Mui-selected":
                                                {
                                                  bgcolor:
                                                    "var(--cl-item-dropdown)!important",
                                                  color:
                                                    "var(--cl-primary-70)!important",
                                                },
                                            },
                                          },
                                        }}
                                      >
                                        <Option value="caready">Caready</Option>
                                        <Option value="caready-ai">
                                          Caready AI
                                        </Option>
                                        <Option value="facebook">
                                          Facebook
                                        </Option>
                                      </Select>
                                    </FormControl>
                                  </>
                                )}
                                <p className="flex items-center gap-x-2 mb-2">
                                  <span className="font-medium name">
                                    Prompt model
                                  </span>
                                </p>
                                {selectedOption === "content-creator" && (
                                  <div className="-ml-2 mr-8">
                                    <Button
                                      variant="plain"
                                      aria-label="Post for website"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Post for website
                                      </span>
                                    </Button>
                                    <Button
                                      variant="plain"
                                      aria-label="Post for fanpage"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Post for fanpage
                                      </span>
                                    </Button>
                                  </div>
                                )}
                                {selectedOption === "chatbot" && (
                                  <div className="-ml-2 mr-8">
                                    <Button
                                      variant="plain"
                                      aria-label="Your Perfect Car"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Your Perfect Car
                                      </span>
                                    </Button>
                                    <Button
                                      variant="plain"
                                      aria-label="Loan Interest Rates"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Loan Interest Rates
                                      </span>
                                    </Button>
                                    <Button
                                      variant="plain"
                                      aria-label="Best Insurance Company"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Best Insurance Company
                                      </span>
                                    </Button>
                                  </div>
                                )}
                                {selectedOption === "business-intelligent" && (
                                  <div className="-ml-2 mr-8">
                                    <Button
                                      variant="plain"
                                      aria-label="Monthly Revenue"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Monthly Revenue
                                      </span>
                                    </Button>
                                    <Button
                                      variant="plain"
                                      aria-label="Loan Interest Rates"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Car Chart
                                      </span>
                                    </Button>
                                    <Button
                                      variant="plain"
                                      aria-label="Car Listing"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Car Listing
                                      </span>
                                    </Button>
                                    <Button
                                      variant="plain"
                                      aria-label="Compare Cars"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Compare Cars
                                      </span>
                                    </Button>
                                    <Button
                                      variant="plain"
                                      aria-label="Cost Estimate"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Cost Estimate
                                      </span>
                                    </Button>
                                  </div>
                                )}
                                {selectedOption === "scraping" && (
                                  <div className="-ml-2 mr-8">
                                    <Button
                                      variant="plain"
                                      aria-label="Scrap a website"
                                      sx={{
                                        pl: 0,
                                        pr: 1,
                                        py: 0,
                                        justifyContent: "flex-start",
                                        fontFamily: "var(--font)",
                                        color: "var(--cl-neutral-80)",
                                        borderRadius: "20px",
                                        "&.MuiButton-root:hover": {
                                          background: "var(--cl-item-dropdown)",
                                        },
                                      }}
                                      className="w-full"
                                      onClick={handlePromptChange}
                                    >
                                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                          chat_bubble
                                        </span>
                                      </span>
                                      <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                                        Scrap a website
                                      </span>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Stack>
                    </Box>
                  </div>
                  <div
                    className="grow cursor-pointer clickable-space"
                    onClick={handleClickSidebarRight}
                  ></div>
                </div>
                <div className="w-full py-3 flex justify-end bot-sidebar">
                  <div className="btn-click-menu">
                    {isMobile && (
                      <IconButton
                        variant="plain"
                        onClick={handleClickSidebarRight}
                        className="w-9 h-9 flex items-center justify-center transition"
                        sx={{
                          borderRadius: "9999px",
                          minWidth: "40px",
                          minHeight: "40px",
                          color: "var(--cl-primary)",
                          "&.MuiIconButton-root:hover": {
                            bgcolor: "var(--cl-toggle)",
                            color: "var(--cl-primary)",
                          },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </IconButton>
                    )}
                    {!isMobile && (
                      <>
                        {sidebarOpenRight ? (
                          <IconButton
                            variant="plain"
                            onClick={handleClickSidebarRight}
                            className="w-9 h-9 flex items-center justify-center transition"
                            sx={{
                              borderRadius: "9999px",
                              minWidth: "40px",
                              minHeight: "40px",
                              color: "var(--cl-primary)",
                              "&.MuiIconButton-root:hover": {
                                bgcolor: "var(--cl-toggle)",
                                color: "var(--cl-primary)",
                              },
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
                              color: "var(--cl-primary)",
                              "&.MuiIconButton-root:hover": {
                                bgcolor: "var(--cl-toggle)",
                                color: "var(--cl-primary)",
                              },
                            }}
                          >
                            <span className="material-symbols-outlined">
                              chevron_left
                            </span>
                          </IconButton>
                        )}
                      </>
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

export default Detail;
