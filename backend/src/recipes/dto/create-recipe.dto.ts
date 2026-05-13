import {
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
    IsArray,
    ValidateNested,
    Min,
    MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIngredientDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsString()
    unit: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsNumber()
    orderIndex?: number;
}

export class CreateStepDto {
    @IsNumber()
    stepNumber: number;

    @IsString()
    description: string;
}

export class CreateRecipeDto {
    @IsString()
    @MaxLength(200)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNumber()
    @Min(0.1)
    baseServings: number;

    @IsOptional()
    @IsString()
    servingUnit?: string;

    @IsOptional()
    @IsNumber()
    prepTimeMin?: number;

    @IsOptional()
    @IsNumber()
    cookTimeMin?: number;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateIngredientDto)
    ingredients: CreateIngredientDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateStepDto)
    steps: CreateStepDto[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}