import { useState, useEffect, useCallback } from 'react';
import { recipesApi } from '../../api';
import { RecipeCard } from '../../components/RecipeCard/RecipeCard';
import { AddRecipeModal } from '../../components/AddRecipeModal/AddRecipeModal';
import type { Recipe } from '../../types';
import './MyRecipesPage.css';

export function MyRecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const loadRecipes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await recipesApi.getMine();
            setRecipes(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    const handleDelete = async (id: string) => {
        try {
            await recipesApi.remove(id);
            setRecipes((prev) => prev.filter((r) => r.id !== id));
        } catch {
            alert('Nie udało się usunąć przepisu');
        }
    };

    return (
        <main className="page">
            <div className="container">
                <div className="myrecipes-header">
                    <div>
                        <h1 className="myrecipes-title">Moje przepisy</h1>
                        <p className="myrecipes-subtitle">
                            Prywatne przepisy widoczne tylko dla Ciebie
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Dodaj przepis
                    </button>
                </div>

                {loading ? (
                    <div className="spinner-wrap">
                        <div className="spinner" />
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">📝</p>
                        <h3>Nie masz jeszcze własnych przepisów</h3>
                        <p>Stwórz swój pierwszy prywatny przepis</p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '1.25rem' }}
                            onClick={() => setShowModal(true)}
                        >
                            + Dodaj pierwszy przepis
                        </button>
                    </div>
                ) : (
                    <div className="myrecipes-grid">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                showDelete
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <AddRecipeModal
                    onClose={() => setShowModal(false)}
                    onCreated={loadRecipes}
                />
            )}
        </main>
    );
}