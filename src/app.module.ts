import { Module } from '@nestjs/common';
import { FightmeggModule } from './fightmegg/fightmegg.module';

@Module({
  imports: [FightmeggModule],
})
export class AppModule {}
