"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
    Button,
    IconButton,
    Avatar,
    Card,
    CardContent,
    CardOverflow,
    CardActions,
    Typography,
    DialogTitle,
    DialogContent,
    Modal,
    ModalDialog,
    ModalClose,
    DialogActions,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Divider,
} from "@mui/joy";
import { Switch, styled, Popover } from "@mui/material";
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    "&.MuiSwitch-root": {
        width: "64px",
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: "var(--cl-neutral-80)",
        "&::before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"  fill="white"><path d="M19,13H5V11H19V13Z"/></svg>') center no-repeat`,
        },
    },
    "& .MuiSwitch-track": {
        backgroundColor: "var(--cl-neutral-30)",
        opacity: 1,
    },
    "& .MuiSwitch-switchBase": {
        "&.Mui-checked": {
            transform: "translateX(24px)",
            "& .MuiSwitch-thumb": {
                backgroundColor: "var(--cl-primary-30)",
                "&::before": {
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="white"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                },
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "var(--cl-primary-70)",
            },
        },
    },
}));

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
                    sx={{ color: "#3c4043", lineHeight: 1.3 }}
                >
                    Đào Lê
                </Typography>
                <Typography level="body-md" sx={{ color: "#5f6368", lineHeight: 1.3 }}>
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
                            color: "var(--cl-drak-blue)",
                            borderRadius: "8px",
                            borderColor: "rgb(218,220,224)",
                            "&:hover": {
                                background: "#f5f7f9",
                                borderColor: "#000f31",
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

interface ChildProps {
    page: string,
    data: any[],
    toggleSidebarLeft: boolean,
    setToggleSidebarLeft: React.Dispatch<React.SetStateAction<boolean>>,

}

const Header: React.FC<ChildProps> = ({ page, data, toggleSidebarLeft, setToggleSidebarLeft }) => {
    // Collapse Menu
    const handleClickSidebarLeft = () => {
        setToggleSidebarLeft(!toggleSidebarLeft);
    };
    const handleOutsideClick = () => {
        setToggleSidebarLeft(true);
    };
    const sideNavRef = useOutsideClick(handleOutsideClick);
    const refNull = useRef(null);
    const viewPort = useViewport();
    const isMobile = typeof window !== "undefined" && viewPort.width <= 1100;

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

    return (
        <div>
            <aside
                className={`h-screen flex-shrink-0 sidebar ${toggleSidebarLeft ? "expanded" : "compact"
                    }`}
                id="sidebar-left"
            >
                <div
                    className="w-full h-full flex flex-col justify-between inner"
                    ref={isMobile ? sideNavRef : refNull}
                >
                    <div className="h-16 flex-shrink-0 flex items-center nav-logo">
                        <a
                            href="/"
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
                            {/* <Image
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
                        /> */}
                        </a>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => setShowModalEditHeading(true)}
                            sx={{ borderRadius: "8px", fontWeight: 400 }}
                        >
                            121124.1730
                        </Button>
                    </div>
                    <div className="w-full grow overflow-y-auto top-sidebar">
                        <div className="py-6 overflow-hidden menus">
                            <div className="sidebar-menu">
                                <Button
                                    component="a"
                                    variant="plain"
                                    aria-label="New Prompt"
                                    href="/"
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
                                    className={page == 'index' ? "w-full sidebar-btn active" : "w-full sidebar-btn"}
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
                                    href="/library"
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
                                    className={page == 'library' ? "w-full sidebar-btn active" : "w-full sidebar-btn"}
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
                                {
                                    data.slice(0, 3).map((item) => (
                                        <div className="sidebar-menu" key={item.id}>
                                            <Button
                                                component="a"
                                                variant="plain"
                                                aria-label="Croissant Recipe in JSON"
                                                href={`/library/${item.attributes.uid}`}
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
                                                    {item.attributes.name}
                                                </span>
                                            </Button>
                                        </div>
                                    ))
                                }
                                <div className="sidebar-menu">
                                    <Button
                                        component="a"
                                        variant="plain"
                                        aria-label="View more"
                                        href="/library"
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
                                    aria-label="My Connectors"
                                    href="/"
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
                                        My Connectors
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full pt-2 pb-4 border-t border-solid border-gray-300 bot-sidebar">
                        <div className="sidebar-menu">
                            <Button
                                component="a"
                                variant="plain"
                                aria-label="Settings"
                                href="/settings"
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
                                className={page == 'settings' ? "w-full sidebar-btn active" : "w-full sidebar-btn"}
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
                                        "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
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
                                                "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
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
                                                "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
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
                        <span className="text-base font-medium">Version 121124.1730</span>
                    </DialogTitle>
                    <Divider />
                    <DialogContent className="py-3" sx={{ color: "var(--cl-primary)" }}>
                        <span className="text-base">- Thêm các tính năng edit,delete</span>
                        <span className="text-base">- Đã sửa lại format content</span>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </div>


    );
};

export default Header;
