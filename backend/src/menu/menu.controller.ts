import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './schemas/menu.schema';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() data: Partial<Menu>) {
    return this.menuService.create(data);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.menuService.findByCategory(category);
    }
    return this.menuService.findAll();
  }
}
