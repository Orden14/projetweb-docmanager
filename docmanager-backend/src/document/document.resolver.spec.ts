import { Test, TestingModule } from '@nestjs/testing';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from './create-document.dto';

describe('DocumentResolver', () => {
    let resolver: DocumentResolver;

    const mockDocument: Document = {
        id: '1',
        title: 'Test Document',
        description: 'Test Description',
        fileUrl: 'test.pdf',
        userId: '1',
    };

    const mockCreateDocumentDto: CreateDocumentDto = {
        title: 'Test Document',
        description: 'Test Description',
        fileUrl: 'test.pdf',
        userId: '1',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentResolver,
                {
                    provide: DocumentService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([mockDocument]),
                        findByUser: jest.fn().mockResolvedValue([mockDocument]),
                        findById: jest.fn().mockResolvedValue(mockDocument),
                        createDocument: jest
                            .fn()
                            .mockResolvedValue(mockDocument),
                        update: jest.fn().mockResolvedValue(mockDocument),
                        delete: jest.fn().mockResolvedValue(mockDocument),
                    },
                },
            ],
        }).compile();

        resolver = module.get<DocumentResolver>(DocumentResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('findAllDocuments', () => {
        it('should return an array of documents', async () => {
            const result = await resolver.findAllDocuments();
            expect(result).toEqual([mockDocument]);
        });
    });

    describe('getDocumentsByUser', () => {
        it('should return documents for a specific user', async () => {
            const result = await resolver.getDocumentsByUser('1');
            expect(result).toEqual([mockDocument]);
        });
    });

    describe('getDocumentById', () => {
        it('should return a single document', async () => {
            const result = await resolver.getDocumentById('1');
            expect(result).toEqual(mockDocument);
        });
    });

    describe('createDocument', () => {
        it('should create a document', async () => {
            const result = await resolver.createDocument(mockCreateDocumentDto);
            expect(result).toEqual(mockDocument);
        });
    });

    describe('updateDocument', () => {
        it('should update a document', async () => {
            const result = await resolver.updateDocument(
                '1',
                'Updated Title',
                'Updated Description',
                'updated.pdf',
                '1',
            );
            expect(result).toEqual(mockDocument);
        });
    });

    describe('deleteDocument', () => {
        it('should delete a document', async () => {
            const result = await resolver.deleteDocument('1');
            expect(result).toEqual(mockDocument);
        });
    });
});
