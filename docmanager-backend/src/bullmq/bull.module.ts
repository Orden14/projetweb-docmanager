import {Global, Module} from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {getRedisConnection} from "./connection.util";

@Global()
@Module({
    imports: [
        BullModule.forRoot({
            connection: getRedisConnection(),
        }),
        BullModule.registerQueue({
            name: 'health',
        }),
        BullModule.registerQueue({
            name: 'document',
        }),
        BullModule.registerQueue({
            name: 'user',
        }),
    ],
    exports: [BullModule],
})

export class CustomBullModule {}
