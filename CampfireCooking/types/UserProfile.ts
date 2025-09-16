export interface UserProfile {
    _id: string;
    username: string;
    email: string;
    image?: string;
    bio?: string;
    createdAt?: string;
    followers?: string[]; // ids
    following?: string[]; // ids
    created_recipes?: string[]; // ids
    saved_recipes?: string[]; // ids
    ingredients?: string[]; // ids
  };