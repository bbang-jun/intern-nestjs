import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { PlatformId, RiotAPI, RiotAPITypes } from '@fightmegg/riot-api';

@Injectable()
export class FightmeggService {
    private prisma: PrismaClient;
    private riotToken: string;
    private riotAPI: RiotAPI;
    startingMatchId = "KR_6968190653"; // startingMatchId를 클래스의 속성으로 선언

    constructor(
        ){
            this.prisma = new PrismaClient();
            this.riotToken = process.env.RIOT_TOKEN;
            this.riotAPI = new RiotAPI(this.riotToken);
        }
    
    async getByRiotId(region, gameName: string, tagLine: string): Promise<RiotAPITypes.Account.AccountDTO>{
        try{
            const summoner = await this.riotAPI.account.getByRiotId({
                region: region,
                gameName: gameName,
                tagLine: tagLine
            });

            const savedSummoner = await this.prisma.summoner.upsert({
                where: { puuid: summoner.puuid },
                update: {
                    gameName: gameName,
                    tagLine: tagLine,
                    region: region,
                },
                create: {
                    gameName: gameName,
                    tagLine: tagLine,
                    region: region,
                    puuid: summoner.puuid,
                },
            });
            console.log("savedSummoner:", savedSummoner);

            return summoner
        }catch(error){
            console.error(error);
        }
    }

    async getIdsByPuuid(cluster, puuid: string, params): Promise<string[]>{
        try{
            const matchIds: string[] = await this.riotAPI.matchV5.getIdsByPuuid({
                cluster: cluster,
                puuid: puuid,
                params: params
            });

            for(const matchId of matchIds){
                const existingMatch = await this.prisma.match.findUnique({
                    where: {
                        matchId: matchId,
                    },
                });

                // DB에 존재하지 않는 Match Id면 저장
                if (!existingMatch) {
                    await this.prisma.match.create({
                        data: {
                            matchId: matchId,
                            userPuuid: puuid,
                        },
                    });
                }   
            }
            
            console.log("matchIds:", matchIds);

            return matchIds
        }catch(error){
            console.error(error);
        }
    }

    async getMatchById(cluster, matchId){
        try{
            const matchInformation = await this.riotAPI.matchV5.getMatchById({
                cluster: cluster,
                matchId: matchId,
            });

            const participants: string[] = matchInformation.metadata.participants;
            console.log("participants:", participants);
            
            return participants;
        }catch(error){
            console.error(error);
        }
    }

    async getMatchListByPuuid(puuid){
        try{
            const matchList = await this.prisma.summoner.findUnique({
                where: {
                    puuid: puuid,
                },
                // matches 필드를 포함하여 해당 Summoner의 모든 Match를 가져오기
                include: {
                    matches: true, 
                },
            });
    
            if (!matchList) {
                console.log(`No summoner found with puuid: ${puuid}`);
                return [];
            }

            const matchIds = matchList.matches.map(match => match.matchId);
    
            console.log("matchIds:", matchIds);

            // 해당 Summoner가 가지고 있는 모든 matchId 반환
            return matchIds; 
        }catch(error){
            console.error(error);
        }
    }

    // 특정 matchid를 기준으로 50개 단위로 완료한 게임 DB 저장(최대 10개) API
    @Cron('0 */2 * * * *')
    async getMatchStatusByScheduling() {
        const matchIdBase = this.startingMatchId.split('_')[0];
        let currentMatchIdNumber = parseInt(this.startingMatchId.split('_')[1]);
        const validMatchIds = [];

        console.log("strat matchId:", this.startingMatchId);

        for (let i = 0; i < 50; i++) {
            let currentMatchId = `${matchIdBase}_${currentMatchIdNumber + i}`;
            
            try {
                const matchInformation = await this.riotAPI.matchV5.getMatchById({
                    cluster: PlatformId.ASIA,
                    matchId: currentMatchId,
                });

                if (matchInformation.info.endOfGameResult === "GameComplete") {
                    validMatchIds.push(currentMatchId);
                    // matchId를 CronMatchId 테이블에 저장하는 로직
                    const existingIds = await this.prisma.cronMatchId.findMany({
                        select: { matchId: true },
                        orderBy: { matchId: 'asc' },
                    });

                    if (existingIds.length >= 10) {
                        // 가장 오래된 matchId를 삭제
                        await this.prisma.cronMatchId.delete({
                            where: { matchId: existingIds[0].matchId },
                        });
                    }

                    // 새로운 matchId를 추가
                    await this.prisma.cronMatchId.create({
                        data: { matchId: currentMatchId },
                    });
                }
            } catch (error) {
            }
        }

        // DB에 저장된 가장 최근의 matchId로 startingMatchId 갱신
        const latestId = await this.prisma.cronMatchId.findFirst({
            orderBy: { matchId: 'desc' },
        });
        if (latestId) {
            this.startingMatchId = latestId.matchId;
        }

        console.log("new strat matchId:", this.startingMatchId);
        // console.log(`Number of valid matchIds: ${validMatchIds.length}`);
    }

    // 1. fow.kr에서 관전 가능한 게임의 소환사 찾아서 이전 판이 최근 30분 안에 끝났는지 확인하고 puuid 알아내기
    // ACCOUNT-V1 /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
    // 2. matchid 얻어내서 가장 최근 matchid 얻기
    // MATCH-V5 /lol/match/v5/matches/by-puuid/{puuid}/ids
    // 3. 해당 matchid에 1씩 더해서 2분마다 끝난거 파악하기("endOfGameResult": "GameComplete")
    // MATCH-V5 /lol/match/v5/matches/{matchId}
    // async schedule(){
        
    //     this.getMatchStatusByScheduling();
    // }
}
