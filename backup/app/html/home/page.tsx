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
  RadioGroup,
  Radio,
} from "@mui/joy";
import { Collapse, Tooltip, Popover } from "@mui/material";

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

const Home = () => {
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

  // Collapse Button
  const [expanded, setExpanded] = React.useState(true);
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
    if (e.ctrlKey && e.key === "Enter") {
      router.push("/html/library/detail");
    }
  };
  // React ContentEditable
  const [contentPrompt, setContentPrompt] = React.useState("Type something");
  const onContentPromptChange = React.useCallback((evt: any) => {
    const sanitizeConf = {
      allowedTags: ["p", "br"],
      allowedAttributes: {},
    };
    setContentPrompt(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);
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

  // Focus Input
  const inputTitleRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalEditHeading) {
      inputTitleRef.current?.focus();
    }
  }, [showModalEditHeading]);

  // Select Options
  const [selectedOption, setSelectedOption] = useState<string>("");
  // State to track the selected radio button value
  const [selectedRadio, setSelectedRadio] = useState<string>("");
  const radioGroups: Record<string, string[]> = {
    content: ["for-website", "for-facebook-post", "create-new-template"],
    chatbot: ["buy-a-car", "whats-new"],
  };
  const handleChangeCategories = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    // Set the selected option
    if (newValue !== null) {
      setSelectedOption(newValue);

      // Reset radio value to the first option of the selected radio group
      const radioGroup = radioGroups[newValue];
      if (radioGroup) {
        setSelectedRadio(radioGroup[0]); // Default to the first radio button
      }
    }
  };

  // Handle the change when a radio button is selected
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(event.target.value);
  };
  // console.log(selectedOption, selectedRadio);

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
                        bgcolor: "var(--cl-neutral-20)",
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
                <div className="hidden sm:flex sm:items-center gap-x-2 overflow-hidden">
                  <h1 className="text-2xl font-normal truncate heading-title">
                    Untitled prompt
                  </h1>
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
              <div className="w-full px-3 border-b border-solid border-color">
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
                      keyboard_arrow_up
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
              <div className="grow overflow-auto guide-prompt">
                <div className="h-full flex data-area">
                  <div className="w-full px-6 py-3 lg:py-4 mt-auto sm:my-auto">
                    <div className="hidden sm:block">
                      <h2 className="text-3xl font-normal leading-tight mb-1 heading-title">
                        Get started
                      </h2>
                      <p
                        className="text-base font-medium"
                        style={{ color: "var(--cl-neutral-70)" }}
                      >
                        Try a sample prompt or add your own input below
                      </p>
                    </div>
                    <Box
                      className="featured-guides"
                      sx={{
                        py: 2,
                      }}
                    >
                      <div className="flex flex-wrap gap-y-2 sm:gap-y-6 -mx-3">
                        <div className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-3 item">
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
                                <p className="text-base sm:text-xl font-medium mb-2 name">
                                  Time complexity
                                </p>
                                <p className="font-medium des">
                                  Identify the time complexity of a function and
                                  optimize it.
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-3 item">
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
                                <p className="text-base sm:text-xl font-medium mb-2 name">
                                  Audio Diarization
                                </p>
                                <p className="font-medium des">
                                  Writing a script in Docker to set up your
                                  environment.
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-3 item">
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
                                <p className="text-base sm:text-xl font-medium mb-2 name">
                                  Recipe creator
                                </p>
                                <p className="font-medium des">
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
                    {selectedOption !== "content" &&
                      selectedOption !== "chatbot" && (
                        <div className="grow mb-2 type-prompt">
                          <textarea
                            ref={textareaRefs.textarea2}
                            value={texts.textarea2}
                            onChange={(e) => handleChangeText(e, "textarea2")}
                            onKeyDown={handleKeyDown}
                            placeholder="Type something"
                            style={{
                              width: "100%",
                              height: "22px",
                              maxHeight: "100px",
                              resize: "none", // Disable manual resizing
                              whiteSpace: "pre-wrap",
                              verticalAlign: "middle",
                            }}
                          />
                        </div>
                      )}
                    {selectedOption === "content" && (
                      <div className="grow type-prompt">
                        <div className="max-h-24 overflow-hidden overflow-y-auto">
                          {selectedRadio === "for-website" && (
                            <div
                              contentEditable
                              className="content-wrap"
                              onChange={onContentPromptChange}
                              onBlur={onContentPromptChange}
                              onKeyDown={handleKeyDown}
                              data-placeholder="Type something"
                              suppressContentEditableWarning={true}
                            >
                              <p>
                                Bạn là chuyên gia trong lĩnh vực &nbsp;
                                <span
                                  className="keyword"
                                  onClick={handleSpanClick}
                                >
                                  [ô tô, bất động sản...]
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
                          )}
                          {selectedRadio === "for-facebook-post" && (
                            <div
                              contentEditable
                              className="content-wrap"
                              onChange={onContentPromptChange}
                              onBlur={onContentPromptChange}
                              onKeyDown={handleKeyDown}
                              data-placeholder="Type something"
                              suppressContentEditableWarning={true}
                            >
                              <p>
                                Bạn là chuyên gia trong lĩnh vực &nbsp;
                                <span
                                  className="keyword"
                                  onClick={handleSpanClick}
                                >
                                  [kinh doanh online, ...]
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
                          )}
                          {selectedRadio === "create-new-template" && (
                            <div className="mb-2">
                              <div
                                contentEditable
                                className="content-wrap"
                                onChange={onContentPromptChange}
                                onBlur={onContentPromptChange}
                                onKeyDown={handleKeyDown}
                                data-placeholder="Type something"
                                suppressContentEditableWarning={true}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {selectedOption === "chatbot" && (
                      <div className="grow type-prompt">
                        <div className="max-h-24 overflow-hidden overflow-y-auto">
                          {selectedRadio === "buy-a-car" && (
                            <div
                              contentEditable
                              className="content-wrap"
                              onChange={onContentPromptChange}
                              onBlur={onContentPromptChange}
                              onKeyDown={handleKeyDown}
                              data-placeholder="Type something"
                              suppressContentEditableWarning={true}
                            >
                              <p>
                                Bạn là chuyên gia trong lĩnh vực &nbsp;
                                <span
                                  className="keyword"
                                  onClick={handleSpanClick}
                                >
                                  [ô tô...]
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
                          )}
                          {selectedRadio === "whats-new" && (
                            <div
                              contentEditable
                              className="content-wrap"
                              onChange={onContentPromptChange}
                              onBlur={onContentPromptChange}
                              onKeyDown={handleKeyDown}
                              data-placeholder="Type something"
                              suppressContentEditableWarning={true}
                            >
                              <p>
                                Bạn là chuyên gia trong lĩnh vực &nbsp;
                                <span
                                  className="keyword"
                                  onClick={handleSpanClick}
                                >
                                  [what's new...]
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
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-x-2 pr-2">
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
                          title="Insert assets such as images, videos, folders, files, or audio"
                        >
                          <MenuButton
                            className="flex items-center justify-center w-9 h-9"
                            sx={{
                              p: 0,
                              border: "none",
                              borderRadius: "100%",
                              minHeight: "36px",
                              color: "var(--cl-primary)",
                              "&:hover": {
                                background: "var(--bg-color)",
                              },
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
                          placement="bottom-start"
                          className="dropdown-menu"
                          sx={{
                            py: 0,
                            bgcolor: "var(--cl-bg-dropdown)",
                            borderColor: "var(--cl-neutral-8)",
                          }}
                        >
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
                                  bgcolor: "var(--cl-neutral-8)",
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
                                color: "var(--cl-primary)",
                                "&:hover": {
                                  background:
                                    "var(--cl-item-dropdown) !important",
                                  color: "var(--cl-primary) !important",
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
                          </MenuItem>
                        </Menu>
                      </Dropdown>
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
                        title="Write text to run prompt (Ctrl + Enter)"
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
                            fill="none"
                          >
                            <path
                              d="M12 21.5C12 20.1833 11.75 18.95 11.25 17.8C10.75 16.6333 10.075 15.625 9.225 14.775C8.375 13.925 7.36667 13.25 6.2 12.75C5.05 12.25 3.81667 12 2.5 12C3.81667 12 5.05 11.75 6.2 11.25C7.36667 10.75 8.375 10.075 9.225 9.225C10.075 8.375 10.75 7.375 11.25 6.225C11.75 5.05833 12 3.81667 12 2.5C12 3.81667 12.25 5.05833 12.75 6.225C13.25 7.375 13.925 8.375 14.775 9.225C15.625 10.075 16.625 10.75 17.775 11.25C18.9417 11.75 20.1833 12 21.5 12C20.1833 12 18.9417 12.25 17.775 12.75C16.625 13.25 15.625 13.925 14.775 14.775C13.925 15.625 13.25 16.6333 12.75 17.8C12.25 18.95 12 20.1833 12 21.5Z"
                              fill="var(--bg-body)"
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
              className={`flex-shrink-0 sidebar ${
                toggleSidebarRight ? "expanded" : "compact"
              }`}
              id="sidebar-right"
            >
              <div
                className="w-full h-full flex flex-col justify-between inner"
                // ref={isMobile ? sideRightRef : refNull}
              >
                <div
                  onClick={() => setToggleSidebarRight(true)}
                  className="overlay-sidebar"
                ></div>
                <div className="h-11 border-b border-solid border-color flex items-center justify-between whitespace-nowrap">
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
                  )}
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
                              // defaultValue="caready"
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
                              <Option value="caready">Caready</Option>
                              <Option value="cosmix">Cosmix</Option>
                              <Option value="humology">Humology</Option>
                            </Select>
                          </FormControl>
                        </div>
                        <div className="item">
                          <p className="flex items-center gap-x-2 mb-2">
                            <span className="material-symbols-outlined">
                              category
                            </span>
                            <span className="font-medium name">Categories</span>
                          </p>
                          <div className="ml-7">
                            <FormControl className="mr-8 mb-5">
                              <Select
                                indicator={<ArrowDropDownOutlined />}
                                className="w-full custom-select"
                                name="select-activities"
                                placeholder="Select Categories"
                                value={selectedOption}
                                // defaultValue="content"
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
                                onChange={handleChangeCategories}
                              >
                                <Option value="content">Content</Option>
                                <Option value="chatbot">Chatbot</Option>
                                <Option value="business">Business</Option>
                                <Option value="scraping">Scraping</Option>
                              </Select>
                            </FormControl>
                            <div className="setting-options">
                              {(selectedOption === "content" ||
                                selectedOption === "chatbot") && (
                                <p className="flex items-center gap-x-2 mb-2">
                                  <span className="font-medium name">
                                    Activities
                                  </span>
                                </p>
                              )}
                              {selectedOption === "content" && (
                                <RadioGroup
                                  name="content"
                                  orientation="vertical"
                                  defaultValue="for-website"
                                  className="flex-col"
                                  value={selectedRadio}
                                >
                                  <Radio
                                    value="for-website"
                                    label="For website"
                                    checked={selectedRadio === "for-website"}
                                    onChange={handleRadioChange}
                                    sx={{
                                      ml: 0,
                                      fontFamily: "var(--font)",
                                      fontSize: "0.875rem",
                                      "&.MuiRadio-root": {
                                        gap: "6px",
                                        color: "var(--cl-primary)",
                                      },
                                      "& .MuiRadio-radio": {
                                        background: "none",
                                        borderColor: "var(--cl-primary)",
                                        ":hover": {
                                          background: "none",
                                        },
                                        "&.Mui-checked .MuiRadio-icon": {
                                          bgcolor: "var(--cl-primary)",
                                        },
                                      },
                                    }}
                                  />
                                  <Radio
                                    value="for-facebook-post"
                                    label="For facebook post"
                                    checked={
                                      selectedRadio === "for-facebook-post"
                                    }
                                    onChange={handleRadioChange}
                                    sx={{
                                      ml: 0,
                                      fontFamily: "var(--font)",
                                      fontSize: "0.875rem",
                                      "&.MuiRadio-root": {
                                        gap: "6px",
                                        color: "var(--cl-primary)",
                                      },
                                      "& .MuiRadio-radio": {
                                        background: "none",
                                        borderColor: "var(--cl-primary)",
                                        ":hover": {
                                          background: "none",
                                        },
                                        "&.Mui-checked .MuiRadio-icon": {
                                          bgcolor: "var(--cl-primary)",
                                        },
                                      },
                                    }}
                                  />
                                  <Radio
                                    value="create-new-template"
                                    label="Create new template"
                                    checked={
                                      selectedRadio === "create-new-template"
                                    }
                                    onChange={handleRadioChange}
                                    sx={{
                                      ml: 0,
                                      fontFamily: "var(--font)",
                                      fontSize: "0.875rem",
                                      "&.MuiRadio-root": {
                                        gap: "6px",
                                        color: "var(--cl-primary)",
                                      },
                                      "& .MuiRadio-radio": {
                                        background: "none",
                                        borderColor: "var(--cl-primary)",
                                        ":hover": {
                                          background: "none",
                                        },
                                        "&.Mui-checked .MuiRadio-icon": {
                                          bgcolor: "var(--cl-primary)",
                                        },
                                      },
                                    }}
                                  />
                                </RadioGroup>
                              )}
                              {selectedOption === "chatbot" && (
                                <RadioGroup
                                  name="chatbot"
                                  orientation="vertical"
                                  defaultValue="buy-a-car"
                                  className="flex-col"
                                >
                                  <Radio
                                    value="buy-a-car"
                                    label="Buy a car"
                                    checked={selectedRadio === "buy-a-car"}
                                    onChange={handleRadioChange}
                                    sx={{
                                      ml: 0,
                                      fontFamily: "var(--font)",
                                      fontSize: "0.875rem",
                                      "&.MuiRadio-root": {
                                        gap: "6px",
                                        color: "var(--cl-primary)",
                                      },
                                      "& .MuiRadio-radio": {
                                        background: "none",
                                        borderColor: "var(--cl-primary)",
                                        ":hover": {
                                          background: "none",
                                        },
                                        "&.Mui-checked .MuiRadio-icon": {
                                          bgcolor: "var(--cl-primary)",
                                        },
                                      },
                                    }}
                                  />
                                  <Radio
                                    value="whats-new"
                                    label="What's new"
                                    checked={selectedRadio === "whats-new"}
                                    onChange={handleRadioChange}
                                    sx={{
                                      ml: 0,
                                      fontFamily: "var(--font)",
                                      fontSize: "0.875rem",
                                      "&.MuiRadio-root": {
                                        gap: "6px",
                                        color: "var(--cl-primary)",
                                      },
                                      "& .MuiRadio-radio": {
                                        background: "none",
                                        borderColor: "var(--cl-primary)",
                                        ":hover": {
                                          background: "none",
                                        },
                                        "&.Mui-checked .MuiRadio-icon": {
                                          bgcolor: "var(--cl-primary)",
                                        },
                                      },
                                    }}
                                  />
                                </RadioGroup>
                              )}
                            </div>
                          </div>
                        </div>
                      </Stack>
                    </Box>
                  </div>
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
                    {!isMobile && (
                      <div>
                        {toggleSidebarRight ? (
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
                                bgcolor: "var(--cl-neutral-20)",
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
                                bgcolor: "var(--cl-neutral-20)",
                                color: "var(--cl-primary)",
                              },
                            }}
                          >
                            <span className="material-symbols-outlined">
                              chevron_left
                            </span>
                          </IconButton>
                        )}
                      </div>
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
    </div>
  );
};

export default Home;