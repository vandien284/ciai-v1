"use client";
import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";


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
  Dropdown,
  Menu,
  MenuItem,
  MenuButton,
} from "@mui/joy";
import { TablePagination } from "@mui/material";

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

const Library = () => {
  const router = useRouter();
  // Collapse Menu
  const [toggleSidebarLeft, setToggleSidebarLeft] = React.useState(true);
  const handleClickSidebarLeft = () => {
    setToggleSidebarLeft(!toggleSidebarLeft);
  };

  const viewPort = useViewport();
  const isMobile = typeof window !== "undefined" && viewPort.width <= 1100;

  // Modal
  const [showModalEditHeading, setShowModalEditHeading] = useState(false);

  // Focus Input
  const inputTitleRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showModalEditHeading) {
      inputTitleRef.current?.focus();
    }
  }, [showModalEditHeading]);

  // Search bar
  const [inputValue, setInputValue] = useState("");
  const handleInputSearchChange = (event: any) => {
    setInputValue(event.target.value);
  };

  // Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

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

  const hasFetched = useRef(false);
  const [messages, setMessages] = useState(Array<any>);
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://cms.ciai.byte.vn/api/messages?sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=100`
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


  function timeAgo(date: any) {
    const now = new Date();
    const timeDiff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    const seconds = timeDiff;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }

    if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }

    if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }

    return 'Just now';
  }

  return (
    <div id="app">
      <section className="flex h-full sec-main">
        <Header page="library" data={messages} toggleSidebarLeft={toggleSidebarLeft} setToggleSidebarLeft={setToggleSidebarLeft}></Header>
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
                <div className="sm:flex sm:items-center gap-x-2 overflow-hidden">
                  <h1 className="text-2xl font-normal truncate heading-title">
                    My library
                  </h1>
                </div>
              </div>
              {/* <div className="bar-right">
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
                      <span className="material-symbols-outlined">save</span>
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
                      <span className="material-symbols-outlined">share</span>
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
              </div> */}
            </div>
          </nav>
          <main className="w-full grow flex" id="main-content">
            <div className="grow overflow-auto p-5 lg:p-6 all-posts">
              <div className="container">
                <Box className="list-posts">
                  <div className="sm:flex items-center justify-between mb-4 page-heading">
                    <h2 className="text-xl font-normal mb-3 sm:mb-0 heading-title">
                      All files
                    </h2>
                    <div className="sm:flex items-center gap-x-3">
                      <div className="hidden sm:block">
                        <Button
                          component="a"
                          variant="plain"
                          aria-label="Drive Folder"
                          href=""
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
                          <span className="hidden md:inline-block">
                            Drive Folder
                          </span>
                        </Button>
                      </div>
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
                  <div className="overflow-auto">
                    <table className="table-auto w-full data-table tbl-mb whitespace-nowrap tbl-library">
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
                        {
                          messages.map((item, index) => (
                            <tr
                              key={index}
                              className="cursor-pointer"
                              onClick={() => router.push(`/library/${item.attributes.uid}`)}
                            >
                              <td className="w-12 text-center">
                                <span className="material-symbols-outlined mt-1 prompt-icon">
                                  chat_bubble
                                </span>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="text-left font-medium truncate tend"
                                >
                                  {item.attributes.name}
                                </button>
                              </td>
                              <td></td>
                              <td>Chat prompt</td>
                              <td>{timeAgo(item.attributes.createdAt)}</td>
                              <td className="actions">
                                <Dropdown>
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
                                    onClick={(event) => {
                                      event.stopPropagation();
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
                          ))
                        }
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
                        color: "var(--cl-primary)",
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
