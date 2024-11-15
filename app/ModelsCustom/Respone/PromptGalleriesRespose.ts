interface IDescriptionChild {
    text: string;
    type: string;
  }
  
  interface IDescription {
    type: string;
    children: IDescriptionChild[];
  }
  
  interface IAttributes {
    title: string;
    description: IDescription[];
    icon: string | null;
    prompt: string;
    activity: {
      data: IActivitieRespones
    };
  }
  
export  interface PromptGalleriesRespose {
    id: number;
    attributes: IAttributes;
}
  