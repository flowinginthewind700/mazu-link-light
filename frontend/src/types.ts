// src/types.ts
export interface Author {
    id: number;
    userid: string;
    name: string;
    avatar?: {
      url: string;
    };
  }
  
  export interface CoverImage {
    url: string;
  }
  
  export interface Post {
    id: number;
    title: string;
    content: string;
    description: string;
    cover?: CoverImage[];
    author?: Author;
    created_at: string;
    category?: {
      name: string;
      slug: string;
    };
  }
  