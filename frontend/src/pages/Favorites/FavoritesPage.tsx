import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoritesApi } from '../../api';
import { RecipeCard } from '../../components/RecipeCard/RecipeCard';
import type { Recipe } from '../../types';
import './FavoritesPage.css';

export function FavoritesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        favoritesApi
            .getAll()
            .then((data) => {
                const recipeList = data
                    .map((fav: { recipe: Recipe }) => fav.recipe)
                    .filter(Boolean);
                setRecipes(recipeList);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleFavoriteChange = (recipeId: string, isFav: boolean) => {
        if (!isFav) {
            setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        }
    };

    return (
        <main className="page">
            <div className="container">
                <div className="favorites-header">
                    <div>
                        <h1 className="favorites-title">Ulubione przepisy</h1>
                        <p className="favorites-subtitle">
                            Twoja prywatna kolekcja ulubionych potraw
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="spinner-wrap">
                        <div className="spinner" />
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">🤍</p>
                        <h3>Brak ulubionych przepisów</h3>
                        <p>
                            Przeglądaj przepisy i klikaj ❤️, aby je tutaj zapisywać
                        </p>
                        <Link
                            to="/"
                            className="btn btn-primary"
                            style={{ marginTop: '1.25rem' }}
                        >
                            Przeglądaj przepisy
                        </Link>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                isFavorite={true}
                                onFavoriteChange={handleFavoriteChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}