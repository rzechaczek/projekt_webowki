import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { RecipeStep } from './entities/recipe-step.entity';
import { Tag } from './entities/tag.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Recipe, RecipeIngredient, RecipeStep, Tag]),
    ],
    providers: [RecipesService],
    controllers: [RecipesController],
    exports: [RecipesService],
})
export class RecipesModule {}