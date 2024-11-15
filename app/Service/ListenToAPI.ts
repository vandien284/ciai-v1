import axios from "axios"
import { PromptGalleriesRespose } from "../ModelsCustom/Respone/PromptGalleriesRespose";

const url_api = process.env.NEXT_PUBLIC_API?? "";

export const GetApiCompanies = async (
    setCompanies: React.Dispatch<React.SetStateAction<ICompanieRespones[]>>
  ) => {
    try
    {
        const response = await axios.get<{data: ICompanieRespones[]}>(`${url_api}/api/companies`);
        if (response.status === 200) {
            setCompanies(response.data.data);
        }
    } catch (error)
    {
        console.error("Error fetching companies:", error);
        setCompanies([]);
    }
};


export const GetApiCategorys = async (
    setCategorys: React.Dispatch<React.SetStateAction<ICategoryRespones[]>>
  ) => {
    try
    {
      
      const response = await axios.get<{data: ICategoryRespones[]}>(`${url_api}/api/categories?fields[0]=id&fields[1]=title&populate[activities][fields][0]=id&populate[activities][fields][1]=name&populate[activities][fields][2]=value&populate[activities][fields][3]=prompt_default`);
      if (response.status === 200) {
        setCategorys(response.data.data);
      }
    } catch (error)
    {
      console.error("Error fetching companies:", error);
      setCategorys([]);
    }
};

export const GetApiPromptGalleries = async(
  setPromptGalleriesRespose: React.Dispatch<React.SetStateAction<PromptGalleriesRespose[]>>
) => {
  try
  {
    const response = await axios.get<{data: PromptGalleriesRespose[]}>(`${url_api}/api/prompt-galleries?populate=*`);
    if (response.status === 200) {
      setPromptGalleriesRespose(response.data.data);
    }
  } catch (error)
  {
    console.error("Error fetching companies:", error);
    setPromptGalleriesRespose([]);
  }
}