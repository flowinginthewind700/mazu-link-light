export interface Category {
    id: string;
    name: string;
  }
  
  export interface Tool {
    id: string;
    name: string;
    Description: string;
    iconimage: {
      formats: any;
      url: string;
    };
  }
  
  export interface FeatureTool {
    id: string;
    title: string;
    description: string;
    image: string;
    linkType: 'internal' | 'external';
    link: string;
  }
  