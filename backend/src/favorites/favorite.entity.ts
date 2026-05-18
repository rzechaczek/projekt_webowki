import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Recipe } from '../recipes/entities/recipe.entity';

@Entity('favorites')
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.favorites, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    recipeId: string;

    @ManyToOne(() => Recipe, {
        onDelete: 'CASCADE',
        eager: true,
    })
    @JoinColumn({ name: 'recipeId' })
    recipe: Recipe;

    @CreateDateColumn()
    addedAt: Date;
}