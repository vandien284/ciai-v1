"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import Header from "@/app/components/Header";
import Setting from "@/app/components/Setting";
import {
  Button,
  IconButton,
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
  Select,
  selectClasses,
  Option
} from "@mui/joy";
import { Tooltip } from "@mui/material";

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
  const viewPort = useViewport();
  const isMobile = typeof window !== "undefined" && viewPort.width <= 1100;

  // React ContentEditable
  const sanitizeConf = useRef({
    allowedTags: ["b", "i", "a", "p", "br"],
    allowedAttributes: { a: ["href"] },
  });
  const [content, setContent] = React.useState("");
  const onContentChange = React.useCallback((evt: any) => {
    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf.current));
  }, [sanitizeConf]);

  // Modal
  const [showModalEditHeading, setShowModalEditHeading] = useState(false);

  // Focus Input
  const inputTitleRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalEditHeading) {
      inputTitleRef.current?.focus();
    }
  }, [showModalEditHeading]);

  const type = useRef('');
  const namePrompt = useRef('Untitled prompt')

  const onKeyPressHandler = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setContent(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf.current));
      createMessage()
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  const hasFetched = useRef(false);
  const [messages, setMessages] = useState(Array<any>);
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://cms.ciai.byte.vn/api/messages?sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=10`
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

  async function createMessage() {
    const uid = generateRandomUid();
    try {
      const response = await axios.post(`https://cms.ciai.byte.vn/api/messages`, {
        data: {
          name: namePrompt.current,
          uid: uid,
          prompt: content,
          type: type.current
        },
      });
      router.push("/library/" + uid);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  function generateRandomUid() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < 28; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];

      if ((i + 1) % 4 === 0 && i !== 27) {
        randomString += "-";
      }
    }


    return `${type.current}-${randomString}`;
  }

  return (
    <div id="app">
      <section className="flex h-full sec-main">
        <Header page="index" data={messages} toggleSidebarLeft={toggleSidebarLeft} setToggleSidebarLeft={setToggleSidebarLeft}></Header>
        <div className="grow flex flex-col h-screen overflow-hidden">
          <nav className="w-full h-16 relative z-50">
            <div className="h-full px-3 lg:px-6 py-3 flex items-center justify-between gap-x-3 border-b border-solid border-gray-300 bar">
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
                        "&:hover": {
                          background: "var(--bg-color)",
                        },
                      }}
                    >
                      <span className="material-symbols-outlined">menu</span>
                    </IconButton>
                  </div>
                )}
                <div className="hidden sm:flex sm:items-center gap-x-2 overflow-hidden">
                  <h1 className="text-2xl font-normal truncate heading-title">
                    {namePrompt.current}
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
              <div className="bar-right">
                {!isMobile && (
                  <div className="flex items-center gap-x-3">
                    {/* <div className="btn-save">
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
                            background: "var(--bg-color)",
                          },
                        }}
                        className="gap-x-1.5 transition font-medium"
                      >
                        <span className="material-symbols-outlined">save</span>
                        Save
                      </Button>
                    </div> */}
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
                        title="Open menu options"
                      >
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
                      </Tooltip>
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
                            pointerEvents: "none",
                            color: '#aaa',
                            "&:hover": {
                              background: "#F6F6F6!important",
                              color: "#000!important",
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
                            pointerEvents: "none",
                            color: '#aaa',
                            "&:hover": {
                              background: "#F6F6F6!important",
                              color: "#000!important",
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
                            "&:hover": {
                              background: "#F6F6F6!important",
                              color: "#000!important",
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
                            "&:hover": {
                              background: "#F6F6F6!important",
                              color: "#000!important",
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
                        "&.MuiIconButton-root:hover": {
                          bgcolor: "var(--bg-color)",
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
              <div className="grow overflow-auto guide-prompt">
                <div className="h-full flex data-area">
                  <div className="w-full px-6 py-3 lg:py-4 mt-auto sm:my-auto">
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
                            href="/library"
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
                        <div className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-2 item">
                          <Link
                            className="w-full h-full"
                            href="/library"
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
                        <div className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-2 item">
                          <Link
                            className="w-full h-full"
                            href="/library"
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
                        title="Write text to run prompt (Enter)"
                      >
                        <button
                          type="button"
                          className="flex items-center justify-center gap-x-2 px-1 md:pl-3 md:pr-5 h-8 md:h-9 rounded-3xl transition text-white font-medium btn-color"
                          onClick={() => createMessage()}
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
            <Setting toggleSidebarRight={toggleSidebarRight} setToggleSidebarRight={setToggleSidebarRight} type={type}></Setting>
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
                defaultValue={namePrompt.current}
                onChange={(e) => namePrompt.current = e.target.value}
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
              onClick={() => {
                setShowModalEditHeading(false);
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
