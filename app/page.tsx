"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Messages, CustomPopover } from "./global";
import {
  MenuOutlined,
  CloseOutlined,
  ChatBubbleOutlineOutlined,
  TocOutlined,
  ShareOutlined,
  SyncOutlined,
  LightbulbOutlined,
  ExploreOutlined,
  KeyboardArrowDown,
  WarningAmber,
  SearchOutlined,
  FolderOutlined,
} from "@mui/icons-material";

import {
  Button,
  IconButton,
  Avatar,
  Select,
  selectClasses,
  Option,
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
  Box,
  Stack,
  RadioGroup,
  Radio,
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
} from "@mui/joy";
import { Tooltip, Popover } from "@mui/material";

import { useOutsideClick } from "outsideclick-react";

import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";
import Header from "./components/Header";

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
  const [toggleSidebar, setToggleSidebar] = React.useState(true);
  const handleClickSidebar = () => {
    setToggleSidebar(!toggleSidebar);
  };

  const [showTypePrompt, setShowTypePrompt] = React.useState(false);
  const [showContentPrompt, setShowContentPrompt] = React.useState(false);
  const handleClickPrompt = () => {
    if (!showTypePrompt) {
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
  const [prompt, setPrompt] = React.useState("");
  const onContentChange = React.useCallback((evt: any) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] },
    };
    setPrompt(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
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

  // Content - Send prompt
  const hasFetched = useRef(false);
  const [messages, setMessages] = useState(Array<Messages>);
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://cms.ciai.byte.vn/api/messages?sort=createdAt:desc`
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

  const handleClickSend = async () => {
    if (prompt != "") {
      const sanitizedPrompt = prompt
        .replace(/^<p>|<\/p>$/g, "")
        .replace(/<\/p><p>/g, ". ");

      await createMessage(sanitizedPrompt);
    }
  };

  function generateRandomUid(length = 12) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];

      if ((i + 1) % 4 === 0 && i !== length - 1) {
        result += "-";
      }
    }

    return result;
  }

  async function createMessage(name: string) {
    const uid = generateRandomUid();
    try {
      const response = axios.post(`https://cms.ciai.byte.vn/api/messages`, {
        data: {
          name: name,
          uid: uid,
          prompt: name,
        },
      });
      router.push("/history/" + uid);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div id="app">
      <section className="flex h-full sec-main">
        <div className="grow flex flex-col h-screen">
          <nav className="w-full bg-white relative z-50">
            <div className="h-full px-6 py-3 flex items-center justify-between bar">
              <div id="nav-logo" className="flex items-center">
                <div className="show-mb btn-click-menu">
                  <IconButton
                    variant="plain"
                    className="w-11 h-11 flex items-center justify-center rounded-full transition hover:bg-gray-200 -ml-3 mr-1"
                    onClick={handleClickSidebar}
                  >
                    {toggleSidebar ? <MenuOutlined /> : <CloseOutlined />}
                  </IconButton>
                </div>
                <a href="/" className="!cursor-pointer">
                  <div className="flex flex-shrink-0 items-center justify-center cursor-pointer logo-wrapper">
                    <Image
                      src="/images/logo.svg"
                      priority
                      alt="CIAI"
                      width={100}
                      height={46}
                    />
                  </div>
                </a>
              </div>
            </div>
          </nav>
          <main className="w-full grow flex flex-col" id="main-content">
            <div className="grow overflow-auto guide-prompt">
              <div className="h-full flex items-center justify-center data-area empty">
                <div className="px-4 container">
                  <h1 className="text-3xl xl:text-4xl font-medium xl:leading-tight text-center heading-title">
                    <span className="inline-block welcome">
                      Unleash Your Creativity
                    </span>
                  </h1>
                  <Box
                    className="featured-guides hidden"
                    sx={{
                      pt: 4,
                      pb: 2,
                    }}
                  >
                    <div className="flex flex-wrap gap-y-4 -mx-2">
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item active">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">What is Real Estate?</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <LightbulbOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">ASDA Information Inquiry</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <ExploreOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">Types of Real Estate</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <LightbulbOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">What is Real Estate?</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <ExploreOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">ASDA Information Inquiry</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <ExploreOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">Types of Real Estate</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <LightbulbOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">What is Real Estate?</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <ExploreOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">ASDA Information Inquiry</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <ExploreOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">Types of Real Estate</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <LightbulbOutlined />
                          </div>
                        </div>
                      </div>
                      <div className="w-2/4 md:w-1/3 xl:w-1/4 px-2 item">
                        <div className="w-full h-full lg:h-44 p-4 bg-color flex flex-col justify-between rounded-xl cursor-pointer box-guide">
                          <div className="grow overflow-auto mb-3">
                            <p className="name">What is Real Estate?</p>
                          </div>
                          <div className="ml-auto w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon">
                            <ExploreOutlined />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Box>
                </div>
              </div>
            </div>
            <div className="py-4 chat-prompt">
              <div className="px-4 container">
                <div
                  className="w-full pb-3 border border-solid border-gray-300 rounded-xl overflow-hidden flex flex-col justify-between actions-prompt"
                  ref={promptRef}
                >
                  <div className="grow overflow-auto pb-3">
                    {!showTypePrompt && (
                      <div className="mt-6 mx-7">
                        <ContentEditable
                          onChange={onContentChange}
                          onBlur={onContentChange}
                          html={prompt}
                          data-placeholder="What do you want to create?"
                          suppressContentEditableWarning={true}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              if (!event.shiftKey) {
                                event.preventDefault();
                                handleClickSend();
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                    {showTypePrompt && (
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                          py: 2.5,
                          bgcolor: "#FAFAFA",
                          position: "relative",
                        }}
                      >
                        <IconButton
                          variant="plain"
                          size="sm"
                          className="top-1 right-1 z-10"
                          onClick={() => {
                            setShowTypePrompt(false);
                            setShowContentPrompt(false);
                          }}
                          sx={{
                            position: "absolute",
                            borderRadius: "50%",
                          }}
                        >
                          <CloseOutlined />
                        </IconButton>
                        <List
                          sx={{
                            maxWidth: { xs: "100%", sm: "35%", md: "25%" },
                            fontFamily: "var(--font)",
                            fontSize: "0.875rem",
                            px: 1.5,
                            py: 0,
                            flexDirection: { xs: "row", sm: "column" },
                            flexWrap: { xs: "wrap", sm: "nowrap" },
                          }}
                          className="flex-shrink-0"
                        >
                          <ListItem
                            sx={{
                              p: 0,
                              mb: 0.25,
                              display: "block",
                              minHeight: "inherit",
                            }}
                            className="w-2/4 sm:w-full"
                          >
                            <Button
                              variant="plain"
                              startDecorator={<FolderOutlined />}
                              sx={{
                                fontFamily: "var(--font)",
                                color: "var(--cl-main)",
                                fontWeight: 400,
                                width: "100%",
                                justifyContent: "flex-start",
                                px: 1,
                                py: 0,
                                mb: 1.25,
                                minHeight: "inherit",
                                background: "none !important",
                              }}
                              className="cate active"
                            >
                              Content/SEO
                            </Button>
                          </ListItem>
                          <ListItem
                            sx={{
                              p: 0,
                              mb: 0.25,
                              display: "block",
                              minHeight: "inherit",
                            }}
                            className="w-2/4 sm:w-full"
                          >
                            <Button
                              variant="plain"
                              startDecorator={<FolderOutlined />}
                              sx={{
                                fontFamily: "var(--font)",
                                color: "var(--cl-main)",
                                fontWeight: 400,
                                width: "100%",
                                justifyContent: "flex-start",
                                px: 1,
                                py: 0,
                                mb: 1.25,
                                minHeight: "inherit",
                                background: "none !important",
                              }}
                              className="cate"
                            >
                              Article generator
                            </Button>
                          </ListItem>
                          <ListItem
                            sx={{
                              p: 0,
                              mb: 0.25,
                              display: "block",
                              minHeight: "inherit",
                            }}
                            className="w-2/4 sm:w-full"
                          >
                            <Button
                              variant="plain"
                              startDecorator={<FolderOutlined />}
                              sx={{
                                fontFamily: "var(--font)",
                                color: "var(--cl-main)",
                                fontWeight: 400,
                                width: "100%",
                                justifyContent: "flex-start",
                                px: 1,
                                py: 0,
                                mb: 1.25,
                                minHeight: "inherit",
                                background: "none !important",
                              }}
                              className="cate"
                            >
                              Scraping article
                            </Button>
                          </ListItem>
                          <ListItem
                            sx={{
                              p: 0,
                              mb: 0.25,
                              display: "block",
                              minHeight: "inherit",
                            }}
                            className="w-2/4 sm:w-full"
                          >
                            <Button
                              variant="plain"
                              startDecorator={<FolderOutlined />}
                              sx={{
                                fontFamily: "var(--font)",
                                color: "var(--cl-main)",
                                fontWeight: 400,
                                width: "100%",
                                justifyContent: "flex-start",
                                px: 1,
                                py: 0,
                                mb: 1.25,
                                minHeight: "inherit",
                                background: "none !important",
                              }}
                              className="cate"
                            >
                              Social media
                            </Button>
                          </ListItem>
                          <ListItem
                            sx={{
                              p: 0,
                              mb: 0.25,
                              display: "block",
                              minHeight: "inherit",
                            }}
                            className="w-2/4 sm:w-full"
                          >
                            <Button
                              variant="plain"
                              startDecorator={<FolderOutlined />}
                              sx={{
                                fontFamily: "var(--font)",
                                color: "var(--cl-main)",
                                fontWeight: 400,
                                width: "100%",
                                justifyContent: "flex-start",
                                px: 1,
                                py: 0,
                                mb: 1.25,
                                minHeight: "inherit",
                                background: "none !important",
                              }}
                              className="cate"
                            >
                              Blog outline
                            </Button>
                          </ListItem>
                          <ListItem
                            sx={{
                              p: 0,
                              mb: 0.25,
                              display: "block",
                              minHeight: "inherit",
                            }}
                            className="w-2/4 sm:w-full"
                          >
                            <Button
                              variant="plain"
                              startDecorator={<FolderOutlined />}
                              sx={{
                                fontFamily: "var(--font)",
                                color: "var(--cl-main)",
                                fontWeight: 400,
                                width: "100%",
                                justifyContent: "flex-start",
                                px: 1,
                                py: 0,
                                mb: 1.25,
                                minHeight: "inherit",
                                background: "none !important",
                              }}
                              className="cate"
                            >
                              Social Media
                            </Button>
                          </ListItem>
                        </List>
                        <div className="grow flex flex-col sm:flex-row items-start">
                          <Divider
                            orientation="vertical"
                            className="hidden sm:block h-full"
                          />
                          <Divider
                            orientation="horizontal"
                            className="sm:hidden w-full"
                            sx={{ mb: 3 }}
                          />
                          <List
                            orientation="horizontal"
                            sx={{
                              fontFamily: "var(--font)",
                              fontSize: "0.875rem",
                              bgcolor: "#FAFAFA",
                              px: 1.5,
                              py: 0,
                            }}
                            className="flex-wrap"
                          >
                            <ListItem
                              sx={{
                                mb: 0.5,
                                display: "block",
                                minHeight: "inherit",
                              }}
                              className="w-2/4 lg:w-1/3"
                            >
                              <Button
                                variant="plain"
                                sx={{
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-main)",
                                  fontWeight: 400,
                                  p: 0,
                                  minHeight: "inherit",
                                  background: "none !important",
                                }}
                                onClick={handleClickContentPrompt}
                                className="text-left sub-cate active"
                              >
                                Article Generator
                              </Button>
                            </ListItem>
                            <ListItem
                              sx={{
                                mb: 0.5,
                                display: "block",
                                minHeight: "inherit",
                              }}
                              className="w-2/4 lg:w-1/3"
                            >
                              <Button
                                variant="plain"
                                sx={{
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-main)",
                                  fontWeight: 400,
                                  p: 0,
                                  minHeight: "inherit",
                                  background: "none !important",
                                }}
                                onClick={handleClickContentPrompt}
                                className="text-left"
                              >
                                Backlink Outreach Email
                              </Button>
                            </ListItem>
                            <ListItem
                              sx={{
                                mb: 0.5,
                                display: "block",
                                minHeight: "inherit",
                              }}
                              className="w-2/4 lg:w-1/3"
                            >
                              <Button
                                variant="plain"
                                sx={{
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-main)",
                                  fontWeight: 400,
                                  p: 0,
                                  minHeight: "inherit",
                                  background: "none !important",
                                }}
                                onClick={handleClickContentPrompt}
                                className="text-left"
                              >
                                Blog Outline
                              </Button>
                            </ListItem>
                            <ListItem
                              sx={{
                                mb: 0.5,
                                display: "block",
                                minHeight: "inherit",
                              }}
                              className="w-2/4 lg:w-1/3"
                            >
                              <Button
                                variant="plain"
                                sx={{
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-main)",
                                  fontWeight: 400,
                                  p: 0,
                                  minHeight: "inherit",
                                  background: "none !important",
                                }}
                                onClick={handleClickContentPrompt}
                                className="text-left"
                              >
                                Blog Post
                              </Button>
                            </ListItem>
                            <ListItem
                              sx={{
                                mb: 0.5,
                                display: "block",
                                minHeight: "inherit",
                              }}
                              className="w-2/4 lg:w-1/3"
                            >
                              <Button
                                variant="plain"
                                sx={{
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-main)",
                                  fontWeight: 400,
                                  p: 0,
                                  minHeight: "inherit",
                                  background: "none !important",
                                }}
                                onClick={handleClickContentPrompt}
                                className="text-left"
                              >
                                Customer Case Study
                              </Button>
                            </ListItem>
                            <ListItem
                              sx={{
                                mb: 0.5,
                                display: "block",
                                minHeight: "inherit",
                              }}
                              className="w-2/4 lg:w-1/3"
                            >
                              <Button
                                variant="plain"
                                sx={{
                                  fontFamily: "var(--font)",
                                  color: "var(--cl-main)",
                                  fontWeight: 400,
                                  p: 0,
                                  minHeight: "inherit",
                                  background: "none !important",
                                }}
                                onClick={handleClickContentPrompt}
                                className="text-left"
                              >
                                FAQ Generator
                              </Button>
                            </ListItem>
                          </List>
                        </div>
                      </Stack>
                    )}
                    {showContentPrompt && (
                      <div className="px-6 py-3">
                        <div
                          contentEditable
                          data-placeholder="What do you want to create?"
                          className="content-wrap"
                          suppressContentEditableWarning={true}
                        >
                          <p>
                            Bạn là chuyên gia trong lĩnh vực &nbsp;
                            <span className="keyword" onClick={handleSpanClick}>
                              [ô tô, bất động sản...]
                            </span>
                            &nbsp;tại khu vực&nbsp;
                            <span className="keyword" onClick={handleSpanClick}>
                              [Sài Gòn, Hà Nội...]
                            </span>
                            &nbsp;hãy tạo bài viết với đề tài&nbsp;
                            <span className="keyword" onClick={handleSpanClick}>
                              [Toyota Yaris Cross Hybrid 2024]
                            </span>
                            &nbsp;.
                          </p>
                          <p>
                            Bài viết sẽ có giọng văn&nbsp;
                            <span className="keyword" onClick={handleSpanClick}>
                              [chuyên nghiệp, dễ hiểu...]
                            </span>
                            &nbsp;và số lượng từ là&nbsp;
                            <span className="keyword" onClick={handleSpanClick}>
                              [400, 600...]
                            </span>
                            &nbsp;
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full flex items-center justify-between mt-3 pr-3">
                    <Button
                      variant="plain"
                      startDecorator={<SearchOutlined />}
                      sx={{
                        fontFamily: "var(--font)",
                        color: "var(--cl-main)",
                        fontWeight: "500",
                        pl: 1,
                        ml: 2,
                      }}
                      onClick={handleClickPrompt}
                    >
                      Browse Prompt
                    </Button>
                    <Tooltip title="Send">
                      <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 rounded-xl transition hover:bg-gray-200 btn-send"
                        onClick={handleClickSend}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 20V4L22 12L3 20ZM5 17L16.85 12L5 7V10.5L11 12L5 13.5V17ZM5 17V12V7V10.5V13.5V17Z"
                            fill="#65558F"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default Home;
