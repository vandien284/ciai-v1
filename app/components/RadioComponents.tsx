import { Radio, RadioGroup, Button } from "@mui/joy"
import { MutableRefObject, useEffect, useState } from "react"

interface IPros{
    data: IActivitieRespones[],
    setContent: React.Dispatch<React.SetStateAction<string>>;
    activitieRef: MutableRefObject<string>;
    activitieId: number
}

interface radio{
    id: number,
    name: string
}

const RadioComponents = (
    {
        data,
        setContent,
        activitieRef,
        activitieId
    }: IPros,
    
) => {

    const [radios, setRadios] = useState<radio[]>([]);
    const [radioId, setRadioId] = useState(0);
    useEffect(() => {
        if (Array.isArray(data)) {
          const temp: radio[] = data.map(item => ({
              id: item.id,
              name: item.attributes?.name || '', 
          }));

          if(activitieId == 0 && temp && temp.length > 0)
          {
              setRadioId(temp[0].id);
          } else if(activitieId != 0 && temp && temp.length > 0)
          {
            setRadioId(activitieId);
          }
  
          setRadios(temp);
        }
        if(data && data.length > 0)
        {
            setContent(data[0].attributes.prompt_default?? "");
        }
    }, [data]);

    const handleRadioChange = (id: number) => {
        const temp = data.find(item => item.id === id);
        if(temp)
        {
            setContent(temp.attributes.prompt_default?? "")
            setRadioId(temp.id);
            if(temp.attributes.value) {
              activitieRef.current = temp.attributes.value
            } else {
              activitieRef.current = temp.id.toString()
            }
        }
    };

    return(
      //   <RadioGroup
      //   name="content"
      //   orientation="vertical"
      //   className="flex-wrap"
      //   value={radioId}
      //   onChange={handleRadioChange}
      //   >
      //     {
      //       radios.map((item, index) => (
      //         <Radio
      //           key={index}
      //           value={item.id}
      //           label={item.name}
      //           sx={{
      //             ml: 0,
      //             fontFamily: "var(--font)",
      //             fontSize: "0.875rem",
      //             "&.MuiRadio-root": {
      //               gap: "6px",
      //               color: "var(--cl-primary)",
      //             },
      //             "& .MuiRadio-radio": {
      //               background: "none",
      //               borderColor: "var(--cl-primary)",
      //               ":hover": {
      //                 background: "none",
      //               },
      //               "&.Mui-checked .MuiRadio-icon": {
      //                 bgcolor: "var(--cl-primary)",
      //               },
      //             },
      //           }}
      //         />
      //       ))
      //     }
      // </RadioGroup>
      <div className="-ml-2 mr-8">
        {
          radios.map((item, index) => (
            <Button
              key={index}
              variant="plain"
              aria-label={item.name}
              sx={{
                pl: 0,
                pr: 1,
                py: 0,
                justifyContent: "flex-start",
                fontFamily: "var(--font)",
                color: "var(--cl-neutral-80)",
                borderRadius: "20px",
                "&.MuiButton-root:hover": {
                  background: "var(--cl-item-dropdown)",
                },
              }}
              className={radioId == item.id ? "w-full sidebar-btn active" : "w-full sidebar-btn"}
              onClick={() => handleRadioChange(item.id)}
            >
              <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">
                  chat_bubble
                </span>
              </span>
              <span className="whitespace-nowrap opacity-transition font-normal leading-snug name">
                {item.name}
              </span>
            </Button>
          ))}

      </div>
    )
}

export default RadioComponents;