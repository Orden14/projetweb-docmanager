import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateDocumentDto } from './create-document.dto';
import { Document } from '../entities/document.entity';
import { DocumentService } from './document.service';

@Resolver(() => Document)
export class DocumentResolver {
    constructor(private readonly documentService: DocumentService) {}

    @Query(() => [Document])
    async findAllDocuments(): Promise<Document[]> {
        return await this.documentService.findAll();
    }

    @Query(() => [Document])
    async getDocumentsByUser(@Args('userId') userId: string): Promise<Document[]> {
        return await this.documentService.findByUser(userId);
    }

    @Query(() => Document, { nullable: true })
    async getDocumentById(@Args('id') id: string): Promise<Document | null> {
        return await this.documentService.findById(id);
    }

    @Mutation(() => Document)
    async createDocument(
        @Args('createDocumentDto') createDocumentDto: CreateDocumentDto,
    ): Promise<Document> {
        return await this.documentService.createDocument(createDocumentDto);
    }

    @Mutation(() => Document)
    async updateDocument(
        @Args('id') id: string,
        @Args('title', { nullable: true }) title: string,
        @Args('description', { nullable: true }) description: string,
        @Args('fileUrl', { nullable: true }) fileUrl: string,
        @Args('userId', { nullable: true }) userId: string,
    ): Promise<Document> {
        const updateDto: CreateDocumentDto = {
            title,
            description,
            fileUrl,
            userId,
        };
        return await this.documentService.update(id, updateDto);
    }

    @Mutation(() => Document, { nullable: true })
    async deleteDocument(@Args('id') id: string): Promise<Document | null> {
        return await this.documentService.delete(id);
    }
}
