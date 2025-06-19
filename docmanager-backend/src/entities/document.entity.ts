import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Document {
    @Field()
        id: string;

    @Field()
        title: string;

    @Field()
        description: string;

    @Field()
        fileUrl: string;

    @Field()
        userId: string;
}
