import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    @Get()
    findAllPublic(
        @Query('search') search?: string,
        @Query('tag') tag?: string,
    ) {
        return this.recipesService.findAllPublic(search, tag);
    }

    @Get('tags')
    getAllTags() {
        return this.recipesService.getAllTags();
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    findMine(@Request() req) {
        return this.recipesService.findMyRecipes(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.recipesService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateRecipeDto, @Request() req) {
        return this.recipesService.create(dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() dto: Partial<CreateRecipeDto>,
        @Request() req,
    ) {
        return this.recipesService.update(id, dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.recipesService.remove(id, req.user.id);
    }
}