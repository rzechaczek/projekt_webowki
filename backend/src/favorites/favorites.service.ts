import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { RecipesService } from '../recipes/recipes.service';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private readonly favoriteRepo: Repository<Favorite>,
        private readonly recipesService: RecipesService,
    ) {}

    async getUserFavorites(userId: string): Promise<Favorite[]> {
        return this.favoriteRepo.find({
            where: { userId },
            order: { addedAt: 'DESC' },
        });
    }

    async getFavoriteRecipeIds(userId: string): Promise<string[]> {
        const favorites = await this.favoriteRepo.find({
            where: { userId },
        });
        return favorites.map((f) => f.recipeId);
    }

    async addFavorite(userId: string, recipeId: string): Promise<Favorite> {
        await this.recipesService.findById(recipeId);

        const existing = await this.favoriteRepo.findOne({
            where: { userId, recipeId },
        });

        if (existing) {
            throw new ConflictException('Przepis jest już w ulubionych');
        }

        const favorite = this.favoriteRepo.create({ userId, recipeId });
        return this.favoriteRepo.save(favorite);
    }

    async removeFavorite(userId: string, recipeId: string): Promise<void> {
        const favorite = await this.favoriteRepo.findOne({
            where: { userId, recipeId },
        });

        if (!favorite) {
            throw new NotFoundException('Nie znaleziono przepisu w ulubionych');
        }

        await this.favoriteRepo.remove(favorite);
    }

    async isFavorite(userId: string, recipeId: string): Promise<boolean> {
        const favorite = await this.favoriteRepo.findOne({
            where: { userId, recipeId },
        });
        return !!favorite;
    }
}