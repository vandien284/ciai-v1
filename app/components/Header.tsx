"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { CustomPopover } from "@/app/global";
import {
    MenuOutlined,
    CloseOutlined,
    ShareOutlined,
    ChatBubbleOutlineOutlined,
    TocOutlined,
    SyncOutlined,
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
    KeyboardArrowDown,
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
    Radio
} from "@mui/joy";
import { Tooltip, Popover } from "@mui/material";

import { useOutsideClick } from "outsideclick-react";


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

function PopoverAccount() {
    return (
        <Card sx={{ width: 260, maxWidth: "100%", boxShadow: "lg" }}>
            <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
                <Avatar
                    src="https://mui.com/static/images/avatar/3.jpg"
                    sx={{ "--Avatar-size": "4rem" }}
                />
                <Typography level="title-lg">Đào Lê</Typography>
                <Typography level="body-sm" sx={{ maxWidth: "24ch" }}>
                    dao.le@caready.vn
                </Typography>
            </CardContent>
            <Divider />
            <CardOverflow>
                <CardActions
                    sx={{
                        pt: 0.25,
                    }}
                >
                    <Button variant="solid" color="neutral">
                        Sign out
                    </Button>
                </CardActions>
            </CardOverflow>
        </Card>
    );
}

const Header = (props: { page: string, messages: any[], toggleSidebar: boolean,setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>, setMessages: React.Dispatch<React.SetStateAction<string[]>> }) => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    const param = (type !== null)
        ? type
        : (props.page === 'library' || props.page === 'recent'
            ? 'content'
            : props.page);


    // Collapse Menu
    const handleOutsideClick = () => {
        props.setToggleSidebar(true);
    };
    const sideNavRef = useOutsideClick(handleOutsideClick);
    const viewPort = useViewport();
    const isMobile = typeof window !== "undefined" && viewPort.width <= 1100;

    // Popover
    const [popoverAccount, setPopoverAccount] = React.useState<CustomPopover>({
        anchorEl: null,
        child: <PopoverAccount />,
    });

    // Drawer
    const [openDrawerPrompt, setOpenDrawerPrompt] = React.useState(false);
    const [openDrawerRename, setOpenDrawerRename] = React.useState(false);

    // Modal
    const [showModalDelete, setShowModalDelete] = useState(false);

    // Focus Input
    const inputRenameRef = React.useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (openDrawerRename) {
            inputRenameRef.current?.focus();
        }
    }, [openDrawerRename]);

    // Content - Send prompt
    const [name, setName] = useState("");
    const [id, setId] = useState(0);

    const handleClickEditName = async () => {
        await editMessages(id, name);
        const messageIndex = props.messages.findIndex((item) => item.id === id);
        if (messageIndex === -1) return;

        const updatedMessages = [...props.messages];
        updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            attributes: {
                ...updatedMessages[messageIndex].attributes,
                name: name,
            },
        };

        props.setMessages(updatedMessages);

        setId(0);
        setName('');
    };

    const editMessages = async (id: number, name: string) => {
        try {
            if (props.page == 'chatbox') {
                const response = await axios.put(
                    `http://localhost:1337/api/messageboxes/${id}`,
                    {
                        data: {
                            name: name,
                        },
                    }
                );

                return response;
            } else {
                const response = await axios.put(
                    `http://localhost:1337/api/messages/${id}`,
                    {
                        data: {
                            name: name,
                        },
                    }
                );

                return response;
            }

        } catch (e) {
            console.log(e);
        }
    };

    async function handleClickDelete() {
        await deleteMessages(id);
        const messageIndex = props.messages.findIndex((item) => item.id === id);
        if (messageIndex === -1) return;

        const updatedMessages = [...props.messages];
        updatedMessages.splice(messageIndex, 1);

        props.setMessages(updatedMessages);

        setId(0)
    }

    const deleteMessages = async (id: number) => {
        try {
            if (props.page == 'chatbox') {
                const response = await axios.delete(
                    `http://localhost:1337/api/messageboxes/${id}`
                );
                return response;
            } else {
                const response = await axios.delete(
                    `http://localhost:1337/api/messages/${id}`
                );
                return response;
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            {!isMobile && (
                <aside
                    className={
                        props.toggleSidebar
                            ? "h-screen flex-shrink-0 expanded"
                            : "h-screen flex-shrink-0 compact"
                    }
                    id="sidebar"
                >
                    <div className="w-full h-full flex flex-col justify-between relative inner">
                        <div className="w-full grow flex flex-col top-sidebar">
                            <div className="pr-3 py-3">
                                <div className="hide-mb ml-3 mb-5 btn-click-menu">
                                    {props.toggleSidebar ? (
                                        <IconButton
                                            variant="plain"
                                            onClick={() => props.setToggleSidebar(prev => !prev)}
                                            className="w-12 h-12 flex items-center justify-center transition"
                                            sx={{
                                                borderRadius: "9999px",
                                                "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
                                            }}
                                        >
                                            <MenuOutlined />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            variant="plain"
                                            onClick={() => props.setToggleSidebar(prev => !prev)}
                                            className="w-12 h-12 flex items-center justify-center transition"
                                            sx={{
                                                borderRadius: "9999px",
                                                "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
                                            }}
                                        >
                                            <MenuOutlined />
                                        </IconButton>
                                    )}
                                </div>
                                <div className="menus">
                                    <FormControl className="ml-6 mr-4 mb-4 opacity-transition list-company">
                                        <Select
                                            indicator={
                                                <KeyboardArrowDown className="text-gray-400" />
                                            }
                                            className="w-full custom-select"
                                            name="select-company"
                                            placeholder="Select Company"
                                            sx={{
                                                fontSize: "0.875rem",
                                                "& .MuiSelect-button": {
                                                    opacity: 1,
                                                },
                                                [`& .${selectClasses.indicator}`]: {
                                                    transition: "0.2s",
                                                    [`&.${selectClasses.expanded}`]: {
                                                        transform: "rotate(-180deg)",
                                                    },
                                                },
                                            }}
                                            slotProps={{
                                                listbox: {
                                                    sx: {
                                                        border: "none",
                                                        borderRadius: "3px",
                                                        width: "100%",
                                                        fontFamily: "var(--font)",
                                                        fontSize: "0.875rem",
                                                        "& .MuiOption-root.Mui-selected": {
                                                            bgcolor: "#d3e3fd",
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <Option value="caready">Caready</Option>
                                            <Option value="humology">Humology</Option>
                                        </Select>
                                    </FormControl>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/"
                                            startDecorator={
                                                <TocOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'content' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Content
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/chatbox"
                                            startDecorator={
                                                <ChatBubbleOutlineOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'chatbox' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Chatbox
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/"
                                            startDecorator={
                                                <WorkOutlineOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'business' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Business
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/scraping"
                                            startDecorator={
                                                <DatasetOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'scraping' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Scraping
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/library"
                                            startDecorator={
                                                <LocalLibraryOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'library' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Library
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href={props.page == 'chatbox' ? '/history?type=chatbox' : '/history?type=content'}
                                            startDecorator={
                                                <HistoryOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'history' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Recent
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grow flex flex-col opacity-transition overflow-auto recent-post">
                                <div className="grow list-post">
                                    <List
                                        sx={{
                                            p: 0,
                                            pr: 1.25,
                                            fontFamily: "var(--font)",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {props.messages.slice(0,10).map((item) => (
                                            <ListItem sx={{ p: 0, display: "block" }} key={item.id}>
                                                <Link
                                                    href={`/${param}/${item.attributes.uid}`}
                                                    className="flex items-center justify-between pl-6 pr-1 py-1.5 text-left cursor-pointer rounded-r-3xl hover:bg-gray-200 item-post"
                                                    title={item.attributes.name}
                                                >
                                                    <span className="grow relative truncate tend">
                                                        {item.attributes.name}
                                                    </span>
                                                    <div className="w-7 flex-shrink-0 ml-3 group-edit">
                                                        <Dropdown>
                                                            <MenuButton
                                                                className="flex items-center justify-center icon-click-menu"
                                                                sx={{
                                                                    padding: 0,
                                                                    background: "#F7F7F7!important",
                                                                    border: "none",
                                                                    borderRadius: "100%",
                                                                    width: "28px",
                                                                    minHeight: "28px",
                                                                }}
                                                                onClick={(event) => {
                                                                    event.preventDefault();
                                                                    event.stopPropagation();
                                                                }}
                                                            >
                                                                <svg
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 20 20"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6Z"
                                                                        fill="#464C52"
                                                                    />
                                                                    <path
                                                                        d="M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12Z"
                                                                        fill="#464C52"
                                                                    />
                                                                    <path
                                                                        d="M10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18Z"
                                                                        fill="#464C52"
                                                                    />
                                                                </svg>
                                                            </MenuButton>
                                                            <Menu
                                                                placement="bottom-start"
                                                                className="dropdown-menu"
                                                                sx={{
                                                                    py: 0,
                                                                }}
                                                            >
                                                                <MenuItem
                                                                    className="flex"
                                                                    sx={{
                                                                        background: "none",
                                                                        px: 1.25,
                                                                        py: 0.635,
                                                                        minHeight: "auto",
                                                                        fontSize: 13,
                                                                        gap: 1.25,
                                                                        "&:hover": {
                                                                            background: "#F6F6F6!important",
                                                                            color: "#000!important",
                                                                        },
                                                                    }}
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setOpenDrawerRename(true);
                                                                        setName(item.attributes.name);
                                                                        setId(item.id);
                                                                    }}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M6.5 2C6.36739 2 6.24021 2.05268 6.14645 2.14645C6.05268 2.24021 6 2.36739 6 2.5C6 2.63261 6.05268 2.75979 6.14645 2.85355C6.24021 2.94732 6.36739 3 6.5 3H7.5V13H6.5C6.36739 13 6.24021 13.0527 6.14645 13.1464C6.05268 13.2402 6 13.3674 6 13.5C6 13.6326 6.05268 13.7598 6.14645 13.8536C6.24021 13.9473 6.36739 14 6.5 14H9.5C9.63261 14 9.75979 13.9473 9.85355 13.8536C9.94732 13.7598 10 13.6326 10 13.5C10 13.3674 9.94732 13.2402 9.85355 13.1464C9.75979 13.0527 9.63261 13 9.5 13H8.5V3H9.5C9.63261 3 9.75979 2.94732 9.85355 2.85355C9.94732 2.75979 10 2.63261 10 2.5C10 2.36739 9.94732 2.24021 9.85355 2.14645C9.75979 2.05268 9.63261 2 9.5 2H6.5ZM4 4H6.5V5H4C3.73478 5 3.48043 5.10536 3.29289 5.29289C3.10536 5.48043 3 5.73478 3 6V9.997C3 10.2622 3.10536 10.5166 3.29289 10.7041C3.48043 10.8916 3.73478 10.997 4 10.997H6.5V11.997H4C3.46957 11.997 2.96086 11.7863 2.58579 11.4112C2.21071 11.0361 2 10.5274 2 9.997V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4ZM12 10.997H9.5V11.997H12C12.5304 11.997 13.0391 11.7863 13.4142 11.4112C13.7893 11.0361 14 10.5274 14 9.997V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H9.5V5H12C12.2652 5 12.5196 5.10536 12.7071 5.29289C12.8946 5.48043 13 5.73478 13 6V9.997C13 10.2622 12.8946 10.5166 12.7071 10.7041C12.5196 10.8916 12.2652 10.997 12 10.997Z"
                                                                            fill="#464C52"
                                                                        />
                                                                    </svg>
                                                                    Rename
                                                                </MenuItem>
                                                                <MenuItem
                                                                    className="flex"
                                                                    sx={{
                                                                        background: "none",
                                                                        px: 1.25,
                                                                        py: 0.635,
                                                                        minHeight: "auto",
                                                                        fontSize: 13,
                                                                        gap: 1.25,
                                                                        "&:hover": {
                                                                            background: "#F6F6F6!important",
                                                                            color: "#000!important",
                                                                        },
                                                                    }}
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setShowModalDelete(true);
                                                                        setId(item.id);
                                                                    }}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M6.66658 3.33333H9.33325C9.33325 2.97971 9.19278 2.64057 8.94273 2.39052C8.69268 2.14048 8.35354 2 7.99992 2C7.6463 2 7.30716 2.14048 7.05711 2.39052C6.80706 2.64057 6.66658 2.97971 6.66658 3.33333ZM5.66658 3.33333C5.66658 3.02692 5.72694 2.7235 5.8442 2.44041C5.96146 2.15731 6.13333 1.90009 6.35 1.68342C6.56667 1.46675 6.8239 1.29488 7.10699 1.17761C7.39008 1.06035 7.6935 1 7.99992 1C8.30634 1 8.60975 1.06035 8.89285 1.17761C9.17594 1.29488 9.43316 1.46675 9.64983 1.68342C9.8665 1.90009 10.0384 2.15731 10.1556 2.44041C10.2729 2.7235 10.3333 3.02692 10.3333 3.33333H14.1666C14.2992 3.33333 14.4264 3.38601 14.5201 3.47978C14.6139 3.57355 14.6666 3.70073 14.6666 3.83333C14.6666 3.96594 14.6139 4.09312 14.5201 4.18689C14.4264 4.28066 14.2992 4.33333 14.1666 4.33333H13.2866L12.5066 12.4073C12.4468 13.026 12.1586 13.6002 11.6984 14.0179C11.2381 14.4356 10.6388 14.6669 10.0173 14.6667H5.98258C5.36116 14.6667 4.76199 14.4354 4.30188 14.0177C3.84178 13.6 3.55374 13.0259 3.49392 12.4073L2.71325 4.33333H1.83325C1.70064 4.33333 1.57347 4.28066 1.4797 4.18689C1.38593 4.09312 1.33325 3.96594 1.33325 3.83333C1.33325 3.70073 1.38593 3.57355 1.4797 3.47978C1.57347 3.38601 1.70064 3.33333 1.83325 3.33333H5.66658ZM6.99992 6.5C6.99992 6.36739 6.94724 6.24022 6.85347 6.14645C6.7597 6.05268 6.63253 6 6.49992 6C6.36731 6 6.24013 6.05268 6.14637 6.14645C6.0526 6.24022 5.99992 6.36739 5.99992 6.5V11.5C5.99992 11.6326 6.0526 11.7598 6.14637 11.8536C6.24013 11.9473 6.36731 12 6.49992 12C6.63253 12 6.7597 11.9473 6.85347 11.8536C6.94724 11.7598 6.99992 11.6326 6.99992 11.5V6.5ZM9.49992 6C9.63253 6 9.7597 6.05268 9.85347 6.14645C9.94724 6.24022 9.99992 6.36739 9.99992 6.5V11.5C9.99992 11.6326 9.94724 11.7598 9.85347 11.8536C9.7597 11.9473 9.63253 12 9.49992 12C9.36731 12 9.24013 11.9473 9.14637 11.8536C9.0526 11.7598 8.99992 11.6326 8.99992 11.5V6.5C8.99992 6.36739 9.0526 6.24022 9.14637 6.14645C9.24013 6.05268 9.36731 6 9.49992 6ZM4.48925 12.3113C4.52521 12.6824 4.69808 13.0268 4.97416 13.2774C5.25025 13.528 5.60975 13.6667 5.98258 13.6667H10.0173C10.3901 13.6667 10.7496 13.528 11.0257 13.2774C11.3018 13.0268 11.4746 12.6824 11.5106 12.3113L12.2826 4.33333H3.71725L4.48925 12.3113Z"
                                                                            fill="#464C52"
                                                                        />
                                                                    </svg>
                                                                    Delete
                                                                </MenuItem>
                                                            </Menu>
                                                        </Dropdown>
                                                    </div>
                                                </Link>
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            </div>
                        </div>
                        <div className="w-full p-3 py-4 bot-sidebar border-t">
                            <div className="profile">
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
                                        size="md"
                                        alt="Avatar"
                                        src="https://mui.com/static/images/avatar/3.jpg"
                                    />
                                    <p className="whitespace-nowrap opacity-transition pl-3 name">
                                        Best Surfer
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
                                >
                                    {popoverAccount.child}
                                </Popover>
                            </div>
                        </div>
                    </div>
                </aside>
            )}
            {isMobile && (
                <aside
                    className={
                        props.toggleSidebar
                            ? "h-screen flex-shrink-0 expanded"
                            : "h-screen flex-shrink-0 compact"
                    }
                    id="sidebar"
                    ref={sideNavRef}
                >
                    <div className="w-full h-full flex flex-col justify-between relative inner">
                        <div className="w-full grow flex flex-col top-sidebar">
                            <div className="pr-3 pt-3">
                                <div className="menus">
                                    <FormControl className="ml-6 mr-4 mb-4 opacity-transition list-company">
                                        <Select
                                            indicator={
                                                <KeyboardArrowDown className="text-gray-400" />
                                            }
                                            className="w-full custom-select"
                                            name="select-company"
                                            placeholder="Select Company"
                                            sx={{
                                                fontSize: "0.875rem",
                                                "& .MuiSelect-button": {
                                                    opacity: 1,
                                                },
                                                [`& .${selectClasses.indicator}`]: {
                                                    transition: "0.2s",
                                                    [`&.${selectClasses.expanded}`]: {
                                                        transform: "rotate(-180deg)",
                                                    },
                                                },
                                            }}
                                            slotProps={{
                                                listbox: {
                                                    sx: {
                                                        border: "none",
                                                        borderRadius: "3px",
                                                        width: "100%",
                                                        fontFamily: "var(--font)",
                                                        fontSize: "0.875rem",
                                                        "& .MuiOption-root.Mui-selected": {
                                                            bgcolor: "#d3e3fd",
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <Option value="caready">Caready</Option>
                                            <Option value="humology">Humology</Option>
                                        </Select>
                                    </FormControl>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/"
                                            startDecorator={
                                                <TocOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'content' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Content
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/"
                                            startDecorator={
                                                <ChatBubbleOutlineOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'chatbox' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Chatbox
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/"
                                            startDecorator={
                                                <WorkOutlineOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'library' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Business
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/scraping"
                                            startDecorator={
                                                <WorkOutlineOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'scraping' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Scraping
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/library"
                                            startDecorator={
                                                <LocalLibraryOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'library' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Library
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="sidebar-menu">
                                        <Button
                                            component="a"
                                            variant="plain"
                                            href="/history"
                                            startDecorator={
                                                <HistoryOutlined
                                                    sx={{
                                                        width: 48,
                                                    }}
                                                />
                                            }
                                            className={`w-full sidebar-btn ${props.page === 'history' ? 'active' : ''}`}
                                            sx={{
                                                pl: 1.5,
                                                pr: 2,
                                                py: 1.5,
                                                justifyContent: "flex-start",
                                                fontFamily: "var(--font)",
                                                fontWeight: 400,
                                                color: "var(--cl-main)",
                                                borderRadius: "0 1.5rem 1.5rem 0",
                                                "& .MuiButton-startDecorator": {
                                                    mr: 0,
                                                },
                                                "&.MuiButton-root:hover": {
                                                    background: "rgb(229,231,235)",
                                                },
                                            }}
                                        >
                                            <span className="whitespace-nowrap opacity-transition pl-3 leading-snug name">
                                                Recent
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grow flex flex-col opacity-transition overflow-auto recent-post">
                                <div className="grow list-post">
                                    <List
                                        sx={{
                                            p: 0,
                                            pr: 1.25,
                                            fontFamily: "var(--font)",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {props.messages.slice(0,10).map((item) => (
                                            <ListItem sx={{ p: 0, display: "block" }} key={item.id}>
                                                <Link
                                                    href={`/${param}/${item.attributes.uid}`}
                                                    className="flex items-center justify-between pl-6 pr-1 py-1.5 text-left cursor-pointer rounded-r-3xl hover:bg-gray-200 item-post"
                                                    title={item.attributes.name}
                                                >
                                                    <span className="grow relative truncate tend">
                                                        {item.attributes.name}
                                                    </span>
                                                    <div className="w-7 flex-shrink-0 ml-3 group-edit">
                                                        <Dropdown>
                                                            <MenuButton
                                                                className="flex items-center justify-center icon-click-menu"
                                                                sx={{
                                                                    padding: 0,
                                                                    background: "#F7F7F7!important",
                                                                    border: "none",
                                                                    borderRadius: "100%",
                                                                    width: "28px",
                                                                    minHeight: "28px",
                                                                }}
                                                                onClick={(event) => {
                                                                    event.preventDefault();
                                                                    event.stopPropagation();
                                                                }}
                                                            >
                                                                <svg
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 20 20"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6Z"
                                                                        fill="#464C52"
                                                                    />
                                                                    <path
                                                                        d="M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12Z"
                                                                        fill="#464C52"
                                                                    />
                                                                    <path
                                                                        d="M10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18Z"
                                                                        fill="#464C52"
                                                                    />
                                                                </svg>
                                                            </MenuButton>
                                                            <Menu
                                                                placement="bottom-start"
                                                                className="dropdown-menu"
                                                                sx={{
                                                                    py: 0,
                                                                }}
                                                            >
                                                                <MenuItem
                                                                    className="flex"
                                                                    sx={{
                                                                        background: "none",
                                                                        px: 1.25,
                                                                        py: 0.635,
                                                                        minHeight: "auto",
                                                                        fontSize: 13,
                                                                        gap: 1.25,
                                                                        "&:hover": {
                                                                            background: "#F6F6F6!important",
                                                                            color: "#000!important",
                                                                        },
                                                                    }}
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setOpenDrawerRename(true);
                                                                        setName(item.attributes.name);
                                                                        setId(item.id);
                                                                    }}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M6.5 2C6.36739 2 6.24021 2.05268 6.14645 2.14645C6.05268 2.24021 6 2.36739 6 2.5C6 2.63261 6.05268 2.75979 6.14645 2.85355C6.24021 2.94732 6.36739 3 6.5 3H7.5V13H6.5C6.36739 13 6.24021 13.0527 6.14645 13.1464C6.05268 13.2402 6 13.3674 6 13.5C6 13.6326 6.05268 13.7598 6.14645 13.8536C6.24021 13.9473 6.36739 14 6.5 14H9.5C9.63261 14 9.75979 13.9473 9.85355 13.8536C9.94732 13.7598 10 13.6326 10 13.5C10 13.3674 9.94732 13.2402 9.85355 13.1464C9.75979 13.0527 9.63261 13 9.5 13H8.5V3H9.5C9.63261 3 9.75979 2.94732 9.85355 2.85355C9.94732 2.75979 10 2.63261 10 2.5C10 2.36739 9.94732 2.24021 9.85355 2.14645C9.75979 2.05268 9.63261 2 9.5 2H6.5ZM4 4H6.5V5H4C3.73478 5 3.48043 5.10536 3.29289 5.29289C3.10536 5.48043 3 5.73478 3 6V9.997C3 10.2622 3.10536 10.5166 3.29289 10.7041C3.48043 10.8916 3.73478 10.997 4 10.997H6.5V11.997H4C3.46957 11.997 2.96086 11.7863 2.58579 11.4112C2.21071 11.0361 2 10.5274 2 9.997V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4ZM12 10.997H9.5V11.997H12C12.5304 11.997 13.0391 11.7863 13.4142 11.4112C13.7893 11.0361 14 10.5274 14 9.997V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H9.5V5H12C12.2652 5 12.5196 5.10536 12.7071 5.29289C12.8946 5.48043 13 5.73478 13 6V9.997C13 10.2622 12.8946 10.5166 12.7071 10.7041C12.5196 10.8916 12.2652 10.997 12 10.997Z"
                                                                            fill="#464C52"
                                                                        />
                                                                    </svg>
                                                                    Rename
                                                                </MenuItem>
                                                                <MenuItem
                                                                    className="flex"
                                                                    sx={{
                                                                        background: "none",
                                                                        px: 1.25,
                                                                        py: 0.635,
                                                                        minHeight: "auto",
                                                                        fontSize: 13,
                                                                        gap: 1.25,
                                                                        "&:hover": {
                                                                            background: "#F6F6F6!important",
                                                                            color: "#000!important",
                                                                        },
                                                                    }}
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setShowModalDelete(true);
                                                                        setId(item.id);
                                                                    }}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M6.66658 3.33333H9.33325C9.33325 2.97971 9.19278 2.64057 8.94273 2.39052C8.69268 2.14048 8.35354 2 7.99992 2C7.6463 2 7.30716 2.14048 7.05711 2.39052C6.80706 2.64057 6.66658 2.97971 6.66658 3.33333ZM5.66658 3.33333C5.66658 3.02692 5.72694 2.7235 5.8442 2.44041C5.96146 2.15731 6.13333 1.90009 6.35 1.68342C6.56667 1.46675 6.8239 1.29488 7.10699 1.17761C7.39008 1.06035 7.6935 1 7.99992 1C8.30634 1 8.60975 1.06035 8.89285 1.17761C9.17594 1.29488 9.43316 1.46675 9.64983 1.68342C9.8665 1.90009 10.0384 2.15731 10.1556 2.44041C10.2729 2.7235 10.3333 3.02692 10.3333 3.33333H14.1666C14.2992 3.33333 14.4264 3.38601 14.5201 3.47978C14.6139 3.57355 14.6666 3.70073 14.6666 3.83333C14.6666 3.96594 14.6139 4.09312 14.5201 4.18689C14.4264 4.28066 14.2992 4.33333 14.1666 4.33333H13.2866L12.5066 12.4073C12.4468 13.026 12.1586 13.6002 11.6984 14.0179C11.2381 14.4356 10.6388 14.6669 10.0173 14.6667H5.98258C5.36116 14.6667 4.76199 14.4354 4.30188 14.0177C3.84178 13.6 3.55374 13.0259 3.49392 12.4073L2.71325 4.33333H1.83325C1.70064 4.33333 1.57347 4.28066 1.4797 4.18689C1.38593 4.09312 1.33325 3.96594 1.33325 3.83333C1.33325 3.70073 1.38593 3.57355 1.4797 3.47978C1.57347 3.38601 1.70064 3.33333 1.83325 3.33333H5.66658ZM6.99992 6.5C6.99992 6.36739 6.94724 6.24022 6.85347 6.14645C6.7597 6.05268 6.63253 6 6.49992 6C6.36731 6 6.24013 6.05268 6.14637 6.14645C6.0526 6.24022 5.99992 6.36739 5.99992 6.5V11.5C5.99992 11.6326 6.0526 11.7598 6.14637 11.8536C6.24013 11.9473 6.36731 12 6.49992 12C6.63253 12 6.7597 11.9473 6.85347 11.8536C6.94724 11.7598 6.99992 11.6326 6.99992 11.5V6.5ZM9.49992 6C9.63253 6 9.7597 6.05268 9.85347 6.14645C9.94724 6.24022 9.99992 6.36739 9.99992 6.5V11.5C9.99992 11.6326 9.94724 11.7598 9.85347 11.8536C9.7597 11.9473 9.63253 12 9.49992 12C9.36731 12 9.24013 11.9473 9.14637 11.8536C9.0526 11.7598 8.99992 11.6326 8.99992 11.5V6.5C8.99992 6.36739 9.0526 6.24022 9.14637 6.14645C9.24013 6.05268 9.36731 6 9.49992 6ZM4.48925 12.3113C4.52521 12.6824 4.69808 13.0268 4.97416 13.2774C5.25025 13.528 5.60975 13.6667 5.98258 13.6667H10.0173C10.3901 13.6667 10.7496 13.528 11.0257 13.2774C11.3018 13.0268 11.4746 12.6824 11.5106 12.3113L12.2826 4.33333H3.71725L4.48925 12.3113Z"
                                                                            fill="#464C52"
                                                                        />
                                                                    </svg>
                                                                    Delete
                                                                </MenuItem>
                                                            </Menu>
                                                        </Dropdown>
                                                    </div>
                                                </Link>
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            </div>
                        </div>
                        <div className="w-full p-3 border-t py-4 bot-sidebar">
                            <div className="profile">
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
                                        size="md"
                                        alt="Avatar"
                                        src="https://mui.com/static/images/avatar/3.jpg"
                                    />
                                    <p className="whitespace-nowrap opacity-transition pl-3 name">
                                        Best Surfer
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
                                >
                                    {popoverAccount.child}
                                </Popover>
                            </div>
                        </div>
                    </div>
                </aside>
            )}
            <Drawer
                anchor="right"
                open={openDrawerPrompt}
                onClose={() => setOpenDrawerPrompt(false)}
                className="modal-sidebar"
                slotProps={{
                    content: {
                        sx: {
                            width: "100%",
                            maxWidth: "480px",
                            bgcolor: "#FDFDFD",
                        },
                    },
                }}
            >
                <ModalClose
                    sx={{ top: 14, right: 16, zIndex: 3 }}
                    className="modal-close"
                />
                <DialogTitle
                    className="flex items-center justify-between px-5 py-4 text-lg modal-title"
                    sx={{ fontWeight: 500 }}
                >
                    Tạo Prompt
                </DialogTitle>
                <DialogContent className="modal-content">
                    <FormControl className="mb-4">
                        <FormLabel className="form-label">Ngôn ngữ</FormLabel>
                        <RadioGroup
                            name="languages"
                            orientation="horizontal"
                            defaultValue="vietnamese"
                            className="flex-wrap gap-x-6 gap-y-3"
                            sx={{ mt: 0.5, mb: 0 }}
                        >
                            <Radio
                                value="vietnamese"
                                label="Vietnamese"
                                sx={{
                                    fontSize: 14,
                                    "&.MuiRadio-root": {
                                        gap: "6px",
                                    },
                                    "& .MuiRadio-radio": {
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
                                value="french"
                                label="French"
                                sx={{
                                    ml: 0,
                                    fontSize: 14,
                                    "&.MuiRadio-root": {
                                        gap: "6px",
                                    },
                                    "& .MuiRadio-radio": {
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
                    </FormControl>
                    <FormControl className="mb-4">
                        <FormLabel className="form-label">Thể loại bài viết</FormLabel>
                        <Select
                            indicator={<KeyboardArrowDown className="text-gray-400" />}
                            className="w-full custom-select"
                            name="select-type-post"
                            placeholder="Chọn Thể loại bài viết"
                            sx={{
                                "& .MuiSelect-button": {
                                    opacity: 1,
                                },
                                [`& .${selectClasses.indicator}`]: {
                                    transition: "0.2s",
                                    [`&.${selectClasses.expanded}`]: {
                                        transform: "rotate(-180deg)",
                                    },
                                },
                            }}
                            slotProps={{
                                listbox: {
                                    sx: {
                                        border: "none",
                                        borderRadius: "3px",
                                        width: "100%",
                                        "& .MuiOption-root.Mui-selected": {
                                            bgcolor: "#d3e3fd",
                                        },
                                    },
                                },
                            }}
                        >
                            <Option value="social-media">Social Media</Option>
                            <Option value="ưebsite-content">Website Content</Option>
                            <Option value="ecommerce-posts">Ecommerce Posts</Option>
                            <Option value="manual-posts">Manual Posts</Option>
                        </Select>
                    </FormControl>
                    <FormControl className="mb-4">
                        <FormLabel className="form-label">Nhập từ khóa</FormLabel>
                        <Input
                            type="text"
                            className="input"
                            placeholder="Từ khóa"
                            slotProps={{
                                input: {
                                    autoFocus: true,
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl className="mb-4">
                        <FormLabel className="form-label">Số lượng từ</FormLabel>
                        <Input type="text" className="input" placeholder="400" />
                    </FormControl>
                </DialogContent>
                <Box
                    className="px-5 py-4"
                    sx={{
                        display: "flex",
                        borderTop: "1px solid #CBCDD1",
                    }}
                >
                    <button
                        type="button"
                        className="ml-auto flex items-center justify-center w-10 h-10 rounded-xl transition hover:bg-gray-200 btn-send"
                        onClick={() => setOpenDrawerPrompt(false)}
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
                </Box>
            </Drawer>
            <Drawer
                anchor="right"
                open={openDrawerRename}
                onClose={() => setOpenDrawerRename(false)}
                className="modal-sidebar"
                slotProps={{
                    content: {
                        sx: {
                            width: "100%",
                            maxWidth: "480px",
                            bgcolor: "#FDFDFD",
                        },
                    },
                }}
            >
                <ModalClose
                    sx={{ top: 14, right: 16, zIndex: 3 }}
                    className="modal-close"
                />
                <DialogTitle
                    className="flex items-center justify-between px-5 py-4 text-lg modal-title"
                    sx={{ fontWeight: 500 }}
                >
                    Rename
                </DialogTitle>
                <DialogContent className="modal-content">
                    <FormControl className="mb-4">
                        <FormLabel className="form-label">Name*</FormLabel>
                        <Input
                            type="text"
                            className="input"
                            defaultValue={name}
                            slotProps={{
                                input: {
                                    ref: inputRenameRef,
                                    autoFocus: true,
                                },
                            }}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                </DialogContent>
                <Box
                    className="px-5 py-4"
                    sx={{
                        display: "flex",
                        borderTop: "1px solid #CBCDD1",
                    }}
                >
                    <button
                        className="ml-auto flex items-center justify-center w-11 h-11 rounded-full transition hover:bg-blue-100 btn-circle"
                        onClick={() => {
                            setOpenDrawerRename(false);
                            handleClickEditName();
                        }}
                    >
                        <svg
                            version="1.2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 22 19"
                            width="20"
                            height="20"
                        >
                            <path
                                fillRule="evenodd"
                                d="m0.8 0.7l21 8.8-21 8.8 1.2-8.8zm1.2 1.6l0.9 6.7h15.1zm0 14.5l15.9-6.8h-15z"
                                fill="var(--cl-primary)"
                            />
                        </svg>
                    </button>
                </Box>
            </Drawer>
            <Modal open={showModalDelete} onClose={() => setShowModalDelete(false)}>
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    className="modal-dialog"
                    sx={{
                        "&.MuiModalDialog-root": {
                            width: "94%",
                            maxWidth: "400px",
                            fontSize: "0.875rem",
                        },
                    }}
                >
                    <DialogTitle>
                        <WarningAmber />
                        Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent className="py-3">
                        Are you sure you want to delete this report?
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            onClick={() => {
                                setShowModalDelete(false);
                                handleClickDelete();
                            }}
                            sx={{ borderRadius: "30px", fontWeight: 400 }}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="plain"
                            color="neutral"
                            sx={{ borderRadius: "30px", fontWeight: 400 }}
                            onClick={() => setShowModalDelete(false)}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </div>
    )
}

export default Header;