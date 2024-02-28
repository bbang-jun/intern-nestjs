import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PlatformId, RiotAPI, RiotAPITypes } from '@fightmegg/riot-api';

@Injectable()
export class FightmeggService {
    private prisma: PrismaClient;
    private riotToken: string;
    private riotAPI: RiotAPI;

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

            
            console.log("matchIds:", matchIds);

            return matchIds
        }catch(error){
            console.error(error);
        }
    }

}
