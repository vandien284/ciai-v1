import { Radio, RadioGroup } from "@mui/joy"
import { useEffect, useState } from "react"

interface IPros{
    data: IActivitieRespones[],
    handleRadioChange : (e: any) => void,
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

interface radio{
    id: number,
    name: string
}

const RadioComponents = (
    {
        data,
        handleRadioChange,
        setContent
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



            if(temp && temp.length > 0)
            {
                setRadioId(temp[0].id);
            }
    
            setRadios(temp);
        }
        if(data && data.length > 0)
        {
            setContent(data[0].attributes.prompt_default?? "");
        }
    }, [data]);


    return(
        <RadioGroup
        name="content"
        orientation="vertical"
        className="flex-wrap"
        value={radioId}
        onChange={handleRadioChange}
        >
          {
            radios.map((item, index) => (
              <Radio
                key={index}
                value={item.id}
                label={item.name}
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
            ))
          }
      </RadioGroup>
    )
}

export default RadioComponents;