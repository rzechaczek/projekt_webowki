import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    recipeId: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'recipeId' })
    recipe: Recipe;

    @Column()
    name: string;

    @Column({ type: 'float' })
    amount: number;

    @Column()
    unit: string;

    @Column({ nullable: true })
    note: string;

    @Column({ default: 0 })
    orderIndex: number;
}