import { Controller, Get, Param, Query } from '@nestjs/common';
import { FightmeggService } from './fightmegg.service';
import { PlatformId, RiotAPITypes } from '@fightmegg/riot-api';

@Controller('fightmegg')
export class FightmeggController {

    constructor(
        private fightmeggService: FightmeggService
        ){}

    // 소환사의 puuid, summonername, riotid, tagline을 반환해주는 API
    // localhost:3000/fightmegg/get/riotid?region=asia&gameName=빵준갓&tagLine=KR1
    @Get('get/riotid')
    getByRiotId(
        @Query('region') region,
        @Query('gameName') gameName: string,
        @Query('tagLine') tagLine: string
    ): Promise<RiotAPITypes.Account.AccountDTO>{
        return this.fightmeggService.getByRiotId(region, gameName, tagLine);
    }

    // 해당 소환사의 최근 10개 매치 반환해주는 api
    

    // 어떤 경기에 참여한 소환사들의 리스트를 json으로 반환해주는 api

    // 가지고 있는 경기 리스트 json으로 반환해주는 api

    // 매분 riot에서 새로운 매치 몇개 가져오기(20~100개 정도)
}