
interface ICompanieRespones {
    id: number;
    attributes: {
        name: string;
        value: string | null;
        logo: string | null;
    }
}

interface IActivitieRespones {
    id: number;
    attributes: {
      name: string;
      value: string | null;
      prompt_default: string | null;
    };
}
  
interface ICategoryRespones {
    id: number;
    attributes: {
      title: string;
      activities: {
        data: IActivitieRespones[];
      };
    };
}
  