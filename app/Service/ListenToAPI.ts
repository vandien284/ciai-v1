import axios from "axios"

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


export const GetApiActivities = async (
    setCompanies: React.Dispatch<React.SetStateAction<IActivitieRespones[]>>
  ) => {
    try
    {
        const response = await axios.get<{data: IActivitieRespones[]}>(`${url_api}/api/categories?fields[0]=id&fields[1]=title&populate[activities][fields][0]=id&populate[activities][fields][1]=name&populate[activities][fields][2]=value`);
        if (response.status === 200) {
            setCompanies(response.data.data);
        }
    } catch (error)
    {
        console.error("Error fetching companies:", error);
        setCompanies([]);
    }
};
export const test = () => {
    debugger;
    const exampleObj: ICategoryRespones = {
        id: 1,
        attributes: {
          name: 'Content creator',
          activities: {
            data: [
              {
                id: 1,
                attributes: {
                  name: 'Post for website',
                  value: null,
                },
              },
              {
                id: 2,
                attributes: {
                  name: 'Post for fanpage',
                  value: null,
                },
              },
            ],
          },
        },
      };

      const a = convertToQueryString(exampleObj);
      const b = 0;
}
  
export const convertToQueryString = (obj: object): string => {
    // Initialize an array to store the parts of the query string
    const queryParts: string[] = [];
    const queryParts1: string[] = [];
  
    // Check if the object has 'id' and 'attributes' properties
    if ('id' in obj) {
      queryParts.push(`fields[${queryParts.length}]=id`);
    }
  
    if ('attributes' in obj) {
        debugger;
      const attributes = (obj as any).attributes;
      if (attributes && typeof attributes === 'object') {
        const attributeKeys = Object.keys(attributes); // ['name', 'value']
  
        // Add nested attribute fields like 'name' and 'value'
        attributeKeys.forEach((attrKey, attrIndex) => {
          if(attrKey in attributes && typeof attributes !== 'object')
          {
            queryParts.push(`fields[${queryParts.length}]=${attrKey}`);
          }
          else if(attrKey in attributes && typeof attributes === 'object')
          {
            queryParts1.push(`populate[${attrKey}][fields][${queryParts1.length}]`)
          }
        });

      }
    }
  
    return queryParts.join('&');
};
  