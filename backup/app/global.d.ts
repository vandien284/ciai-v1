
export interface Posts {
    id: number;
    attributes: {
        content: any;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        prompt: string;
        status: boolean;
        save: boolean;
    };
}

export interface Messages {
    id: number;
    attributes: {
        name: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        uid: string;
        posts: Posts[];
    };
}

interface CustomPopover {
    anchorEl: null | HTMLElement;
    child: any;
}