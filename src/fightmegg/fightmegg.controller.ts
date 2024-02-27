import { Controller } from '@nestjs/common';
import { FightmeggService } from './fightmegg.service';

@Controller('fightmegg')
export class FightmeggController {
    constructor(private fightmeggService: FightmeggService){}
}