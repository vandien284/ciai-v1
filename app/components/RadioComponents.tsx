import { Radio, RadioGroup } from "@mui/joy"
import { useEffect, useState } from "react"

interface IPros{
    data: IActivitieRespones[],
    setContent: React.Dispatch<React.SetStateAction<string>>;
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

    const handleRadioChange = (e: any) => {
        const value = e.target.value;
        const temp = data.find(item => `${item.id}` === value);
        
        if(temp)
        {
            setContent(temp.attributes.prompt_default?? "")
            setRadioId(temp.id);
        }
    };

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