import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipesApi, favoritesApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PortionScaler } from '../../components/PortionScaler/PortionScaler';
import type { Recipe } from '../../types';
import './RecipeDetailPage.css';

export function RecipeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isFav, setIsFav] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError('');

        recipesApi
            .getById(id)
            .then(async (data) => {
                setRecipe(data);
                if (isAuthenticated) {
                    try {
                        const ids = await favoritesApi.getIds();
                        setIsFav(ids.includes(data.id));
                    } catch {

                    }
                }
            })
            .catch(() => setError('Nie znaleziono przepisu.'))
            .finally(() => setLoading(false));
    }, [id, isAuthenticated]);

    const toggleFavorite = async () => {
        if (!recipe || favLoading) return;
        setFavLoading(true);
        try {
            if (isFav) {
                await favoritesApi.remove(recipe.id);
                setIsFav(false);
            } else {
                await favoritesApi.add(recipe.id);
                setIsFav(true);
            }
        } finally {
            setFavLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="spinner-wrap">
                <div className="spinner" />
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <p className="empty-icon">😕</p>
                        <h3>{error || 'Brak przepisu'}</h3>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '1rem' }}
                            onClick={() => navigate('/')}
                        >
                            Wróć do listy
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalTime =
        (recipe.prepTimeMin || 0) + (recipe.cookTimeMin || 0);

    const sortedSteps = [...recipe.steps].sort(
        (a, b) => a.stepNumber - b.stepNumber,
    );

    return (
        <div className="page detail-page">
            <div className="container">
                <button
                    className="detail-back"
                    onClick={() => navigate(-1)}
                    aria-label="Wróć"
                >
                    ← Wróć
                </button>

                <div className="detail-layout">
                    <aside className="detail-sidebar">
                        <div className="detail-hero">
                            {recipe.imageUrl ? (
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.title}
                                    className="detail-hero-img"
                                />
                            ) : (
                                <div className="detail-hero-placeholder">
                                    <span className="detail-hero-emoji">🍽️</span>
                                </div>
                            )}
                        </div>

                        <div className="detail-info card">
                            <div className="detail-tags">
                                {recipe.tags.map((t) => (
                                    <span key={t.id} className="badge">
                    {t.name}
                  </span>
                                ))}
                            </div>

                            <h1 className="detail-title">{recipe.title}</h1>

                            {recipe.description && (
                                <p className="detail-desc">{recipe.description}</p>
                            )}

                            {(recipe.prepTimeMin ||
                                recipe.cookTimeMin ||
                                totalTime > 0) && (
                                <div className="detail-meta">
                                    {recipe.prepTimeMin ? (
                                        <div className="detail-meta-item">
                      <span className="detail-meta-label">
                        Przygotowanie
                      </span>
                                            <span className="detail-meta-value">
                        {recipe.prepTimeMin} min
                      </span>
                                        </div>
                                    ) : null}
                                    {recipe.cookTimeMin ? (
                                        <div className="detail-meta-item">
                      <span className="detail-meta-label">
                        Gotowanie
                      </span>
                                            <span className="detail-meta-value">
                        {recipe.cookTimeMin} min
                      </span>
                                        </div>
                                    ) : null}
                                    {totalTime > 0 ? (
                                        <div className="detail-meta-item">
                                            <span className="detail-meta-label">Łącznie</span>
                                            <span className="detail-meta-value">
                        {totalTime} min
                      </span>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {isAuthenticated && recipe.isPublic && (
                                <button
                                    className={`btn ${isFav ? 'btn-danger' : 'btn-secondary'} detail-fav-btn`}
                                    onClick={toggleFavorite}
                                    disabled={favLoading}
                                >
                                    {isFav ? '❤️ Usuń z ulubionych' : '🤍 Dodaj do ulubionych'}
                                </button>
                            )}
                        </div>
                    </aside>

                    <div className="detail-main">
                        <PortionScaler
                            baseServings={recipe.baseServings}
                            servingUnit={recipe.servingUnit}
                            ingredients={recipe.ingredients}
                        />

                        <div className="detail-steps card">
                            <h2 className="detail-steps-heading">Przygotowanie</h2>
                            <ol className="steps-list" aria-label="Kroki przygotowania">
                                {sortedSteps.map((step) => (
                                    <li
                                        key={step.id ?? step.stepNumber}
                                        className="step-item"
                                    >
                    <span
                        className="step-number"
                        aria-hidden="true"
                    >
                      {step.stepNumber}
                    </span>
                                        <p className="step-desc">{step.description}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}