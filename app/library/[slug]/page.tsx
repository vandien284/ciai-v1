"use client";
import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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
  Dropdown,
  Menu,
  MenuItem,
  MenuButton,
  Select,
  selectClasses,
  Option,
  Chip,
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


const Detail = () => {
  const router = useRouter();
  const { slug } = useParams();

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

  const [showEditPrompt, setShowEditPrompt] = React.useState(0);
  const [showEditContent, setShowEditContent] = React.useState(0);

  // Toggle role
  const [showRole, setShowRole] = React.useState(true);

  // React ContentEditable
  const sanitizeConf = useRef({
    allowedTags: ["b", "i", "a", "p", "br"],
    allowedAttributes: { a: ["href"] },
  });
  const [content, setContent] = React.useState("");
  const onContentChange = React.useCallback((evt: any) => {
    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf.current));
  }, []);

  // Modal
  const [showModalEditHeading, setShowModalEditHeading] = useState(false);

  // Focus Input
  const inputTitleRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalEditHeading) {
      inputTitleRef.current?.focus();
    }
  }, [showModalEditHeading]);

  // handle features
  const [activities, setActivities] = useState('');
  const type = useRef('content');
  const namePrompt = useRef('Untitled prompt')
  const [posts, setPosts] = useState(Array<any>);
  const message = useRef(0);
  const hasFetched = useRef(false);
  const [messages, setMessages] = useState(Array<any>);
  const [isPost, setIdPost] = useState(0);
  // setup api get content
  const setupApiContent = (prompt: string, type: string) => {
    const newPrompt = prompt.replace(/<br\s*\/?>/gi, '.');
    let api = '';
    let body = {}
    if (type == 'content') {
      api = 'https://gelding-mature-severely.ngrok-free.app/api/content';
      body = {
        chat_id: slug, text: newPrompt
      }
    } else if (type == 'url') {
      api = 'https://gelding-mature-severely.ngrok-free.app/api/vn';
      body = {
        url: prompt
      }
    } else if (type == 'chatbox') {
      api = 'https://sailfish-discrete-mayfly.ngrok-free.app/ask';
      body = {
        chat_id: slug,
        type: type,
        question: newPrompt
      }
    } else if (type == 'link' || type == 'multi') {
      api = 'https://hook.eu2.make.com/hy7791yv6fy5qtq4xh1t5o0kkvvx1jww'
      body = {
        uid: slug,
        link: newPrompt,
        type: type
      }
    }
    return { api, body };
  }


  // api get content
  const fetchContent = async (prompt: string, type: string) => {
    const { api, body } = setupApiContent(prompt, type)
    try {
      const response = await axios.post(api, body);
      return response.data.result;
    } catch (e) {
      console.log(e);
    }
  }

  // api create post
  async function fetchPost(prompt: string, message: number, type: string) {
    try {
      const response = await axios.post(`https://cms.ciai.byte.vn/api/posts`, {
        data: {
          prompt: prompt,
          message: message,
          type: type
        },
      });

      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  // api update post
  const fetchNamePost = async (id: number, prompt: string) => {
    try {

    } catch (e) {
      console.log(e);
    }
  }

  const fetchContentPost = async (id: number, content: any) => {
    try {
      const response = await axios.put(
        `https://cms.ciai.byte.vn/api/posts/${id}`,
        {
          data: {
            content: [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": content,
                    "type": "text"
                  }
                ]
              }
            ]
          }
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  // api update message
  const fetchMessage = async (name: string) => {
    try {

    } catch (e) {
      console.log(e);
    }
  }

  const checkPosts = useCallback(async (value: Array<any>) => {
    if (!value[0].attributes.content) {
      const content = await fetchContent(value[0].attributes.prompt, value[0].attributes.type);
      if (content) {
        const data = await fetchContentPost(value[0].id, content);
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === value[0].id ? data.data : p))
        );
      } else {
        return;
      }
    }
  }, []);

  // api get list post
  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://cms.ciai.byte.vn/api/messages/${slug}?populate=*`
      );
      setPosts(response.data.data.attributes.posts.data);
      message.current = response.data.data.id;
      namePrompt.current = response.data.data.attributes.name
      await checkPosts(response.data.data.attributes.posts.data);
    } catch (e) {
      console.log(e);
    }
  }, [checkPosts, slug]);

  // api get list message
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
      fetchPosts();
      hasFetched.current = true;
    }
  }, [fetchMessages, fetchPosts]);

  // activity content format: chatbox + content 
  function formatContent(content: any) {
    const formattedContent = content
      .replace(/^\s*\* /gm, '')
      .replace(/https\s*\/\//g, 'https://')
      .replace(/### (.+?)(?:[.#*#]|\n|$)/g, '<h3>$1</h3>')
      .replace(/## (.+?)(?:[.#*#]|\n|$)/g, '<h2>$1</h2>')
      .replace(/\*\*([^*]+)\*\*/g, '<span style="font-weight:bolder">$1</span>')
      .replace(/\n/g, '<br>')
      .replace(/\*:\s?([^*]+)\*/g, '<div style="outline: 1px solid; padding: 5px;">$1</div>')
      .replace(
        /!\[([^[]+)]\((https[^\)]+)\)/g,
        '<img src="$2" alt="$1" style="width:100%; margin: 10px 0;" />'
      )
      .replace(
        /\[([^\]]+)\]\((https[^\)]+)\)/g,
        '$1[Link bài viết](<a href="$2" target="_blank" style="color: blue">$2</a>)'
      )
      .replace(/(^|[\s\n])[*#]+(?!\w)/g, '<br>');

    return formattedContent;
  }

  // activity content format: scraping 
  const renderContent = (content: any) => {
    const elements = content.split('\n').map((line: any, index: any) => {

      const pTagMatch = line.match(/<p[^>]*>/);

      if (pTagMatch) {
        return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
      }

      const strongTextMatch = line.match(/\*\*(.*?)\*\*/);
      const linkMatch = line.match(/(https?:\/\/[^\s]+\.html)/);

      if (strongTextMatch && linkMatch) {
        const strongText = strongTextMatch[1];
        const url = linkMatch[0];
        const textBeforeStrong = line.split(strongTextMatch[0])[0];
        const textAfterStrong = line.split(strongTextMatch[0])[1].split(url)[0];
        const textAfterLink = line.split(url)[1];

        return (
          <p key={index}>
            {textBeforeStrong}
            <strong>{strongText}</strong>
            {textAfterStrong}
            <a href={url} target="_blank" style={{ color: 'blue' }}>
              {url}
            </a>
            {textAfterLink}
          </p>
        );
      }

      if (strongTextMatch) {
        const strongText = strongTextMatch[1];
        const textBefore = line.split(strongTextMatch[0])[0];
        const textAfter = line.split(strongTextMatch[0])[1];

        return (
          <p key={index}>
            {textBefore}
            <strong>{strongText}</strong>
            {textAfter}
          </p>
        );
      }

      if (linkMatch) {
        const url = linkMatch[0];
        const textBeforeLink = line.split(url)[0];
        const textAfterLink = line.split(url)[1];

        return (
          <p key={index}>
            {textBeforeLink}
            <a href={url} target="_blank" style={{ color: 'blue' }}>
              {url}
            </a>
            {textAfterLink}
          </p>
        );
      }

      const iframeMatch = line.match(/<iframe src="([^"]+)"[^>]*><\/iframe>/);
      if (iframeMatch) {
        return (
          <iframe
            key={index}
            src={iframeMatch[1]}
            style={{ width: '100%', height: '592px' }}
          />
        );
      }

      return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
    });

    return elements;
  };

  // update name message
  const handleUpdateNameMessage = async () => {
  }

  // create new post
  const handleCreatePost = async (value: string) => {
    if (value != "") {
      const post = await fetchPost(value, message.current, type.current);
      if (post) {
        setContent("")
        setPosts((prevPosts) => [...prevPosts, post.data]);
        const content = await fetchContent(value, type.current);
        if (content) {
          const newPost = await fetchContentPost(post.data.id, content);
          if (newPost) {
            setPosts((prevPosts) =>
              prevPosts.map((p) => (p.id == newPost.data.id ? newPost.data : p))
            );
          }
        }
      }
    }
  }

  // key press enter
  const onKeyPressHandler = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setContent(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf.current));
      handleCreatePost(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf.current));
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  // copy content
  const handleCopyContent = (content: string) => {
    const formatted = formatContent(content);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formatted;
    document.body.appendChild(tempDiv);

    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);

      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Không thể sao chép:", err);
      }

      document.body.removeChild(tempDiv);
    }
  }

  const resultAreaRef = useRef(null);
  const latestResultItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (latestResultItemRef.current) {
      latestResultItemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [posts]);

  return (
    <div id="app">
      <section className="flex h-full sec-main">
        <Header page="library" data={messages} toggleSidebarLeft={toggleSidebarLeft} setToggleSidebarLeft={setToggleSidebarLeft}></Header>
        <div className="grow flex flex-col h-screen overflow-hidden">
          <nav className="w-full h-16  relative z-50">
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
                    <div className="btn-save">
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
                    </div>
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
              <div className="grow overflow-auto detail-post">
                <div className="pt-4 px-4">
                  <div className="result-area" ref={resultAreaRef}>
                    {
                      posts.map((item, index) => (
                        <div className="result-item" key={index}>
                          <div
                            className={`${showEditPrompt != item.id
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
                                {showEditPrompt == item.id && (
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
                                {showEditPrompt != item.id && (
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
                                      onClick={() => setShowEditPrompt(item.id)}
                                    >
                                      <span className="material-symbols-outlined">
                                        edit
                                      </span>
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {showEditPrompt == item.id && (
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
                                      onClick={() => setShowEditPrompt(0)}
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
                            {showEditPrompt != item.id && (
                              <div className="px-2 leading-relaxed word-break info-prompt"
                                dangerouslySetInnerHTML={{
                                  __html: item.attributes.prompt,
                                }}>

                              </div>
                            )}
                            {showEditPrompt == item.id && (
                              <div className="px-2 leading-relaxed word-break edit-prompt"
                              >
                                <div
                                  contentEditable
                                  data-placeholder="What do you want to create?"
                                  dangerouslySetInnerHTML={{
                                    __html: item.attributes.prompt,
                                  }}
                                >
                                </div>
                              </div>
                            )}
                          </div>
                          {/* single-role */}
                          {/* <div
                            className={`${!showEditPrompt
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
                          </div> */}
                          {/* single-role */}
                          <div
                            className={`${showEditContent != item.id
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
                                {showEditContent == item.id && (
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
                                {showEditContent != item.id && (
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
                                      onClick={() => setShowEditContent(item.id)}
                                    >
                                      <span className="material-symbols-outlined">
                                        edit
                                      </span>
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {showEditContent == item.id && (
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
                                      onClick={() => setShowEditContent(0)}
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
                            <div className="px-2 leading-relaxed word-break info-prompt"
                            >
                              {
                                item.attributes.content && renderContent(item.attributes.content[0].children[0].text)
                              }
                            </div>
                          </div>
                          {/* single-role */}
                        </div>
                      ))
                    }

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
                          onClick={() => handleCreatePost(content)}
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

export default Detail;