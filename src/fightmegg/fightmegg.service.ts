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

}
