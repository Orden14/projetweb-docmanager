import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { DocumentService } from './document.service';
import {DocumentJobName} from "../enum/document.job.enum";
import {CreateDocumentDto} from "./create-document.dto";

@Injectable()
@Processor('document')
export class DocumentProcessor extends WorkerHost {
    constructor(private readonly documentService: DocumentService) {
        super();
    }

    async process(job: Job): Promise<any> {
        switch (job.name) {
        case DocumentJobName.CreateDocument:
            return this.documentService.createDocument(job.data as CreateDocumentDto);
        case DocumentJobName.DeleteDocument:
            return this.documentService.delete(job.data.documentId as string);
        case DocumentJobName.FindAllDocuments:
            return this.documentService.findAll();
        case DocumentJobName.FindDocumentsByUser:
            return this.documentService.findByUser(job.data.userId as string);
        case DocumentJobName.FindDocumentById:
            return this.documentService.findById(job.data.id as string);
        case DocumentJobName.UpdateDocument:
            return this.documentService.update(job.data.id as string, job.data.data as CreateDocumentDto);
        default:
            throw new Error(`Unknown job name: ${job.name}`);
        }
    }
}
