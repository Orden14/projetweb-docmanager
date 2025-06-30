import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthResolver } from './health/health.resolver';
import { DocumentResolver } from './resolvers/document.resolver';
import { DocumentService } from './services/document.service';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { HealthController } from './health/health.controller';
import { DocumentQueueService } from './queues/document.queue';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            playground: true,
            debug: true,
        }),
        PrismaModule,
    ],
    controllers: [HealthController],
    providers: [
        HealthResolver,
        DocumentResolver,
        DocumentService,
        UserResolver,
        UserService,
        DocumentQueueService,
    ],
})
export class AppModule {}
