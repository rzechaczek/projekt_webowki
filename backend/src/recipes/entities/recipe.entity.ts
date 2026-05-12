import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeStep } from './recipe-step.entity';
import { Tag } from './tag.entity';

@Entity('recipes')
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'float', default: 4 })
    baseServings: number;

    @Column({ default: 'porcje' })
    servingUnit: string;

    @Column({ nullable: true })
    prepTimeMin: number;

    @Column({ nullable: true })
    cookTimeMin: number;

    @Column({ default: false })
    isPublic: boolean;

    @Column({ nullable: true })
    ownerId: string;

    @ManyToOne(() => User, (user) => user.recipes, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @OneToMany(() => RecipeIngredient, (ing) => ing.recipe, {
        cascade: true,
        eager: true,
    })
    ingredients: RecipeIngredient[];

    @OneToMany(() => RecipeStep, (step) => step.recipe, {
        cascade: true,
        eager: true,
    })
    steps: RecipeStep[];

    @ManyToMany(() => Tag, {
        cascade: true,
        eager: true,
    })
    @JoinTable({ name: 'recipe_tags' })
    tags: Tag[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}