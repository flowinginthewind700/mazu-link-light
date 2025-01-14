// types.ts

export interface Category {
    id: string;
    name: string;
    slug: string;
  }
  
  export interface BlogPost {
    id: number;
    title: string;
    description: string;
    slug: string;
    date: string;
    category: Category;
    cover: Array<{
      formats: {
        small: {
          url: string;
        };
      };
    }>;
    content?: string;  // 添加这个字段，因为在搜索结果中可能会用到
  }
  
  // 如果你需要为搜索结果定义一个单独的类型，可以这样做：
  export interface SearchResult extends BlogPost {
    // 可以在这里添加搜索特有的字段，比如相关度得分
    score?: number;
  }
  
  // 如果你需要定义API响应的类型，可以这样做：
  export interface BlogPostsResponse {
    posts: BlogPost[];
    totalCount: number;
  }
  
  // 如果你需要定义搜索响应的类型，可以这样做：
  export interface SearchResponse {
    results: SearchResult[];
    totalCount: number;
  }
  