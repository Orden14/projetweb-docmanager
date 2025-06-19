import { Injectable } from '@nestjs/common';
import { Document } from '../entities/document.entity';

@Injectable()
export class DocumentService {
    private readonly documents: Document[] = [];

    create(document: Document): Document {
        this.documents.push(document);
        return document;
    }

    findAll(): Document[] {
        return this.documents;
    }
}
