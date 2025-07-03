import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { InjectQueue } from '@nestjs/bullmq';
import {Queue, QueueEvents} from 'bullmq';
import { CreateDocumentDto } from './create-document.dto';
import { Document } from '../entities/document.entity';
import {getRedisConnection} from "../bullmq/connection.util";
import {DocumentJobName} from "../enum/document.job.enum";
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Resolver()
export class DocumentResolver {
    private readonly queueEvents: QueueEvents;

    constructor(@InjectQueue('document') private readonly documentQueue: Queue) {
        this.queueEvents = new QueueEvents('document', { connection: getRedisConnection() });
    }

    @Query(() => [Document])
    @UseGuards(AdminGuard)
    async findAllDocuments(): Promise<Document[]> {
        const job = await this.documentQueue.add(DocumentJobName.FindAllDocuments, {});

        return await job.waitUntilFinished(this.queueEvents) as Document[];
    }

    @Query(() => [Document])
    async getDocumentsByUser(@Args('userId') userId: string): Promise<Document[]> {
        const job = await this.documentQueue.add(DocumentJobName.FindDocumentsByUser, { userId });

        return await job.waitUntilFinished(this.queueEvents) as Document[];
    }

    @Query(() => Document)
    @UseGuards(AuthGuard)
    async getDocumentById(@Args('id') id: string, @Context() context: { req: { user: { sub: string } } }): Promise<Document> {
        const userId = context.req.user.sub;
        const job = await this.documentQueue.add(DocumentJobName.FindDocumentById, { id, userId });
        return await job.waitUntilFinished(this.queueEvents) as Document;
    }

    @Mutation(() => Document)
    @UseGuards(AuthGuard)
    async createDocument(
        @Args('createDocumentDto') createDocumentDto: CreateDocumentDto,
        @Context() context: { req: { user: { sub: string } } },
    ): Promise<Document> {
        const userId = context.req.user.sub;
        const jobData: CreateDocumentDto & { userId: string } = { ...createDocumentDto, userId };
        const job = await this.documentQueue.add(
            DocumentJobName.CreateDocument,
            jobData
        );
        return await job.waitUntilFinished(this.queueEvents) as Document;
    }

    @Mutation(() => Document)
    @UseGuards(AuthGuard)
    async updateDocument(
        @Args('id') id: string,
        @Args('title', { nullable: true }) title: string,
        @Args('description', { nullable: true }) description: string,
        @Args('fileUrl', { nullable: true }) fileUrl: string,
        @Context() context: { req: { user: { sub: string; role: string } } },
    ): Promise<Document> {
        const userId = context.req.user.sub;
        const userRole = context.req.user.role;
        const updateDto: CreateDocumentDto = { title, description, fileUrl };
        const job = await this.documentQueue.add(DocumentJobName.UpdateDocument, { id, data: updateDto, userId, userRole });
        return await job.waitUntilFinished(this.queueEvents) as Document;
    }

    @Mutation(() => Boolean)
    @UseGuards(AuthGuard)
    async deleteDocument(@Args('id') id: string, @Context() context: { req: { user: { sub: string; role: string } } }): Promise<boolean> {
        const userId = context.req.user.sub;
        const userRole = context.req.user.role;
        const job = await this.documentQueue.add(DocumentJobName.DeleteDocument, { documentId: id, userId, userRole });
        return await job.waitUntilFinished(this.queueEvents) as boolean;
    }
}
