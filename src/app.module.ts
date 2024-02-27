import { Module } from '@nestjs/common';
import { FightmeggModule } from './fightmegg/fightmegg.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FightmeggModule],
  
})
export class AppModule {}
