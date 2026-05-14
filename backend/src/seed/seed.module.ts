import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Recipe } from '../recipes/entities/recipe.entity';
import { RecipeIngredient } from '../recipes/entities/recipe-ingredient.entity';
import { RecipeStep } from '../recipes/entities/recipe-step.entity';
import { Tag } from '../recipes/entities/tag.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Recipe, RecipeIngredient, RecipeStep, Tag]),
    ],
    providers: [SeedService],
})
export class SeedModule {}