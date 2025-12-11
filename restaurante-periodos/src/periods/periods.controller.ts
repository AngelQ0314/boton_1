import { Controller, Get, Query } from '@nestjs/common';
import { PeriodsService } from './periods.service';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly svc: PeriodsService) {}

  @Get()
  async getPeriods(@Query() query: any) {
    return this.svc.findAll(query);
  }
}
