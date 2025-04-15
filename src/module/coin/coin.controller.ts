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
import { CoinService } from './coin.service';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('coin')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Roles('admin')
  @Post()
  create(@Body() createCoinDto: CreateCoinDto) {
    return this.coinService.create(createCoinDto);
  }

  @Get()
  findAll() {
    return this.coinService.findAll();
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoinDto: UpdateCoinDto,
  ) {
    return this.coinService.update(id, updateCoinDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coinService.remove(id);
  }
}
