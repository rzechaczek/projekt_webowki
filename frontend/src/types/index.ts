export interface User {
    id: string;
    email: string;
    username: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface Tag {
    id: string;
    name: string;
}

export interface Ingredient {
    id?: string;
    name: string;
    amount: number;
    unit: string;
    note?: string;
    orderIndex?: number;
}

export interface Step {
    id?: string;
    stepNumber: number;
    description: string;
}

export interface Recipe {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    baseServings: number;
    servingUnit: string;
    prepTimeMin?: number;
    cookTimeMin?: number;
    isPublic: boolean;
    ownerId?: string;
    ingredients: Ingredient[];
    steps: Step[];
    tags: Tag[];
    createdAt: string;
}

export interface CreateRecipePayload {
    title: string;
    description?: string;
    baseServings: number;
    servingUnit: string;
    prepTimeMin?: number;
    cookTimeMin?: number;
    isPublic: boolean;
    ingredients: Omit<Ingredient, 'id'>[];
    steps: Omit<Step, 'id'>[];
    tags: string[];
}