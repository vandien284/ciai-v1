"use client";
import React, { useState, useEffect, useRef,useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import Header from "@/app/components/Header";
import Setting from "@/app/components/Setting";
const url_api = process.env.NEXT_PUBLIC_API;
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
import { 
  Collapse,
  Tooltip,
  Popover,
  ClickAwayListener,
 } from "@mui/material";

import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";
import { PromptGalleriesRespose } from "./ModelsCustom/Respone/PromptGalleriesRespose";
import { GetApiPromptGalleries } from "./Service/ListenToAPI";
const Models = [
  {Name:"ChatGPT 4o-mini", model:"4o-mini"},
  {Name:"Germini 1.5", model:"gemini"},
  {Name:"GPT-test", model:"gpt"},
]

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

  // Collapse Menu
  const [toggleSidebarLeft, setToggleSidebarLeft] = React.useState(true);
  const [toggleSidebarRight, setToggleSidebarRight] = React.useState(true);
  const [promptGalleriesResposes, setPromptGalleriesResposes] = useState<PromptGalleriesRespose[]>([]);
  const [activitie, setActivitie] = useState<IActivitieRespones>();
  const [categorys, setCategorys] = useState<ICategoryRespones[]>([]);
  const [category, setCategory] = useState<ICategoryRespones>();

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
  const [modelChoose, setModelChoose] = React.useState(Models[0].model);


  // Focus Input
  const inputTitleRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalEditHeading) {
      inputTitleRef.current?.focus();
    }
  }, [showModalEditHeading]);

  const type = useRef('content');
  const activitieRef = useRef('')
  const namePrompt = useRef('Untitled prompt')

  const onKeyPressHandler = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setContent(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf.current));  
      if(type.current == '3') {
        fetchPostTypeBusiness(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf.current))
      } else {
        createMessage(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf.current))
      }
      
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
        `${url_api}/api/messages?sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=10`
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
  useEffect(() => {
    GetApiPromptGalleries(setPromptGalleriesResposes);
  }, []);


  const fetchPostTypeBusiness = async (prompt: string) => {
    const uid = generateRandomUid();
    const iframe = createContentBusiness(prompt,activitieRef.current)
    console.log(iframe);
    
    try {
      const response = await axios.post(`${url_api}/api/messages`, {
        data: {
          prompt: prompt,
          type: type.current,
          uid: uid,
          content: [
            {
            "type": "paragraph",
            "children": [
              {
                "text": iframe,
                "type": "text"
              }
            ]
          }
        ]
        },
      });
      if (typeof window !== "undefined" && category) {
        localStorage.setItem("categories",category.id.toString())
      } else if(typeof window !== "undefined") {
        localStorage.setItem("categories",type.current.toString())
      }
  
      if (typeof window !== "undefined" && activitie) {
        localStorage.setItem("activitie", activitie.id.toString());
      } else if(typeof window !== "undefined") {
        localStorage.setItem("activitie",activitieRef.current)
      }
      router.push("/library/" + uid);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }
  
  const createContentBusiness = (message: string,type: string) => {
    const api = `https://analytix.byte.vn/chart-box?message="${message}"&type=${type}`
    let style = `style="width:200px; height: 100px;";`
    if(type == 'chart' || type == 'compare') {
      style= `style="width:100%; height: 592px;";`
    } else {
      style = `style="width:200px; height: 100px;";`
    }
    return `<iframe src='${api}' ${style}></iframe>`
  }

  async function createMessage(prompt: string) {  
    const uid = generateRandomUid();
    try {
      const response = await axios.post(`${url_api}/api/messages`, {
        data: {
          name: namePrompt.current,
          uid: uid,
          prompt: prompt,
          type: type.current,
          content: null
        },
      });

      if (typeof window !== "undefined" && category) {
        localStorage.setItem("categories",category.id.toString())
      } else if(typeof window !== "undefined") {
        localStorage.setItem("categories",type.current.toString())
      }
  
      if (typeof window !== "undefined" && activitie) {
        localStorage.setItem("activitie", activitie.id.toString());
      } else if(typeof window !== "undefined") {
        localStorage.setItem("activitie",activitieRef.current)
      }

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
  

    return `${randomString}`;
  }

  const onClickPromptGalleries = (promptGalleriesRespose: PromptGalleriesRespose) => {
    debugger;
    if (typeof window !== "undefined") {
      localStorage.setItem("activitie", promptGalleriesRespose.attributes.activity.data.id.toString());
    }
    createMessage(promptGalleriesRespose.attributes.prompt);
  }

  const handleCreatePost = () => {
    if(type.current == '3') {
      fetchPostTypeBusiness(content)
    } else {
      createMessage(content)
    }
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
                    <Option value="germini">GPT-test</Option>
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
                      {
                        promptGalleriesResposes.map((promptGalleriesRespose, index) => (
                          <div key={index} className="w-full sm:w-1/2 xl:w-1/2 xxl:w-1/3 px-2 item" onClick={() => onClickPromptGalleries(promptGalleriesRespose)}>
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
                                  {promptGalleriesRespose.attributes.title}
                                </p>
                                <p className="font-medium des">
                                  <DescriptionComponent description={promptGalleriesRespose.attributes.description}/>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      }
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
                          onClick={handleCreatePost}
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
            <Setting 
              toggleSidebarRight={toggleSidebarRight}
              setToggleSidebarRight={setToggleSidebarRight}
              activitieRef={activitieRef}
              type={type}
              setModelChoose={setModelChoose}
              modelChoose={modelChoose}
              setContent={setContent}
              activitie={activitie}
              setActivitie={setActivitie}
              categorys={categorys}
              setCategorys={setCategorys}
              category={category}
              setCategory={setCategory}
              />
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
          <DialogContent className="py-3" >
            <FormControl className="mb-4">
              <FormLabel className="form-label" sx={{ color: "var(--cl-primary)" }}>Prompt name</FormLabel>
              <Input
                type="text"
                className="input"
                defaultValue={namePrompt.current}
                onChange={(e) => namePrompt.current = e.target.value }
                slotProps={{
                  input: {
                    ref: inputTitleRef,
                    autoFocus: true,
                  },
                }}
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel className="form-label" sx={{ color: "var(--cl-primary)" }}>Description</FormLabel>
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

const DescriptionComponent: React.FC<{ description: any[] }> = ({ description }) => {
  const getDescriptionHTML = (description: any[]) =>  {
    return description
      .map((item) => {
        const childrenHTML = item.children
          .map((child: any) => {
            if (child.type === 'link' && child.children) {
              const linkText = child.children.map((linkChild: any) => linkChild.text).join('');
              return `<a href="${child.url}" target="_blank">${linkText}</a>`;
            }
            
            let textContent = child.text || '';
  
            // Áp dụng các style (bold, italic, underline) nếu có
            if (child.bold) textContent = `<strong>${textContent}</strong>`;
            if (child.italic) textContent = `<em>${textContent}</em>`;
            if (child.underline) textContent = `<u>${textContent}</u>`;
  
            return textContent;
          })
          .join('');
  
        // Kiểm tra loại thẻ (paragraph hoặc heading)
        if (item.type === 'heading') {
          return `<h${item.level}>${childrenHTML}</h${item.level}>`;
        }
        return `<p>${childrenHTML}</p>`;
      })
      .join('');
  } 

  const htmlContent = getDescriptionHTML(description);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
