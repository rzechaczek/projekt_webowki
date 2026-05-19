import api from './client';
import type { AuthResponse, Recipe, Tag, CreateRecipePayload } from '../types';

export const authApi = {
    register: (data: {
        email: string;
        username: string;
        password: string;
    }) =>
        api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

    login: (data: { email: string; password: string }) =>
        api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

    profile: () => api.get('/auth/profile').then((r) => r.data),
};

export const recipesApi = {
    getPublic: (search?: string, tag?: string) => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (tag) params.tag = tag;
        return api.get<Recipe[]>('/recipes', { params }).then((r) => r.data);
    },

    getMine: () =>
        api.get<Recipe[]>('/recipes/my').then((r) => r.data),

    getById: (id: string) =>
        api.get<Recipe>(`/recipes/${id}`).then((r) => r.data),

    getTags: () =>
        api.get<Tag[]>('/recipes/tags').then((r) => r.data),

    create: (data: CreateRecipePayload) =>
        api.post<Recipe>('/recipes', data).then((r) => r.data),

    remove: (id: string) =>
        api.delete(`/recipes/${id}`),
};

export const favoritesApi = {
    getAll: () =>
        api.get('/favorites').then((r) => r.data),

    getIds: () =>
        api.get<string[]>('/favorites/ids').then((r) => r.data),

    add: (recipeId: string) =>
        api.post(`/favorites/${recipeId}`).then((r) => r.data),

    remove: (recipeId: string) =>
        api.delete(`/favorites/${recipeId}`),
};