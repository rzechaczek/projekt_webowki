import { useState } from 'react';
import type { Ingredient } from '../../types';
import './PortionScaler.css';

interface Props {
    baseServings: number;
    servingUnit: string;
    ingredients: Ingredient[];
}

function formatAmount(value: number): string {
    if (value === 0) return '0';
    if (Number.isInteger(value)) return String(value);
    const rounded = Math.round(value * 100) / 100;
    return parseFloat(rounded.toFixed(2)).toString();
}

export function PortionScaler({
                                  baseServings,
                                  servingUnit,
                                  ingredients,
                              }: Props) {
    const [servings, setServings] = useState(baseServings);

    const ratio = servings / baseServings;

    const decrease = () =>
        setServings((prev) =>
            Math.max(0.5, parseFloat((prev - 1).toFixed(2))),
        );

    const increase = () =>
        setServings((prev) => parseFloat((prev + 1).toFixed(2)));

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) setServings(val);
    };

    const isChanged = servings !== baseServings;

    const sorted = [...ingredients].sort(
        (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
    );

    return (
        <div className="scaler">
            <div className="scaler-top">
                <h2 className="scaler-heading">Składniki</h2>

                <div className="scaler-controls">
                    <button
                        className="scaler-btn"
                        onClick={decrease}
                        aria-label="Zmniejsz porcję"
                    >
                        −
                    </button>

                    <div className="scaler-value">
                        <input
                            className="scaler-input"
                            type="number"
                            min="0.5"
                            step="1"
                            value={servings}
                            onChange={handleInput}
                            aria-label="Liczba porcji"
                        />
                        <span className="scaler-unit">{servingUnit}</span>
                    </div>

                    <button
                        className="scaler-btn"
                        onClick={increase}
                        aria-label="Zwiększ porcję"
                    >
                        +
                    </button>
                </div>

                {isChanged && (
                    <button
                        className="scaler-reset"
                        onClick={() => setServings(baseServings)}
                        title={`Wróć do ${baseServings} ${servingUnit}`}
                    >
                        ↺ Domyślnie: {baseServings} {servingUnit}
                    </button>
                )}
            </div>

            <ul className="scaler-list" aria-label="Lista składników">
                {sorted.map((ing, i) => {
                    const scaledAmount = ing.amount * ratio;
                    return (
                        <li key={ing.id ?? i} className="scaler-item">
              <span className="scaler-amount">
                {formatAmount(scaledAmount)}{' '}
                  <span className="scaler-item-unit">{ing.unit}</span>
              </span>
                            <span className="scaler-name">
                {ing.name}
                                {ing.note && (
                                    <span className="scaler-note"> — {ing.note}</span>
                                )}
              </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}