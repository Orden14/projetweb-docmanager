import { DocumentService } from './document.service';
import { Document } from '../entities/document.entity';
import { DocumentQueueService } from '../queues/document.queue';

describe('DocumentService', () => {
    let documentService: DocumentService;
    let mockQueueService: DocumentQueueService;

    beforeEach(() => {
        mockQueueService = { addJob: jest.fn() } as unknown as DocumentQueueService;
        documentService = new DocumentService(mockQueueService);
    });

    it('devrait créer un document', () => {
        const document: Document = { id: '1', title: 'Doc1', description: 'Description1', fileUrl: 'url1', userId: 'user1' };
        const createdDocument = documentService.create(document);
        expect(createdDocument).toEqual(document);
        expect(documentService.findAll()).toContain(document);
        expect(mockQueueService.addJob).toHaveBeenCalledWith('documentCreated', { document });
    });

    it('devrait retourner tous les documents', () => {
        const document1: Document = { id: '1', title: 'Doc1', description: 'Description1', fileUrl: 'url1', userId: 'user1' };
        const document2: Document = { id: '2', title: 'Doc2', description: 'Description2', fileUrl: 'url2', userId: 'user2' };
        documentService.create(document1);
        documentService.create(document2);
        const documents = documentService.findAll();
        expect(documents).toEqual([document1, document2]);
    });
});
