import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { FightmeggService } from './fightmegg.service';
import { PlatformId, RiotAPITypes } from '@fightmegg/riot-api';
import { json } from 'stream/consumers';

@Controller('fightmegg')
export class FightmeggController {

    constructor(
        private fightmeggService: FightmeggService
        ){}

    // 소환사의 puuid, summonername, riotid, tagline을 반환해주는 API
    // DB에 저장
    @Get('get/riotid')
    getByRiotId(
        @Query('region') region,
        @Query('gameName') gameName: string,
        @Query('tagLine') tagLine: string
    ): Promise<RiotAPITypes.Account.AccountDTO>{
        return this.fightmeggService.getByRiotId(region, gameName, tagLine);
    }

    // 해당 소환사의 최근 10개 매치 반환해주는 api
    // DB에 없을 경우 matchid 저장
    @Get('get/matchid')
    getIdsByPuuid(
        @Query('cluster') cluster,
        @Query('puuid') puuid: string,
        @Body() params
    ): Promise<string[]>{
        return this.fightmeggService.getIdsByPuuid(cluster, puuid, params);
    }

    // 특정 경기에 참여한 소환사들(puuid)의 리스트를 json으로 반환해주는 API
    @Get('get/match-summoner')
    getMatchById(
        @Query('cluster') cluster,
        @Query('matchId') matchId,
    ): Promise<string[]>{
        return this.fightmeggService.getMatchById(cluster, matchId);
    }
    

    // 특정 소환사가 DB에 가지고 있는 경기 리스트를 반환해주는 API
    @Get('get/match-list')
    getMatchListByPuuid(
        @Query('puuid') puuid: string
    ): Promise<string[]>{
        return this.fightmeggService.getMatchListByPuuid(puuid);
    }

    // 매분 riot에서 새로운 매치 몇개 가져오기(20~100개 정도)
}