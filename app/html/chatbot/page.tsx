"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Button,
  IconButton,
  RadioGroup,
  Radio,
  Sheet,
  Dropdown,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  styled,
} from "@mui/joy";
import { Tooltip, Popper, ClickAwayListener } from "@mui/material";

import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";

const Popup = styled(Popper)({
  zIndex: 1000,
});

interface UploadedFile {
  file: File;
  preview: string | null; // Image preview URL or null for non-images
}

const Chatbot = () => {
  // React ContentEditable
  const sanitizeConf = useRef({
    allowedTags: ["p"],
    allowedAttributes: {},
  });
  const [contentPrompt, setContentPrompt] = React.useState("Nhập tin nhắn");
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
    }
  };

  // Upload mutiple file
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };
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

  return (
    <div id="app">
      <section className="h-full bg-white overflow-hidden sec-chatbot">
        <div className="h-full flex flex-col justify-between overflow-hidden">
          <main className="flex flex-col justify-between grow overflow-auto">
            <RadioGroup
              orientation="horizontal"
              aria-labelledby="categories"
              className="p-4 flex-shrink-0"
              sx={{ gap: 1.5, justifyContent: "center" }}
            >
              {["Mua xe", "Vay mua xe", "Mua bảo hiểm"].map((value) => (
                <Sheet
                  key={value}
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: "20px",
                    boxShadow: "none",
                    flexGrow: 1,
                    maxWidth: 150,
                    textAlign: "center",
                  }}
                >
                  <Radio
                    label={`${value}`}
                    size="lg"
                    overlay
                    disableIcon
                    value={value}
                    slotProps={{
                      label: ({ checked }) => ({
                        sx: {
                          fontFamily: "var(--font-chatbot)",
                          fontWeight: "sm",
                          fontSize: "sm",
                          color: checked ? "#222" : "#707070",
                        },
                      }),
                      radio: {
                        sx: {
                          borderColor: "#707070",
                        },
                      },
                      action: ({ checked }) => ({
                        sx: (theme) => ({
                          ...(checked && {
                            "--variant-borderWidth": "2px",
                            borderColor: "#222!important",
                            "&:hover": {
                              bgcolor: "#FFF",
                            },
                            "&&": {
                              // && to increase the specificity to win the base :hover styles
                              borderColor: theme.vars.palette.primary[500],
                            },
                          }),
                        }),
                      }),
                    }}
                  />
                </Sheet>
              ))}
            </RadioGroup>
            <div className="flex flex-col justify-between grow overflow-auto pt-3 px-4">
              <div className="grow space"></div>
              <div className="history-chat">
                <div className="flex mb-4 virtual-assistant">
                  <div className="mr-4 flex-shrink-0">
                    <Image
                      src="/images/favicon.png"
                      alt=""
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="grow">
                    <div className="inline-block px-3 py-2.5 rounded-2xl leading-relaxed word-break content-text">
                      Để được hỗ trợ, anh/chị vui lòng Click chọn danh mục cần
                      tư vấn.
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end mb-4 customer">
                  <div className="inline-block px-3 py-2.5 rounded-2xl leading-relaxed word-break content-text">
                    Nguyễn Văn A
                  </div>
                </div>
                <div className="flex mb-4 virtual-assistant">
                  <div className="mr-4 flex-shrink-0">
                    <Image
                      src="/images/favicon.png"
                      alt=""
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="grow">
                    <div className="inline-block px-3 py-2.5 rounded-2xl leading-relaxed word-break content-text">
                      Anh/chị có nhu cầu mua xe mới hay xe cũ ạ?
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end mb-4 customer">
                  {/* Preview Section */}
                  {files.length > 0 && (
                    <div className="file-container">
                      {files.map((uploadedFile, index) => (
                        <div key={index} style={{ maxWidth: "160px" }}>
                          {uploadedFile.preview ? (
                            <div className="border border-solid border-gray-300 rounded overflow-hidden relative mb-4 flex flex-col">
                              <a href={uploadedFile.preview} target="_blank">
                                <Image
                                  width={160}
                                  height={100}
                                  src={uploadedFile.preview}
                                  alt={`Preview ${index}`}
                                />
                              </a>
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
                                  bgcolor: "#707070",
                                  color: "#FFF",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  ":hover": {
                                    background: "#edeef1",
                                    color: "#2f3133",
                                  },
                                }}
                                className="absolute top-2 right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full transition"
                                onClick={() => handleRemoveFile(index)}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: "1rem!important" }}
                                >
                                  close
                                </span>
                              </IconButton>
                            </div>
                          ) : (
                            <div className="border border-solid border-gray-300 rounded overflow-hidden relative mb-4 flex flex-col">
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
                                  bgcolor: "#707070",
                                  color: "#FFF",
                                  minWidth: "24px",
                                  minHeight: "24px",
                                  ":hover": {
                                    background: "#edeef1",
                                    color: "#2f3133",
                                  },
                                }}
                                className="absolute top-2 right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full transition"
                                onClick={() => handleRemoveFile(index)}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: "1rem!important" }}
                                >
                                  close
                                </span>
                              </IconButton>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="inline-block px-3 py-2.5 rounded-2xl leading-relaxed word-break content-text">
                    Tôi muốn mua xe cũ
                  </div>
                </div>
              </div>
            </div>
          </main>
          <footer className="h-14 px-3 flex items-center justify-between flex-shrink-0 border-t border-solid border-gray-300 footer-chatbot">
            <Dropdown>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      maxWidth: "12rem",
                      bgcolor: "#e2e2e5",
                      fontFamily: "var(--font-chatbot)",
                      color: "#222",
                    },
                  },
                }}
                placement="top"
                title="Prompt model"
              >
                <MenuButton
                  className="flex items-center justify-center flex-shrink-0"
                  sx={{
                    padding: 0,
                    background: "none!important",
                    border: "none",
                    borderRadius: "100%",
                    width: "36px",
                    minHeight: "36px",
                    color: "#1a1c1e",
                    "&:hover": {
                      background: "#f3f3f6 !important",
                      color: "#1a1c1e !important",
                    },
                  }}
                >
                  <span className="material-symbols-outlined">menu</span>
                </MenuButton>
              </Tooltip>
              <Menu
                placement="bottom-start"
                sx={{
                  p: 1.5,
                  bgcolor: "#fff",
                  borderColor: "#edeef1",
                  maxWidth: 240,
                  maxHeight: 320,
                  overflow: "auto",
                }}
              >
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "12rem",
                        bgcolor: "#e2e2e5",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                      },
                    },
                  }}
                  placement="right"
                  title="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                >
                  <MenuItem
                    sx={{
                      p: 0,
                      "&.MuiMenuItem-root:hover": {
                        background: "none",
                      },
                    }}
                  >
                    <Button
                      variant="plain"
                      aria-label="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        width: "100%",
                        justifyContent: "flex-start",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#f3f3f6",
                        },
                      }}
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá
                        [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn
                        có thể gợi ý không?
                      </span>
                    </Button>
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "12rem",
                        bgcolor: "#e2e2e5",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                      },
                    },
                  }}
                  placement="right"
                  title="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                >
                  <MenuItem
                    sx={{
                      p: 0,
                      "&.MuiMenuItem-root:hover": {
                        background: "none",
                      },
                    }}
                  >
                    <Button
                      variant="plain"
                      aria-label="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        width: "100%",
                        justifyContent: "flex-start",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#f3f3f6",
                        },
                      }}
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá
                        [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn
                        có thể gợi ý không?
                      </span>
                    </Button>
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "12rem",
                        bgcolor: "#e2e2e5",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                      },
                    },
                  }}
                  placement="right"
                  title="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                >
                  <MenuItem
                    sx={{
                      p: 0,
                      "&.MuiMenuItem-root:hover": {
                        background: "none",
                      },
                    }}
                  >
                    <Button
                      variant="plain"
                      aria-label="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        width: "100%",
                        justifyContent: "flex-start",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#f3f3f6",
                        },
                      }}
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá
                        [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn
                        có thể gợi ý không?
                      </span>
                    </Button>
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "12rem",
                        bgcolor: "#e2e2e5",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                      },
                    },
                  }}
                  placement="right"
                  title="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                >
                  <MenuItem
                    sx={{
                      p: 0,
                      "&.MuiMenuItem-root:hover": {
                        background: "none",
                      },
                    }}
                  >
                    <Button
                      variant="plain"
                      aria-label="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        width: "100%",
                        justifyContent: "flex-start",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#f3f3f6",
                        },
                      }}
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá
                        [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn
                        có thể gợi ý không?
                      </span>
                    </Button>
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "12rem",
                        bgcolor: "#e2e2e5",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                      },
                    },
                  }}
                  placement="right"
                  title="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                >
                  <MenuItem
                    sx={{
                      p: 0,
                      "&.MuiMenuItem-root:hover": {
                        background: "none",
                      },
                    }}
                  >
                    <Button
                      variant="plain"
                      aria-label="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        width: "100%",
                        justifyContent: "flex-start",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#f3f3f6",
                        },
                      }}
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá
                        [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn
                        có thể gợi ý không?
                      </span>
                    </Button>
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "12rem",
                        bgcolor: "#e2e2e5",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                      },
                    },
                  }}
                  placement="right"
                  title="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                >
                  <MenuItem
                    sx={{
                      p: 0,
                      "&.MuiMenuItem-root:hover": {
                        background: "none",
                      },
                    }}
                  >
                    <Button
                      variant="plain"
                      aria-label="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        width: "100%",
                        justifyContent: "flex-start",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#f3f3f6",
                        },
                      }}
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá
                        [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn
                        có thể gợi ý không?
                      </span>
                    </Button>
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "12rem",
                        bgcolor: "#e2e2e5",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                      },
                    },
                  }}
                  placement="right"
                  title="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                >
                  <MenuItem
                    sx={{
                      p: 0,
                      "&.MuiMenuItem-root:hover": {
                        background: "none",
                      },
                    }}
                  >
                    <Button
                      variant="plain"
                      aria-label="Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn có thể gợi ý không?"
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0,
                        width: "100%",
                        justifyContent: "flex-start",
                        fontFamily: "var(--font-chatbot)",
                        color: "#222",
                        borderRadius: "20px",
                        "&.MuiButton-root:hover": {
                          background: "#f3f3f6",
                        },
                      }}
                    >
                      <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span className="grow truncate whitespace-nowrap opacity-transition font-normal leading-snug name tend">
                        Tôi đang tìm một chiếc xe với các tiêu chí: [5 chỗ], giá
                        [dưới 500 triệu], hãng [Kia], và tình trạng [xe cũ]. Bạn
                        có thể gợi ý không?
                      </span>
                    </Button>
                  </MenuItem>
                </Tooltip>
              </Menu>
            </Dropdown>
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: "12rem",
                    bgcolor: "#e2e2e5",
                    fontFamily: "var(--font-chatbot)",
                    color: "#222",
                  },
                },
              }}
              placement="top"
              title="Upload a file to include in your prompt"
            >
              <div className="relative flex-shrink-0 -ml-1 cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  sx={{
                    padding: 0,
                    background: "none!important",
                    border: "none",
                    borderRadius: "100%",
                    width: "36px",
                    minHeight: "36px",
                    color: "#1a1c1e",
                    "&:hover": {
                      background: "#f3f3f6 !important",
                      color: "#1a1c1e !important",
                    },
                  }}
                  onClick={handleClickUpload}
                >
                  <span className="material-symbols-outlined">attach_file</span>
                </Button>
              </div>
            </Tooltip>
            <div className="grow ml-1 mr-3 type-prompt">
              <div
                ref={editableRef}
                className="max-h-6 overflow-x-hidden overflow-y-auto content-wrap"
              >
                <ContentEditable
                  onChange={handleChangePrompt}
                  onBlur={handleChangePrompt}
                  onKeyPress={onKeyPressHandler}
                  html={contentPrompt}
                  data-placeholder="Nhập tin nhắn"
                  suppressContentEditableWarning={true}
                />
              </div>
            </div>
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#e2e2e5",
                    fontFamily: "var(--font-chatbot)",
                    color: "#222",
                  },
                },
              }}
              title="Write text to run prompt (Shift + Enter to add a line break and Enter to view detail)"
            >
              <Button
                className="flex items-center justify-center w-9 h-9 flex-shrink-0"
                variant="outlined"
                sx={{
                  p: 0,
                  border: "none",
                  borderRadius: "100%",
                  background: "none",
                  color: "var(--cl-pink-50)",
                  "&:hover": {
                    background: "#f3f3f6",
                  },
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.5C12 20.1833 11.75 18.95 11.25 17.8C10.75 16.6333 10.075 15.625 9.225 14.775C8.375 13.925 7.36667 13.25 6.2 12.75C5.05 12.25 3.81667 12 2.5 12C3.81667 12 5.05 11.75 6.2 11.25C7.36667 10.75 8.375 10.075 9.225 9.225C10.075 8.375 10.75 7.375 11.25 6.225C11.75 5.05833 12 3.81667 12 2.5C12 3.81667 12.25 5.05833 12.75 6.225C13.25 7.375 13.925 8.375 14.775 9.225C15.625 10.075 16.625 10.75 17.775 11.25C18.9417 11.75 20.1833 12 21.5 12C20.1833 12 18.9417 12.25 17.775 12.75C16.625 13.25 15.625 13.925 14.775 14.775C13.925 15.625 13.25 16.6333 12.75 17.8C12.25 18.95 12 20.1833 12 21.5Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Chatbot;
