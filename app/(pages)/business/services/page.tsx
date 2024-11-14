import axios from "axios";

export const GetPromptBusinessWithType = async (type: string) => {
  let url = "";
  switch (type) {
    case "search":
      url = "https://cms.ciai.byte.vn/api/prompt-brokers/5";
      break;
    case "chart":
      url = "https://cms.ciai.byte.vn/api/prompt-brokers/4";
      break;
    case "compare":
      url = "https://cms.ciai.byte.vn/api/prompt-brokers/2";
      break;
    case "estimate":
      url = "https://cms.ciai.byte.vn/api/prompt-brokers/1";
      break;
    case "revenue":
      url = "https://cms.ciai.byte.vn/api/prompt-brokers/3";
      break;
    default:
      url = "https://cms.ciai.byte.vn/api/prompt-brokers/5";
      break;
  }

  const res = await axios.get<any>(url);
  if (res.status === 200) {
    return res.data.attributes.prompt;
  }
};
