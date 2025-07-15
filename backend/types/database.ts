// Database type definitions for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          author_id: string;
          published: boolean;
          created_at: string;
          updated_at: string;
          tags: string[] | null;
          featured_image: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          author_id: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          tags?: string[] | null;
          featured_image?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          author_id?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          tags?: string[] | null;
          featured_image?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content: string;
          demo_url: string | null;
          github_url: string | null;
          tech_stack: string[];
          featured_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          content: string;
          demo_url?: string | null;
          github_url?: string | null;
          tech_stack: string[];
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          content?: string;
          demo_url?: string | null;
          github_url?: string | null;
          tech_stack?: string[];
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          author_id?: string;
          post_id?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          type: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
} 