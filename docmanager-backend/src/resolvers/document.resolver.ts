import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DocumentService } from '../services/document.service';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { v4 as uuidv4 } from 'uuid';

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

    @Mutation(() => Document, { nullable: true })
    async updateDocument(
        @Args('id') id: string,
        @Args('title', { nullable: true }) title?: string,
        @Args('description', { nullable: true }) description?: string,
        @Args('fileUrl', { nullable: true }) fileUrl?: string,
        @Args('userId', { nullable: true }) userId?: string,
    ): Promise<Document | null> {
        const updateDto: any = {};
        if (title !== undefined) updateDto.title = title;
        if (description !== undefined) updateDto.description = description;
        if (fileUrl !== undefined) updateDto.fileUrl = fileUrl;
        if (userId !== undefined) updateDto.userId = userId;
        return await this.documentService.update(id, updateDto);
    }

    @Mutation(() => Document, { nullable: true })
    async deleteDocument(@Args('id') id: string): Promise<Document | null> {
        return await this.documentService.delete(id);
    }
}
