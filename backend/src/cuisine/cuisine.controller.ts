import { Controller } from '@nestjs/common';
import { CuisineService } from './cuisine.service';

@Controller('cuisine')
export class CuisineController {
  constructor(private readonly cuisineService: CuisineService) {}
}
