"use client";
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import { useTheme } from "@/app/context/ThemeContext";
import {
    Button,
    IconButton,
    FormControl,
    Box,
    Stack,
    Dropdown,
    Menu,
    MenuItem,
    MenuButton,
    Select,
    selectClasses,
    Option,
    RadioGroup,
    Radio,
} from "@mui/joy";

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

interface ChildProps {
    toggleSidebarRight: boolean
    setToggleSidebarRight: React.Dispatch<React.SetStateAction<boolean>>,
    type: MutableRefObject<string>
}

const Setting: React.FC<ChildProps> = ({ toggleSidebarRight, setToggleSidebarRight, type }) => {
    const { theme, toggleTheme } = useTheme();
    // Collapse Menu
    const handleClickSidebarRight = () => {
        setToggleSidebarRight(!toggleSidebarRight);
    };
    const handleOutsideClick = () => {
        setToggleSidebarRight(true);
    };
    const sideNavRef = useOutsideClick(handleOutsideClick);
    const refNull = useRef(null);
    const viewPort = useViewport();
    const isMobile = typeof window !== "undefined" && viewPort.width <= 1100;

    // Select Options
    const [selectedItem, setSelectedItem] = useState("content");
    const handleChangeActivities = (
        event: React.SyntheticEvent | null,
        newValue: string | null
    ) => {
        setSelectedItem(newValue!);
    };

    useEffect(() => {
        if (selectedItem == 'content') {
            type.current = 'content'
        } else if (selectedItem == 'chatbox') {
            type.current = 'chatbox'
        } else if (selectedItem == 'scraping') {
            type.current = 'link'
        }
    }, [selectedItem, type]);

    const handleRadioChange = (e: any) => {
        type.current = e.target.value
    };


    return (
        <aside
            className={`flex-shrink-0 sidebar ${toggleSidebarRight ? "expanded" : "compact"
                }`}
            id="sidebar-right"
        >
            <div
                className="w-full h-full flex flex-col justify-between inner"
                ref={isMobile ? sideNavRef : refNull}
            >
                <div className="h-11 border-b border-solid border-gray-300 flex items-center justify-between whitespace-nowrap">
                    <h2 className="grow text-base font-medium">Run settings</h2>
                    <Button
                        variant="plain"
                        sx={{
                            fontFamily: "var(--font)",
                            fontWeight: 400,
                            color: "var(--cl-main)",
                            borderRadius: "8px",
                            minHeight: "32px",
                            "&:hover": {
                                background: "var(--bg-color)",
                            },
                        }}
                    >
                        Reset
                    </Button>
                    {isMobile && (
                        <Dropdown>
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
                                            <Option value="chatgpt" >ChatGPT 4o-mini</Option>
                                            <Option value="germini" >Germini 1.5</Option>
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
                                            defaultValue="caready"
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
                                            <Option value="caready">Caready</Option>
                                            <Option value="cosmix">Cosmix</Option>
                                            <Option value="humology">Humology</Option>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="item">
                                    <p className="flex items-center gap-x-2 mb-2">
                                        <span className="material-symbols-outlined">
                                            construction
                                        </span>
                                        <span className="font-medium name">Activities</span>
                                    </p>
                                    <div className="ml-7">
                                        <FormControl className="mr-8 mb-5">
                                            <Select
                                                indicator={<ArrowDropDownOutlined />}
                                                className="w-full custom-select"
                                                name="select-activities"
                                                placeholder="Select Activities"
                                                value={selectedItem}
                                                defaultValue="content"
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
                                                onChange={handleChangeActivities}
                                            >
                                                <Option value="content">Content</Option>
                                                <Option value="chatbox">Chatbox</Option>
                                                {/* <Option value="business">Business</Option> */}
                                                <Option value="scraping">Scraping</Option>
                                            </Select>
                                        </FormControl>
                                        <div className="setting-options">
                                            <RadioGroup
                                                name="content"
                                                orientation="vertical"
                                                defaultValue="content"
                                                className="flex-wrap"
                                                aria-hidden={
                                                    selectedItem == "content" ? false : true
                                                }
                                                onChange={handleRadioChange}
                                            >
                                                <Radio
                                                    value="content"
                                                    label="Content writer"
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
                                                    value="url"
                                                    label="Copy post"
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
                                            <RadioGroup
                                                name="scraping"
                                                orientation="vertical"
                                                defaultValue="link"
                                                className="flex-wrap"
                                                aria-hidden={
                                                    selectedItem == "scraping" ? false : true
                                                }
                                                onChange={handleRadioChange}
                                            >
                                                <Radio
                                                    value="link"
                                                    label="1 Link"
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
                                                    value="multi"
                                                    label="Multi link"
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
                                    "&.MuiIconButton-root:hover": { bgcolor: "#e5e7eb" },
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
                                            "&.MuiIconButton-root:hover": {
                                                bgcolor: "#e5e7eb",
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
                                            "&.MuiIconButton-root:hover": {
                                                bgcolor: "#e5e7eb",
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
    );
};

export default Setting;
