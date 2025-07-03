import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthResolver } from './health/health.resolver';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import {HealthProcessor} from "./health/health.processor";
import {DocumentModule} from "./document/document.module";
import {UserModule} from "./user/user.module";
import {CustomBullModule} from "./bullmq/bull.module";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

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
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
        }),
        PrismaModule,
        AuthModule,
        CustomBullModule,
        UserModule,
        DocumentModule,
    ],
    controllers: [HealthController],
    providers: [
        HealthProcessor,
        HealthResolver,
    ],
})

export class AppModule {}
