import { useState, useEffect, useCallback } from 'react';
import { recipesApi, favoritesApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { RecipeCard } from '../../components/RecipeCard/RecipeCard';
import type { Recipe, Tag } from '../../types';
import './RecipesPage.css';

export function RecipesPage() {
    const { isAuthenticated } = useAuth();

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState('');
    const [loading, setLoading] = useState(true);

    const loadRecipes = useCallback(async () => {
        setLoading(true);
        try {
            const [recipesData, tagsData] = await Promise.all([
                recipesApi.getPublic(search || undefined, activeTag || undefined),
                recipesApi.getTags(),
            ]);
            setRecipes(recipesData);
            setTags(tagsData);

            if (isAuthenticated) {
                const ids = await favoritesApi.getIds();
                setFavoriteIds(new Set(ids));
            }
        } finally {
            setLoading(false);
        }
    }, [search, activeTag, isAuthenticated]);

    useEffect(() => {
        const timer = setTimeout(loadRecipes, 300);
        return () => clearTimeout(timer);
    }, [loadRecipes]);

    const handleFavoriteChange = (recipeId: string, isFav: boolean) => {
        setFavoriteIds((prev) => {
            const next = new Set(prev);
            isFav ? next.add(recipeId) : next.delete(recipeId);
            return next;
        });
    };

    const handleTagClick = (tagName: string) => {
        setActiveTag((prev) => (prev === tagName ? '' : tagName));
    };

    return (
        <main className="page recipes-page">
            <div className="container">
                <div className="recipes-header">
                    <div>
                        <h1 className="recipes-title">Przepisy</h1>
                        <p className="recipes-subtitle">
                            Klasyczne polskie smaki w jednym miejscu
                        </p>
                    </div>
                </div>

                <div className="recipes-filters">
                    <div className="recipes-search-wrap">
                        <svg
                            className="recipes-search-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            className="recipes-search"
                            type="search"
                            placeholder="Szukaj przepisu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="recipes-tags">
                        <button
                            className={`tag-pill ${activeTag === '' ? 'tag-pill--active' : ''}`}
                            onClick={() => setActiveTag('')}
                        >
                            Wszystkie
                        </button>
                        {tags.map((t) => (
                            <button
                                key={t.id}
                                className={`tag-pill ${activeTag === t.name ? 'tag-pill--active' : ''}`}
                                onClick={() => handleTagClick(t.name)}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="spinner-wrap">
                        <div className="spinner" />
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">🍽️</p>
                        <h3>Brak przepisów</h3>
                        <p>
                            {search
                                ? `Nie znaleziono wyników dla „${search}"`
                                : 'Brak przepisów w tej kategorii'}
                        </p>
                    </div>
                ) : (
                    <div className="recipes-grid">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                isFavorite={favoriteIds.has(recipe.id)}
                                onFavoriteChange={handleFavoriteChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}