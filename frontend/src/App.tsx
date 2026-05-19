import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar/Navbar';
import { RecipesPage } from './pages/Recipes/RecipesPage';
import { RecipeDetailPage } from './pages/RecipeDetail/RecipeDetailPage';
import { FavoritesPage } from './pages/Favorites/FavoritesPage';
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import {MyRecipesPage} from './pages/MyRecipes/MyRecipesPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated
        ? <>{children}</>
        : <Navigate to="/login" replace />;
}

export function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<RecipesPage />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/favorites"
                    element={
                        <PrivateRoute>
                            <FavoritesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/my-recipes"
                    element={
                        <PrivateRoute>
                            <MyRecipesPage/>
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}