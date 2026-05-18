import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
    imports: [TypeOrmModule.forFeature([Favorite]), RecipesModule],
    providers: [FavoritesService],
    controllers: [FavoritesController],
})
export class FavoritesModule {}