import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { Document } from '../entities/document.entity';
import { DocumentService } from '../services/document.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

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
    @UseGuards(AuthGuard)
    async createDocument(
        @Args('createDocumentDto') createDocumentDto: CreateDocumentDto,
    ): Promise<Document> {
        return await this.documentService.createDocument(createDocumentDto);
    }

    @Mutation(() => Document)
    @UseGuards(AuthGuard)
    async updateDocument(
        @Args('id') id: string,
        @Args('title', { nullable: true }) title: string,
        @Args('description', { nullable: true }) description: string,
        @Args('fileUrl', { nullable: true }) fileUrl: string,
        @Context() context
    ): Promise<Document> {
        const userId = context.req.user.sub;
        const userRole = context.req.user.role;
        const updateDto: CreateDocumentDto = {
            title,
            description,
            fileUrl,
            userId,
        };
        return await this.documentService.update(id, updateDto, userId, userRole);
    }

    @Mutation(() => Document, { nullable: true })
    @UseGuards(AuthGuard)
    async deleteDocument(@Args('id') id: string, @Context() context): Promise<Document | null> {
        const userId = context.req.user.sub;
        const userRole = context.req.user.role;
        return await this.documentService.delete(id, userId, userRole);
    }
}
