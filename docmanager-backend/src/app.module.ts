import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {HealthResolver} from './health/health.resolver';
import {DocumentResolver} from './resolvers/document.resolver';
import {DocumentService} from './services/document.service';
import {UserResolver} from './resolvers/user.resolver';
import {UserService} from './services/user.service';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            playground: true,
            debug: true,
        }),
    ],
    providers: [
        HealthResolver,
        DocumentResolver,
        DocumentService,
        UserResolver,
        UserService,
    ],
})
export class AppModule {
}