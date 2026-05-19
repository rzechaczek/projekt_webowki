import { useState } from 'react';
import { recipesApi } from '../../api';
import type { CreateRecipePayload } from '../../types';
import './AddRecipeModal.css';

interface Props {
    onClose: () => void;
    onCreated: () => void;
}

interface IngRow {
    name: string;
    amount: string;
    unit: string;
    note: string;
}

interface StepRow {
    description: string;
}

const emptyIng = (): IngRow => ({
    name: '',
    amount: '',
    unit: '',
    note: '',
});

const emptyStep = (): StepRow => ({ description: '' });

export function AddRecipeModal({ onClose, onCreated }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [baseServings, setBaseServings] = useState('4');
    const [servingUnit, setServingUnit] = useState('porcje');
    const [prepTimeMin, setPrepTimeMin] = useState('');
    const [cookTimeMin, setCookTimeMin] = useState('');
    const [tags, setTags] = useState('');
    const [ingredients, setIngredients] = useState<IngRow[]>([emptyIng()]);
    const [steps, setSteps] = useState<StepRow[]>([emptyStep()]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const updateIng = (
        index: number,
        field: keyof IngRow,
        value: string,
    ) => {
        setIngredients((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row,
            ),
        );
    };

    const addIng = () =>
        setIngredients((prev) => [...prev, emptyIng()]);

    const removeIng = (index: number) =>
        setIngredients((prev) => prev.filter((_, i) => i !== index));

    const updateStep = (index: number, value: string) => {
        setSteps((prev) =>
            prev.map((row, i) =>
                i === index ? { description: value } : row,
            ),
        );
    };

    const addStep = () =>
        setSteps((prev) => [...prev, emptyStep()]);

    const removeStep = (index: number) =>
        setSteps((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Podaj nazwę przepisu');
            return;
        }

        const servings = parseFloat(baseServings);
        if (isNaN(servings) || servings <= 0) {
            setError('Podaj prawidłową liczbę porcji');
            return;
        }

        const validIngredients = ingredients.filter(
            (i) => i.name.trim() && i.amount && i.unit.trim(),
        );
        if (validIngredients.length === 0) {
            setError('Dodaj przynajmniej jeden składnik');
            return;
        }

        const validSteps = steps.filter((s) => s.description.trim());
        if (validSteps.length === 0) {
            setError('Dodaj przynajmniej jeden krok przygotowania');
            return;
        }

        const payload: CreateRecipePayload = {
            title: title.trim(),
            description: description.trim() || undefined,
            baseServings: servings,
            servingUnit: servingUnit.trim() || 'porcje',
            prepTimeMin: prepTimeMin ? parseInt(prepTimeMin) : undefined,
            cookTimeMin: cookTimeMin ? parseInt(cookTimeMin) : undefined,
            isPublic: false,
            ingredients: validIngredients.map((ing, idx) => ({
                name: ing.name.trim(),
                amount: parseFloat(ing.amount),
                unit: ing.unit.trim(),
                note: ing.note.trim() || undefined,
                orderIndex: idx,
            })),
            steps: validSteps.map((step, idx) => ({
                stepNumber: idx + 1,
                description: step.description.trim(),
            })),
            tags: tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
        };

        setLoading(true);
        try {
            await recipesApi.create(payload);
            onCreated();
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message;
            setError(
                Array.isArray(msg)
                    ? msg.join(', ')
                    : msg || 'Błąd podczas zapisywania przepisu',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Dodaj przepis"
        >
            <div
                className="modal-box"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">Dodaj własny przepis</h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Zamknij"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-body">

                        <section className="modal-section">
                            <h3 className="modal-section-title">Podstawowe informacje</h3>

                            <div className="form-group">
                                <label className="form-label">Nazwa przepisu *</label>
                                <input
                                    className="form-input"
                                    placeholder="np. Naleśniki babci"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Opis (opcjonalny)</label>
                                <textarea
                                    className="form-input modal-textarea"
                                    rows={2}
                                    placeholder="Krótki opis przepisu..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="modal-row-4">
                                <div className="form-group">
                                    <label className="form-label">Porcje *</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="0.5"
                                        step="0.5"
                                        value={baseServings}
                                        onChange={(e) => setBaseServings(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Jednostka</label>
                                    <input
                                        className="form-input"
                                        placeholder="porcje"
                                        value={servingUnit}
                                        onChange={(e) => setServingUnit(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Przyg. (min)</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="0"
                                        placeholder="—"
                                        value={prepTimeMin}
                                        onChange={(e) => setPrepTimeMin(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gotow. (min)</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="0"
                                        placeholder="—"
                                        value={cookTimeMin}
                                        onChange={(e) => setCookTimeMin(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Tagi (oddzielone przecinkami)
                                </label>
                                <input
                                    className="form-input"
                                    placeholder="obiad, szybkie, wegetariańskie"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </section>

                        <section className="modal-section">
                            <h3 className="modal-section-title">Składniki</h3>

                            <div className="ing-list">
                                {ingredients.map((ing, i) => (
                                    <div key={i} className="ing-row">
                                        <input
                                            className="form-input ing-name"
                                            placeholder="Składnik"
                                            value={ing.name}
                                            onChange={(e) =>
                                                updateIng(i, 'name', e.target.value)
                                            }
                                        />
                                        <input
                                            className="form-input ing-amount"
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder="Ilość"
                                            value={ing.amount}
                                            onChange={(e) =>
                                                updateIng(i, 'amount', e.target.value)
                                            }
                                        />
                                        <input
                                            className="form-input ing-unit"
                                            placeholder="Jedn."
                                            value={ing.unit}
                                            onChange={(e) =>
                                                updateIng(i, 'unit', e.target.value)
                                            }
                                        />
                                        <input
                                            className="form-input ing-note"
                                            placeholder="Uwaga (opcj.)"
                                            value={ing.note}
                                            onChange={(e) =>
                                                updateIng(i, 'note', e.target.value)
                                            }
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                className="row-remove-btn"
                                                onClick={() => removeIng(i)}
                                                aria-label="Usuń składnik"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="btn btn-secondary btn-sm modal-add-row-btn"
                                onClick={addIng}
                            >
                                + Dodaj składnik
                            </button>
                        </section>

                        <section className="modal-section">
                            <h3 className="modal-section-title">Kroki przygotowania</h3>

                            <div className="steps-list">
                                {steps.map((step, i) => (
                                    <div key={i} className="step-row">
                                        <span className="step-row-number">{i + 1}</span>
                                        <textarea
                                            className="form-input step-textarea"
                                            rows={2}
                                            placeholder={`Opisz krok ${i + 1}...`}
                                            value={step.description}
                                            onChange={(e) => updateStep(i, e.target.value)}
                                        />
                                        {steps.length > 1 && (
                                            <button
                                                type="button"
                                                className="row-remove-btn"
                                                onClick={() => removeStep(i)}
                                                aria-label="Usuń krok"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="btn btn-secondary btn-sm modal-add-row-btn"
                                onClick={addStep}
                            >
                                + Dodaj krok
                            </button>
                        </section>
                    </div>

                    {error && (
                        <div className="modal-error alert alert-error">
                            {error}
                        </div>
                    )}

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Zapisywanie...' : 'Zapisz przepis'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}