import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Public } from 'src/decorator/public.decorator';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Roles('admin')
  @Post()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countryService.update(id, updateCountryDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.remove(id);
  }
}
