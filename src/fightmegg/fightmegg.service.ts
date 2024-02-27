import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FightmeggService {
    private prisma = new PrismaClient();
}
