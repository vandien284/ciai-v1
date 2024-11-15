"use client";
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import { useTheme } from "next-themes";
import { useSelector, useDispatch } from "react-redux";
import { setModel, setCompany } from "@/app/store/slice";

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
import {
  Collapse,
  Tooltip,
  Popover,
  Popper,
  ClickAwayListener,
} from "@mui/material";

import { useOutsideClick } from "outsideclick-react";
import { GetApiCategorys, GetApiCompanies } from "../Service/ListenToAPI";
import RadioComponents from "./RadioComponents";

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

interface ChildProps {
  toggleSidebarRight: boolean;
  setToggleSidebarRight: React.Dispatch<React.SetStateAction<boolean>>;
  type: MutableRefObject<string>;
  modelChoose :string;
  setModelChoose: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  activitie: IActivitieRespones | undefined,
  setActivitie: React.Dispatch<React.SetStateAction<IActivitieRespones | undefined>>,
  categorys: ICategoryRespones[],
  setCategorys: React.Dispatch<React.SetStateAction<ICategoryRespones[]>>
  category: ICategoryRespones | undefined,
  setCategory: React.Dispatch<React.SetStateAction<ICategoryRespones | undefined>>
}

const Setting: React.FC<ChildProps> = ({
  toggleSidebarRight,
  setToggleSidebarRight,
  type,
  modelChoose,
  setModelChoose,
  setContent,
  activitie,
  setActivitie,
  categorys,
  setCategorys,
  category,
  setCategory
}) => {
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

  const [companys, setCompanys] = useState<ICompanieRespones[]>([]);
  


  useEffect(() => {
    if (selectedItem == "content") {
      type.current = "content";
    } else if (selectedItem == "chatbox") {
      type.current = "chatbox";
    } else if (selectedItem == "scraping") {
      type.current = "link";
    }
  }, [selectedItem, type]);


  const model = useSelector((state: any) => state.store.model);
  const company = useSelector((state: any) => state.store.company);
  const dispatch = useDispatch();

  const handleChangeCompany = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    dispatch(setCompany(newValue!));
  };

  const handleChangeModel = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    dispatch(setModel(newValue!));
  };

  const resetSetting = () => {
    setModelChoose(Models[0].model)
    if (typeof window !== "undefined") {
      localStorage.setItem('model',Models[0].model);
    }
    setCategory(undefined)
  };

  useEffect(() => {
    GetApiCompanies(setCompanys);
    GetApiCategorys(setCategorys);
  },[]);

  const onChangeModel = (
    event:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | React.FocusEvent<Element, Element>
    | null,
    value: string | null
  ) => {
    if (value) {
      setModelChoose(value);
      if (typeof window !== "undefined" && value) {
        localStorage.setItem("model", value.toString());
      }

    }
  };

  const onChangeActivitie = (
    event:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | React.FocusEvent<Element, Element>
    | null,
    value: number | null
  ) => {
    const temp = categorys.find(item => item.id === value);
    setCategory(temp)
    if(temp && temp.attributes.activities.data.length > 0)
    {
      setActivitie(temp.attributes.activities.data[0]);
    }
  }

  return (
    <aside
      className={`flex-shrink-0 sidebar ${
        toggleSidebarRight ? "expanded" : "compact"
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
            onClick={resetSetting}
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
              <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              maxWidth: "12rem",
                              bgcolor: "var(--cl-neutral-8)",
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
                    color: "var(--cl-primary)",
                    "&:hover": {
                      background: "var(--cl-item-dropdown) !important",
                      color: "var(--cl-primary) !important",
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
                    color: "var(--cl-primary)",
                    "&:hover": {
                      background: "var(--cl-item-dropdown) !important",
                      color: "var(--cl-primary) !important",
                    },
                  }}
                >
                  <span className="material-symbols-outlined">assignment</span>
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
                      defaultValue={model}
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
                          color: "var(--cl-primary)",
                          [`&.${selectClasses.expanded}`]: {
                            transform: "rotate(-180deg)",
                          },
                        },
                      }}
                      slotProps={{
                        listbox: {
                          sx: {
                            py: 0,
                            borderColor: "var(--cl-neutral-20)",
                            bgcolor: "var(--cl-bg-dropdown)",
                            borderRadius: "8px",
                            width: "100%",
                            fontFamily: "var(--font)",
                            fontSize: "0.875rem",
                            "& .MuiOption-root": {
                              color: "var(--cl-primary)",
                            },
                            "& .MuiOption-root:hover": {
                              bgcolor:
                                "var(--cl-item-dropdown)!important",
                              color: "var(--cl-primary)!important",
                            },
                            "& .MuiOption-root.Mui-selected": {
                              bgcolor: "var(--cl-item-dropdown)",
                              color: "var(--cl-primary-70)!important",
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
                    </Select>
                  </FormControl>
                </div>
                <div className="item">
                  <p className="flex items-center gap-x-2 mb-2">
                    <span className="material-symbols-outlined">home_work</span>
                    <span className="font-medium name">Company</span>
                  </p>
                  <FormControl className="ml-7 mr-8">
                    <Select
                      indicator={<ArrowDropDownOutlined />}
                      className="w-full custom-select"
                      name="select-company"
                      placeholder="Select Company"
                      defaultValue={company}
                      value={company}
                      onChange={handleChangeCompany}
                      sx={{
                        fontFamily: "var(--font)",
                        fontSize: "0.875rem",
                        "& .MuiSelect-button": {
                          opacity: 1,
                        },
                        [`& .${selectClasses.indicator}`]: {
                          transition: "0.2s",
                          color: "var(--cl-primary)",
                          [`&.${selectClasses.expanded}`]: {
                            transform: "rotate(-180deg)",
                          },
                        },
                      }}
                      slotProps={{
                        listbox: {
                          sx: {
                            py: 0,
                            borderColor: "var(--cl-neutral-20)",
                            bgcolor: "var(--cl-bg-dropdown)",
                            borderRadius: "8px",
                            width: "100%",
                            fontFamily: "var(--font)",
                            fontSize: "0.875rem",
                            "& .MuiOption-root": {
                              color: "var(--cl-primary)",
                            },
                            "& .MuiOption-root.MuiOption-highlighted": {
                              bgcolor: "transparent!important",
                            },
                            "& .MuiOption-root:hover": {
                              bgcolor:
                                "var(--cl-item-dropdown)!important",
                              color: "var(--cl-primary)!important",
                            },
                            "& .MuiOption-root.Mui-selected": {
                              bgcolor:
                                "var(--cl-item-dropdown)!important",
                              color: "var(--cl-primary-70)!important",
                            },
                          },
                        },
                      }}
                    >
                      {
                        companys.map((company, index) => (
                          <Option key={index} value="caready">{company.attributes.name}</Option>
                        ))
                      }
                    </Select>
                  </FormControl>

                </div>
                <div className="item">
                  <p className="flex items-center gap-x-2 mb-2">
                    <span className="material-symbols-outlined">
                    category
                    </span>
                    <span className="font-medium name">Module</span>
                  </p>
                  <div className="ml-7">
                    <FormControl className="mr-8 mb-5">
                      <Select
                        indicator={<ArrowDropDownOutlined />}
                        className="w-full custom-select"
                        name="select-activities"
                        placeholder="Select Module"
                        value={category?.id??0}
                        sx={{
                          fontFamily: "var(--font)",
                          fontSize: "0.875rem",
                          "& .MuiSelect-button": {
                            opacity: 1,
                          },
                          [`& .${selectClasses.indicator}`]: {
                            transition: "0.2s",
                            color: "var(--cl-primary)",
                            [`&.${selectClasses.expanded}`]: {
                              transform: "rotate(-180deg)",
                            },
                          },
                        }}
                        slotProps={{
                          listbox: {
                            sx: {
                              py: 0,
                              borderColor: "var(--cl-neutral-20)",
                              bgcolor: "var(--cl-bg-dropdown)",
                              borderRadius: "8px",
                              width: "100%",
                              fontFamily: "var(--font)",
                              fontSize: "0.875rem",
                              "& .MuiOption-root": {
                                color: "var(--cl-primary)",
                              },
                              "& .MuiOption-root.MuiOption-highlighted": {
                                bgcolor: "transparent!important",
                              },
                              "& .MuiOption-root:hover": {
                                bgcolor:
                                  "var(--cl-item-dropdown)!important",
                                color: "var(--cl-primary)!important",
                              },
                              "& .MuiOption-root.Mui-selected": {
                                bgcolor:
                                  "var(--cl-item-dropdown)!important",
                                color: "var(--cl-primary-70)!important",
                              },
                            },
                          },
                        }}
                        onChange={onChangeActivitie}
                      >
                        {
                          categorys.map((category, index) => (
                            <Option key={index} value={category.id}>{category.attributes.title}</Option>
                          ))
                        }
                      </Select>
                    </FormControl>
                    <div className="setting-options">
                      
                      {
                        category && category?.attributes.activities.data.length > 0
                        &&
                        <p className="flex items-center gap-x-2 mb-2">
                        <span className="font-medium name">
                          Prompt model
                        </span>
                      </p>
                      }
                      {
                        category
                        &&
                        <RadioComponents
                          data={category?.attributes.activities.data} 
                          setContent={setContent}
                          activitieId={activitie?.id??0}
                          />
                      }
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
                <span className="material-symbols-outlined">chevron_right</span>
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
                      color: "var(--cl-primary)",
                      "&.MuiIconButton-root:hover": {
                        bgcolor: "var(--cl-neutral-20)",
                        color: "var(--cl-primary)",
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
                      color: "var(--cl-primary)",
                      "&.MuiIconButton-root:hover": {
                        bgcolor: "var(--cl-neutral-20)",
                        color: "var(--cl-primary)",
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
