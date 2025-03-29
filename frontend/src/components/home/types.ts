export interface Category {
    id: string;
    name: string;
    agitools: Tool[];
  }
  
export interface Tool {
    id: string;
    name: string;
    Description: string;
    description?: string;
    iconimage: {
      formats?: {
        thumbnail?: {
          url: string;
        };
      };
      url: string;
    };
    image?: string;
    accessLink: string;
    internalPath: string | null;
    category: string;
    tags?: string[];
    pricing?: string;
    author?: string;
    submissionDate?: string;
    content?: string;
  }
  
  export interface FeatureTool {
    id: string;
    title: string;
    description: string;
    image: string;
    linkType: 'internal' | 'external';
    link: string;
  }
  