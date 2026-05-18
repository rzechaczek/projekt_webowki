import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Get()
    getUserFavorites(@Request() req) {
        return this.favoritesService.getUserFavorites(req.user.id);
    }

    @Get('ids')
    getFavoriteIds(@Request() req) {
        return this.favoritesService.getFavoriteRecipeIds(req.user.id);
    }

    @Post(':recipeId')
    addFavorite(@Param('recipeId') recipeId: string, @Request() req) {
        return this.favoritesService.addFavorite(req.user.id, recipeId);
    }

    @Delete(':recipeId')
    removeFavorite(@Param('recipeId') recipeId: string, @Request() req) {
        return this.favoritesService.removeFavorite(req.user.id, recipeId);
    }
}