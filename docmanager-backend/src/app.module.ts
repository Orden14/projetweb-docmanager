import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthResolver } from './health/health.resolver';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import {BullModule} from "@nestjs/bull";
import {HealthProcessor} from "./health/health.processor";
import {DocumentModule} from "./document/document.module";
import {UserModule} from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            context: ({ req, res }: { req: Request; res: Response }) => ({
                req,
                res,
            }),
            playground: true,
            introspection: true,
        }),
        PrismaModule,
        BullModule.forRoot({
            redis: process.env.REDIS_URL ?? 'redis://redis:6379'
        }),
        BullModule.registerQueue({
            name: 'health',
        }),
        DocumentModule,
        UserModule,
    ],
    controllers: [HealthController],
    providers: [
        HealthProcessor,
        HealthResolver,
    ],
})
export class AppModule {}
