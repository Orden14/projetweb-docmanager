import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDocumentDto {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    fileUrl: string;

    @Field()
    userId: string;
}
