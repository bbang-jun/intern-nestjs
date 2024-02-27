import { Controller } from '@nestjs/common';
import { FightmeggService } from './fightmegg.service';
import { ConfigService } from '@nestjs/config';

@Controller('fightmegg')
export class FightmeggController {

    private riotToken: string;
    constructor(
        private fightmeggService: FightmeggService,
        private configService: ConfigService,
        ){
            this.riotToken = this.configService.get<string>('RIOT_TOKEN');
        }

    // 해당 소환사의 최근 10개 매치 반환해주는 api

    // 소환사의 puuid, summonername, riotid, tagline을 반환해주는 API

    // 어떤 경기에 참여한 소환사들의 리스트를 json으로 반환해주는 api

    // 가지고 있는 경기 리스트 json으로 반환해주는 api

    // 매분 riot에서 새로운 매치 몇개 가져오기(20~100개 정도)
}