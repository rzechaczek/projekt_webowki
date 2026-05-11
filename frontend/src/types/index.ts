export interface User {
    id: string;
    email: string;
    username: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}