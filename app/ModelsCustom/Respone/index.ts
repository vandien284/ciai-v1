
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
    };
}
  
interface ICategoryRespones {
    id: number;
    attributes: {
      name: string;
      activities: {
        data: IActivitieRespones[];
      };
    };
}
  