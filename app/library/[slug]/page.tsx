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
import {
  Collapse,
  Tooltip,
  Popover,
  Popper,
  ClickAwayListener,
} from "@mui/material";

import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";
import { setModel } from "@/app/store/slice";

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

const url_api_cms = process.env.NEXT_PUBLIC_API;
const Detail = () => {
  const router = useRouter();
  const { slug } = useParams();

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

  const [showEditPrompt, setShowEditPrompt] = React.useState(0);
  const [showEditContent, setShowEditContent] = React.useState(0);
  const [modelChoose, setModelChoose] = React.useState(Models[0].model);

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

  const type = useRef('content');
  const activitieRef = useRef('')
  const nameMessage = useRef('Untitled prompt')
  const [posts, setPosts] = useState(Array<any>);
  const message = useRef(0);
  const hasFetched = useRef(false);
  const [messages, setMessages] = useState(Array<any>);
  const [newPrompt, setNewPrompt] = useState('');
  const [newContent, setNewContent] = useState('');

  const setTypeCategories = (value: string) => {
    switch(value) {
      case "1":
        type.current = 'content'
        break;
      case "2":
        type.current = 'chatbot'
        break;
      case "3":
        type.current = 'business'
        break;
      case "4":
        type.current = 'scraping'
        break;
    }
  }

  const setupApiContent = (prompt: string, type: string, model: string) => {
    const newPrompt = prompt.replace(/<br\s*\/?>/gi, '.');
    let api = '';
    let body = {}
    if (type == 'content') {
      api = 'https://gelding-mature-severely.ngrok-free.app/api/content';
      body = {
        chat_id: slug, text: newPrompt,
        model: modelChoose
      }
    } else if (type == 'url') {
      api = 'https://gelding-mature-severely.ngrok-free.app/api/vn';
      body = {
        url: prompt,
        model: modelChoose
      }
    } else if (type == 'chatbot') {
      api = 'https://sailfish-discrete-mayfly.ngrok-free.app/ask';
      body = {
        chat_id: slug,
        type: type,
        question: newPrompt,
        model: modelChoose
      }
    } else if (type == 'link' || type == 'multi') {
      api = 'https://hook.eu2.make.com/hy7791yv6fy5qtq4xh1t5o0kkvvx1jww'
      body = {
        uid: slug,
        link: newPrompt,
        type: type,
        model: modelChoose
      }
    } 
    return { api, body };
  }

  const fetchContent = async (prompt: string, type: string, model: string) => {
    const { api, body } = setupApiContent(prompt, type, model)
    try {
      const response = await axios.post(api, body);
      return response.data.result;
    } catch (e) {
      console.log(e);
    }
  }

  const fetchPost = async (prompt: string, message: number, type: string, content: any) => {
    try {
      const response = await axios.post(`${url_api_cms}/api/posts`, {
        data: {
          prompt: prompt,
          message: message,
          type: type,
          content: content
        },
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  const fetchPromptPost = async (id: number, prompt: string) => {
    try {
      const response = await axios.put(
        `${url_api_cms}/api/posts/${id}`,
        {
          data: {
            prompt: prompt
          }
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  const fetchContentPost = async (id: number, content: any) => {
    const bodyContent = content ? [
      {
        "type": "paragraph",
        "children": [
          {
            "text": content,
            "type": "text"
          }
        ]
      }
    ] : content;

    try {
      const response = await axios.put(
        `${url_api_cms}/api/posts/${id}`,
        {
          data: {
            content: bodyContent
          }
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  const fetchDeletePost = async (id: number) => {
    try {
      const response = await axios.delete(`${url_api_cms}/api/posts/${id}`);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  const fetchMessage = async (name: string) => {
    try {
      const response = await axios.put(`${url_api_cms}/api/messages/${message.current}`, {
        data: {
          name: name
        }
      })
      return response
    } catch (e) {
      console.log(e);
    }
  }

  const checkPosts = async (value: Array<any>) => {
    let model = '4o-mini'
    if (typeof window !== "undefined") {
      model = localStorage.getItem("model") || '4o-mini';
      setModelChoose(model);
    }
    setTypeCategories(value[0].attributes.type)
    
    if (!value[0].attributes.content) {
      const content = await fetchContent(value[0].attributes.prompt, type.current, model);
      if (content) {
        const data = await fetchContentPost(value[0].id, content);
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === value[0].id ? data.data : p))
        );
      } else {
        return;
      }
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url_api_cms}/api/messages/${slug}?populate=*`
      );
      setPosts(response.data.data.attributes.posts.data);
      message.current = response.data.data.id;
      nameMessage.current = response.data.data.attributes.name
      if(response.data.data.attributes.posts.data.length == 1) {
        await checkPosts(response.data.data.attributes.posts.data);
      }
    } catch (e) {
      console.log(e);
    }
  }, [slug]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url_api_cms}/api/messages?sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=10`
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

  function formatContent(content: any) {
    const formattedContent = content
      .replace(/^\s*\* /gm, '')
      .replace(/https\s*\/\//g, 'https://')
      .replace(/####\s*(.+)/g, '<h3>$1</h3>')
      .replace(/###\s*(.+)/g, '<h3>$1</h3>')
      .replace(/##\s*(.+)/g, '<h2>$1</h2>')
      .replace(/\*\*([^*]+)\*\*/g, '<span style="font-weight:bolder">$1</span>')
      .replace(/\n/g, '<br>')
      .replace(/\*:\s?([^*]+)\*/g, '<div style="outline: 1px solid; padding: 5px;">$1</div>')
      .replace(
        /!\[([^[]+)]\((https[^\)]+)\)/g,
        '<img src="$2" alt="$1" style="width:100%; margin: 10px 0;" />'
      )
      .replace(
        /\[([^\]]+)\]\((https[^\)]+)\)/g,
        '<a href="$2" target="_blank" style="color: blue">$1</a>'
      )
      .replace(/(^|[\s\n])[*#]+(?!\w)/g, '<br>');

    return formattedContent;
  }

  const renderIframe = (content: string) => {
    const iframeRegex = /<iframe\s+src=(["'])(.*?)\1(?:[^>]*style=(["'])(.*?)\3)?[^>]*><\/iframe>/g;
    const iframeMatches = [];
    let match;
  
    while ((match = iframeRegex.exec(content)) !== null) {
      iframeMatches.push(match);
    }
  
    return iframeMatches.length
      ? iframeMatches.map((iframeMatch, index) => {
          const src = iframeMatch[2]; 
          const styleString = iframeMatch[4] || '';
  
          const styleObject = styleString
            ? Object.fromEntries(
                styleString
                  .split(';')
                  .filter(Boolean)
                  .map((rule) => {
                    const [property, value] = rule.split(':').map((str) => str.trim());
                    return [property.replace(/-([a-z])/g, (_, char) => char.toUpperCase()), value];
                  })
              )
            : {};
  
          return (
            <iframe
              key={index}
              src={src}
              style={styleObject}
            />
          );
        })
      : null;
  };
  
  

  const renderContent = (content: any) => {
    
    const formattedContent = formatContent(content);
  
    const parts = formattedContent.split(/(<iframe[^>]*>.*?<\/iframe>)/g);
    

    return (
      <div>
        {parts.map((part: string, index: React.Key | null | undefined) => {
          if (part.match(/<iframe[^>]*>.*?<\/iframe>/)) {
            return renderIframe(part);
          }
  
          return <div key={index} dangerouslySetInnerHTML={{ __html: part }}></div>;
        })}
      </div>
    );
  };

  const handleUpdateNameMessage = async () => {
    await fetchMessage(nameMessage.current);

    const messageIndex = messages.findIndex((item) => item.id === message.current);
      if (messageIndex === -1) return;

      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        attributes: {
          ...updatedMessages[messageIndex].attributes,
          name: nameMessage.current,
        },
      };

      setMessages(updatedMessages);
  }

  const createContentBusiness = (message: string, type: string) => {
    const api = `https://analytix.byte.vn/chart-box?message="${message}"&type=${type}`
    let style = `style="width:200px; height: 100px;";`
    if (type == 'chart' || type == 'compare' ) {
      style = `style="width: 100%; height: 592px;";`
    } else if(type =='searching') {
      style = `style="width: 100%; height: 200px;";`
    } else {
      style = `style="width: 200px; height: 100px;";`
    }
    return [
      {
        "type": "paragraph",
        "children": [
          {
            "text": `<iframe src='${api}' ${style}></iframe>`,
            "type": "text"
          }
        ]
      }
    ]
  }

  const handleCreatePost = async (value: string, model: string) => {
    if (value != "") {
      setTypeCategories(type.current)
      
      const content = type.current == 'business' ? createContentBusiness(value, activitieRef.current) : null;
      
      const post = await fetchPost(value, message.current, type.current, content);
      if (post) {
        setContent("")
        setPosts((prevPosts) => [...prevPosts, post.data]);
        if (type.current != 'business') {
          const content = await fetchContent(value, type.current, model);
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
  }

  const handleUpdateNamePost = async (id: number, value: string) => {
    if (value != '') {
      const postIndex = posts.findIndex((post) => post.id === id);
      if (postIndex === -1) return;
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        attributes: {
          ...updatedPosts[postIndex].attributes,
          prompt: value
        },
      };
      setPosts([...updatedPosts]);
      await fetchPromptPost(id, value);
      setNewPrompt("");
    }
  }

  const handleUpdateContentPost = async (id: number, value: string) => {
    if (value != '') {
      const postIndex = posts.findIndex((post) => post.id === id);
      if (postIndex === -1) return;
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        attributes: {
          ...updatedPosts[postIndex].attributes,
          content: [
            {
              "type": "paragraph",
              "children": [
                {
                  "text": value,
                  "type": "text"
                }
              ]
            }
          ]
        },
      };
      setPosts([...updatedPosts]);
      await fetchContentPost(id, value);
      setNewContent("");
    }
  }

  const handleDeleteContentPost = async (id: number) => {
    await fetchContentPost(id, null);
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex === -1) return;
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = {
      ...updatedPosts[postIndex],
      attributes: {
        ...updatedPosts[postIndex].attributes,
        content: null
      },
    };
    setPosts([...updatedPosts]);
  }

  const handleDeletePost = async (id: number) => {
    await fetchDeletePost(id);
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex !== -1) {
      const updatedPosts = [...posts];
      updatedPosts.splice(postIndex, 1);
      setPosts(updatedPosts);
    }
  }

  const onKeyPressHandler = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setContent(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf.current));
      handleCreatePost(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf.current), modelChoose);
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("activitie");
      activitieRef.current = storedData || '1'
      if(storedData && categorys.length > 0)
      {
        const foundCategory = categorys.find(category => 
          category.attributes.activities.data.some(activity => activity.id.toString() === storedData)
        );
        setCategory(foundCategory);
        type.current = foundCategory?.id.toString() || '1';
        const temp = categorys
        .flatMap(category => category.attributes.activities.data)
        .find(activity => activity.id.toString() === storedData);
        setActivitie(temp);
        // localStorage.clear();
      }
    }
  }, [categorys]);

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
                    {nameMessage.current}
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
                  {/* <Select
                    indicator={<ArrowDropDownOutlined />}
                    className="w-full custom-select"
                    name="select-models"
                    placeholder="Select Models"
                    value={modelChoose}
                    onChange={onChangeModel}
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
                    {
                      Models.map((model, index) => (
                          <Option key={index} value={model.model}>{model.Name}</Option>
                      ))
                    }
                  </Select> */}
                </FormControl>
              </div>
              <div className="bar-right">
                {!isMobile && (
                  <div className="flex items-center gap-x-3">
                    <div className="btn-save">
                      {/* <Button
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
                      </Button> */}
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
              <div className="grow overflow-auto detail-post">
                <div className="pt-4 px-4">
                  <div className="result-area" ref={resultAreaRef}>
                    {
                      posts.map((item, index) => (
                        <div className="result-item" key={index} ref={index === posts.length - 1 ? latestResultItemRef : null}>
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
                                    title="Switch to User"
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
                                    title="Switch to Model"
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
                                        color: "var(--cl-neutral-80)",
                                        ":hover": {
                                          background: "var(--cl-neutral-8)",
                                          color: "var(--cl-neutral-80)",
                                        },
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
                                        color: "var(--cl-neutral-80)",
                                        ":hover": {
                                          background: "var(--cl-neutral-8)",
                                          color: "var(--cl-neutral-80)",
                                        },
                                      }}
                                      className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                      onClick={() => {
                                        setShowEditPrompt(0)
                                        handleUpdateNamePost(item.id, newPrompt);
                                      }}
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
                                      color: "var(--cl-neutral-80)",
                                      ":hover": {
                                        background: "var(--cl-neutral-8)",
                                        color: "var(--cl-neutral-80)",
                                      },
                                    }}
                                    className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                    onClick={() => handleDeletePost(item.id)}
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
                              >
                                {
                                  renderContent(item.attributes.prompt)
                                }
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
                                  onChange={(e) =>
                                    setNewPrompt(e.currentTarget.innerHTML)
                                  }
                                  onBlurCapture={(e) =>
                                    setNewPrompt(e.currentTarget.innerHTML)
                                  }
                                >
                                </div>
                              </div>
                            )}
                          </div>
                          {
                            item.attributes.content ? (
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
                                            color: "var(--cl-neutral-80)",
                                            ":hover": {
                                              background: "var(--cl-neutral-8)",
                                              color: "var(--cl-neutral-80)",
                                            },
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
                                            color: "var(--cl-neutral-80)",
                                            ":hover": {
                                              background: "var(--cl-neutral-8)",
                                              color: "var(--cl-neutral-80)",
                                            },
                                          }}
                                          className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                          onClick={() => {
                                            setShowEditContent(0)
                                            handleUpdateContentPost(item.id, newContent)
                                          }
                                          }
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
                                          color: "var(--cl-neutral-80)",
                                          ":hover": {
                                            background: "var(--cl-neutral-8)",
                                            color: "var(--cl-neutral-80)",
                                          },
                                        }}
                                        className="flex items-center justify-center w-6 h-6 rounded-full transition"
                                        onClick={() => {
                                          setShowEditContent(0)
                                          handleDeleteContentPost(item.id)
                                        }
                                        }
                                      >
                                        <span className="material-symbols-outlined">
                                          delete
                                        </span>
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </div>
                                {
                                  showEditContent != item.id && (
                                    <div className="px-2 leading-relaxed word-break info-prompt"
                                    >
                                      {
                                        renderContent(item.attributes.content[0].children[0].text)
                                      }
                                    </div>
                                  )
                                }
                                {
                                  showEditContent == item.id && (
                                    <div className="px-2 leading-relaxed word-break info-prompt"
                                    >
                                      <div
                                        contentEditable
                                        data-placeholder="What do you want to create?"
                                        dangerouslySetInnerHTML={{
                                          __html: formatContent(item.attributes.content[0].children[0].text),
                                        }}
                                        onChange={(e) =>
                                          setNewContent(e.currentTarget.innerHTML)
                                        }
                                        onBlurCapture={(e) =>
                                          setNewContent(e.currentTarget.innerHTML)
                                        }
                                      >
                                      </div>

                                    </div>
                                  )
                                }

                              </div>
                            ) : (
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
                                  </div>
                                </div>
                                <div className="px-2 leading-relaxed word-break info-prompt"
                                >
                                  Chat is typing...
                                </div>
                              </div>
                            )
                          }

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
                          onClick={() => handleCreatePost(content, modelChoose)}
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
            <span className="text-base font-medium" >Save prompt</span>
          </DialogTitle>
          <Divider />
          <DialogContent className="py-3">
            <FormControl className="mb-4">
              <FormLabel className="form-label" sx={{ color: "var(--cl-primary)" }}>Prompt name</FormLabel>
              <Input
                type="text"
                className="input"
                defaultValue={nameMessage.current}
                onChange={(e) => nameMessage.current = e.target.value}
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
                handleUpdateNameMessage()
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

export default Detail;
