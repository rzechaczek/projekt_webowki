import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { RecipeStep } from './entities/recipe-step.entity';
import { Tag } from './entities/tag.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepo: Repository<Recipe>,
        @InjectRepository(RecipeIngredient)
        private readonly ingredientRepo: Repository<RecipeIngredient>,
        @InjectRepository(RecipeStep)
        private readonly stepRepo: Repository<RecipeStep>,
        @InjectRepository(Tag)
        private readonly tagRepo: Repository<Tag>,
    ) {}

    async findAllPublic(search?: string, tag?: string): Promise<Recipe[]> {
        const qb = this.recipeRepo
            .createQueryBuilder('recipe')
            .leftJoinAndSelect('recipe.ingredients', 'ingredients')
            .leftJoinAndSelect('recipe.steps', 'steps')
            .leftJoinAndSelect('recipe.tags', 'tags')
            .where('recipe.isPublic = :isPublic', { isPublic: true });

        if (search) {
            qb.andWhere('LOWER(recipe.title) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        if (tag) {
            qb.andWhere('tags.name = :tag', { tag });
        }

        return qb
            .orderBy('recipe.createdAt', 'DESC')
            .addOrderBy('ingredients.orderIndex', 'ASC')
            .addOrderBy('steps.stepNumber', 'ASC')
            .getMany();
    }

    async findMyRecipes(userId: string): Promise<Recipe[]> {
        return this.recipeRepo.find({
            where: { ownerId: userId, isPublic: false },
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string): Promise<Recipe> {
        const recipe = await this.recipeRepo.findOne({ where: { id } });
        if (!recipe) {
            throw new NotFoundException(`Przepis o id ${id} nie istnieje`);
        }
        return recipe;
    }

    async create(dto: CreateRecipeDto, userId: string): Promise<Recipe> {
        const tags = await this.resolveTags(dto.tags || []);

        const ingredients = dto.ingredients.map((ing, idx) =>
            this.ingredientRepo.create({
                ...ing,
                orderIndex: ing.orderIndex ?? idx,
            }),
        );

        const steps = dto.steps.map((step) =>
            this.stepRepo.create(step),
        );

        const recipe = this.recipeRepo.create({
            title: dto.title,
            description: dto.description,
            imageUrl: dto.imageUrl,
            baseServings: dto.baseServings,
            servingUnit: dto.servingUnit || 'porcje',
            prepTimeMin: dto.prepTimeMin,
            cookTimeMin: dto.cookTimeMin,
            isPublic: dto.isPublic || false,
            ownerId: userId,
            ingredients,
            steps,
            tags,
        });

        return this.recipeRepo.save(recipe);
    }

    async update(
        id: string,
        dto: Partial<CreateRecipeDto>,
        userId: string,
    ): Promise<Recipe> {
        const recipe = await this.findById(id);

        if (recipe.ownerId !== userId) {
            throw new ForbiddenException('Nie możesz edytować cudzego przepisu');
        }

        if (dto.tags !== undefined) {
            recipe.tags = await this.resolveTags(dto.tags);
        }

        if (dto.ingredients !== undefined) {
            await this.ingredientRepo.delete({ recipeId: id });
            recipe.ingredients = dto.ingredients.map((ing, idx) =>
                this.ingredientRepo.create({
                    ...ing,
                    orderIndex: ing.orderIndex ?? idx,
                }),
            );
        }

        if (dto.steps !== undefined) {
            await this.stepRepo.delete({ recipeId: id });
            recipe.steps = dto.steps.map((step) =>
                this.stepRepo.create(step),
            );
        }

        if (dto.title !== undefined) recipe.title = dto.title;
        if (dto.description !== undefined) recipe.description = dto.description;
        if (dto.imageUrl !== undefined) recipe.imageUrl = dto.imageUrl;
        if (dto.baseServings !== undefined) recipe.baseServings = dto.baseServings;
        if (dto.servingUnit !== undefined) recipe.servingUnit = dto.servingUnit;
        if (dto.prepTimeMin !== undefined) recipe.prepTimeMin = dto.prepTimeMin;
        if (dto.cookTimeMin !== undefined) recipe.cookTimeMin = dto.cookTimeMin;

        return this.recipeRepo.save(recipe);
    }

    async remove(id: string, userId: string): Promise<void> {
        const recipe = await this.findById(id);

        if (recipe.ownerId !== userId) {
            throw new ForbiddenException('Nie możesz usunąć cudzego przepisu');
        }

        await this.recipeRepo.remove(recipe);
    }

    async getAllTags(): Promise<Tag[]> {
        return this.tagRepo.find({ order: { name: 'ASC' } });
    }

    async resolveTags(tagNames: string[]): Promise<Tag[]> {
        const tags: Tag[] = [];

        for (const name of tagNames) {
            let tag = await this.tagRepo.findOne({ where: { name } });
            if (!tag) {
                tag = await this.tagRepo.save(
                    this.tagRepo.create({ name }),
                );
            }
            tags.push(tag);
        }

        return tags;
    }
}