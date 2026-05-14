import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import {AuthModule} from './auth/auth.module';
import {Recipe} from "./recipes/entities/recipe.entity";
import {RecipeIngredient} from "./recipes/entities/recipe-ingredient.entity";
import {RecipeStep} from "./recipes/entities/recipe-step.entity";
import {Tag} from "./recipes/entities/tag.entity";
import {RecipesModule} from "./recipes/recipes.module";
import {SeedModule} from "./seed/seed.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cookbook.db',
      entities: [User, Recipe, RecipeIngredient, RecipeStep, Tag],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    RecipesModule,
    SeedModule,
  ],
})
export class AppModule {}