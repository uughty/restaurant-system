import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu, MenuDocument } from './schemas/menu.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name)
    private menuModel: Model<MenuDocument>,
  ) {}

  // CREATE menu item
  async create(data: Partial<Menu>): Promise<Menu> {
    const menuItem = new this.menuModel(data);
    return menuItem.save();
  }

  // GET all menu items
  async findAll(): Promise<Menu[]> {
    return this.menuModel.find({ isAvailable: true }).exec();
  }

  // GET menu by category
  async findByCategory(category: string): Promise<Menu[]> {
    return this.menuModel.find({
      category,
      isAvailable: true,
    }).exec();
  }
}
