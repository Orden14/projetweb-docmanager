import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectQueue } from '@nestjs/bullmq';
import {Queue, QueueEvents} from 'bullmq';
import { CreateDocumentDto } from './create-document.dto';
import { Document } from '../entities/document.entity';
import {getRedisConnection} from "../bullmq/connection.util";
import {DocumentJobName} from "../enum/document.job.enum";

@Resolver()
export class DocumentResolver {
    private readonly queueEvents: QueueEvents;

    constructor(@InjectQueue('document') private readonly documentQueue: Queue) {
        this.queueEvents = new QueueEvents('document', { connection: getRedisConnection() });
    }

    @Query(() => [Document])
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
    async getDocumentById(@Args('id') id: string): Promise<Document> {
        const job = await this.documentQueue.add(DocumentJobName.FindDocumentById, { id });

        return await job.waitUntilFinished(this.queueEvents) as Document;
    }

    @Mutation(() => Document)
    async createDocument(
        @Args('createDocumentDto') createDocumentDto: CreateDocumentDto,
    ): Promise<Document> {
        const job = await this.documentQueue.add(DocumentJobName.CreateDocument, createDocumentDto);

        return await job.waitUntilFinished(this.queueEvents) as Document;
    }

    @Mutation(() => Document)
    async updateDocument(
        @Args('id') id: string,
        @Args('title', { nullable: true }) title: string,
        @Args('description', { nullable: true }) description: string,
        @Args('fileUrl', { nullable: true }) fileUrl: string,
        @Args('userId', { nullable: true }) userId: string,
    ): Promise<Document> {
        const updateDto: CreateDocumentDto = { title, description, fileUrl, userId };
        const job = await this.documentQueue.add(DocumentJobName.UpdateDocument, { id, data: updateDto });

        return await job.waitUntilFinished(this.queueEvents) as Document;
    }

    @Mutation(() => Boolean)
    async deleteDocument(@Args('id') id: string): Promise<boolean> {
        const job = await this.documentQueue.add(DocumentJobName.DeleteDocument, { documentId: id });

        return await job.waitUntilFinished(this.queueEvents) as boolean;
    }
}
