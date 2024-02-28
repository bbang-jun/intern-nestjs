import { Module } from '@nestjs/common';
import { FightmeggModule } from './fightmegg/fightmegg.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [FightmeggModule, ScheduleModule.forRoot()],
  
})
export class AppModule {}
