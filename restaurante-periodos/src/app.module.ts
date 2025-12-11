import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/databsee.module';
import { PeriodsModule } from './periods/periods.module';

@Module({
  imports: [DatabaseModule, PeriodsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
