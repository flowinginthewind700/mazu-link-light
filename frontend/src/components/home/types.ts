export interface Category {
    id: string;
    name: string;
    agitools: Tool[];
  }
  
export interface Tool {
    id: string;
    name: string;
    Description: string;
    iconimage: {
      formats?: {
        thumbnail?: {
          url: string;
        };
      };
      url: string;
    };
    accessLink: string;
    internalPath: string | null;
  }
  
  export interface FeatureTool {
    id: string;
    title: string;
    description: string;
    image: string;
    linkType: 'internal' | 'external';
    link: string;
  }
  