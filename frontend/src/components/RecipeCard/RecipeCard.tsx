import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { favoritesApi } from '../../api';
import type { Recipe } from '../../types';
import './RecipeCard.css';

interface Props {
    recipe: Recipe;
    isFavorite?: boolean;
    onFavoriteChange?: (recipeId: string, isFav: boolean) => void;
    onDelete?: (recipeId: string) => void;
    showDelete?: boolean;
}

const CARD_GRADIENTS = [
    'linear-gradient(135deg, #EEF2FF, #C7D2FE)',
    'linear-gradient(135deg, #F0FDF4, #BBF7D0)',
    'linear-gradient(135deg, #FFF7ED, #FED7AA)',
    'linear-gradient(135deg, #FDF4FF, #E9D5FF)',
    'linear-gradient(135deg, #F0F9FF, #BAE6FD)',
    'linear-gradient(135deg, #FFF1F2, #FECDD3)',
];

function getGradient(id: string): string {
    const index =
        id.charCodeAt(0) % CARD_GRADIENTS.length;
    return CARD_GRADIENTS[index];
}

const CARD_EMOJIS: Record<string, string> = {
    śniadanie: '🥞',
    deser: '🍰',
    zupa: '🍲',
    obiad: '🍽️',
    mięsne: '🥩',
    tradycyjne: '🇵🇱',
    wegetariańskie: '🥗',
};

function getEmoji(tags: { name: string }[]): string {
    for (const tag of tags) {
        if (CARD_EMOJIS[tag.name]) return CARD_EMOJIS[tag.name];
    }
    return '🍴';
}

export function RecipeCard({
                               recipe,
                               isFavorite = false,
                               onFavoriteChange,
                               onDelete,
                               showDelete = false,
                           }: Props) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [favLoading, setFavLoading] = useState(false);

    const totalTime =
        (recipe.prepTimeMin || 0) + (recipe.cookTimeMin || 0);

    const handleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated || favLoading) return;
        setFavLoading(true);
        try {
            if (isFavorite) {
                await favoritesApi.remove(recipe.id);
                onFavoriteChange?.(recipe.id, false);
            } else {
                await favoritesApi.add(recipe.id);
                onFavoriteChange?.(recipe.id, true);
            }
        } catch {
            // ignore
        } finally {
            setFavLoading(false);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Usunąć przepis "${recipe.title}"?`)) {
            onDelete?.(recipe.id);
        }
    };

    return (
        <article
            className="recipe-card"
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/recipes/${recipe.id}`);
            }}
        >
            <div
                className="recipe-card-img"
                style={{ background: getGradient(recipe.id) }}
            >
                {recipe.imageUrl ? (
                    <img src={recipe.imageUrl} alt={recipe.title} />
                ) : (
                    <span className="recipe-card-emoji">
            {getEmoji(recipe.tags)}
          </span>
                )}

                {isAuthenticated && !showDelete && (
                    <button
                        className={`recipe-card-fav ${isFavorite ? 'recipe-card-fav--active' : ''}`}
                        onClick={handleFavorite}
                        disabled={favLoading}
                        aria-label={
                            isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'
                        }
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                )}
            </div>

            <div className="recipe-card-body">
                <div className="recipe-card-tags">
                    {recipe.tags.slice(0, 2).map((t) => (
                        <span key={t.id} className="badge">
              {t.name}
            </span>
                    ))}
                </div>

                <h3 className="recipe-card-title">{recipe.title}</h3>

                {recipe.description && (
                    <p className="recipe-card-desc">{recipe.description}</p>
                )}

                <div className="recipe-card-meta">
          <span>
            🍽️ {recipe.baseServings} {recipe.servingUnit}
          </span>
                    {totalTime > 0 && <span>⏱️ {totalTime} min</span>}
                </div>

                {showDelete && (
                    <button
                        className="btn btn-danger btn-sm recipe-card-delete"
                        onClick={handleDelete}
                    >
                        Usuń przepis
                    </button>
                )}
            </div>
        </article>
    );
}