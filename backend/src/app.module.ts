import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SeedModule } from './seed/seed.module';
import { User } from './users/user.entity';
import { Recipe } from './recipes/entities/recipe.entity';
import { RecipeIngredient } from './recipes/entities/recipe-ingredient.entity';
import { RecipeStep } from './recipes/entities/recipe-step.entity';
import { Tag } from './recipes/entities/tag.entity';
import { Favorite } from './favorites/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cookbook.db',
      entities: [User, Recipe, RecipeIngredient, RecipeStep, Tag, Favorite],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    RecipesModule,
    FavoritesModule,
    SeedModule,
  ],
})
export class AppModule {}