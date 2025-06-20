import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Log {
    @Field()
        id: string;

    @Field()
        action: string;

    @Field()
        timestamp: Date;

    @Field()
        userId: string;

    @Field()
        documentId: string;
}
