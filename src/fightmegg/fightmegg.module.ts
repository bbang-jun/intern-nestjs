import { Module } from '@nestjs/common';
import { FightmeggController } from './fightmegg.controller';
import { FightmeggService } from './fightmegg.service';

@Module({
  controllers: [FightmeggController],
  providers: [FightmeggService]
})
export class FightmeggModule {}
