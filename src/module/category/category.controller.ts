import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Public } from 'src/decorator/public.decorator';
import { PanigationCategoryDto } from './dto/panigation-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles('admin')
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string, @Query() query: PanigationCategoryDto) {
    return this.categoryService.findOne(slug, query);
  }
}
