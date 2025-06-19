import { Injectable } from '@nestjs/common';
import { Document } from '../entities/document.entity';
import { DocumentQueueService } from '../queues/document.queue';

@Injectable()
export class DocumentService {
    private readonly documents: Document[] = [];

    constructor(private readonly documentQueueService: DocumentQueueService) {}

    create(document: Document): Document {
        this.documents.push(document);
        this.documentQueueService.addJob('documentCreated', { document });
        return document;
    }

    delete(documentId: string): boolean {
        const index = this.documents.findIndex((doc) => doc.id === documentId);
        if (index === -1) return false;

        const [deletedDocument] = this.documents.splice(index, 1);
        this.documentQueueService.addJob('documentDeleted', {
            document: deletedDocument,
        });
        return true;
    }

    findAll(): Document[] {
        return this.documents;
    }

    findByUser(userId: string): Document[] {
        return this.documents.filter((doc) => doc.userId === userId);
    }

    findById(id: string): Document | null {
        return this.documents.find((doc) => doc.id === id) || null;
    }

    update(id: string, updates: Partial<Document>): Document | null {
        const document = this.findById(id);
        if (!document) return null;

        Object.assign(document, updates);
        return document;
    }
}
