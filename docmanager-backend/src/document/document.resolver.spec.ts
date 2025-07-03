import { Test, TestingModule } from '@nestjs/testing';
import { DocumentResolver } from './document.resolver';
import { Queue } from 'bullmq';
import { DocumentJobName } from '../enum/document.job.enum';
import { CreateDocumentDto } from './create-document.dto';
import { Document } from '../entities/document.entity';

describe('DocumentResolver', () => {
    let resolver: DocumentResolver;
    let mockQueue: Partial<Queue>;

    beforeEach(async () => {
        mockQueue = {
            add: jest.fn().mockImplementation((name, data) => ({
                waitUntilFinished: jest.fn().mockResolvedValue(
                    name === DocumentJobName.FindAllDocuments ? [] : data
                ),
            })),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentResolver,
                { provide: 'BullQueue_document', useValue: mockQueue },
            ],
        }).compile();

        resolver = module.get<DocumentResolver>(DocumentResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should find all documents', async () => {
        const result = await resolver.findAllDocuments();
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.FindAllDocuments, {});
        expect(result).toEqual([]);
    });

    it('should get documents by user', async () => {
        const userId = '123';
        const result = await resolver.getDocumentsByUser(userId);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.FindDocumentsByUser, { userId });
        expect(result).toEqual({ userId });
    });

    it('should get document by id', async () => {
        const id = '456';
        const result = await resolver.getDocumentById(id);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.FindDocumentById, { id });
        expect(result).toEqual({ id });
    });

    it('should create a document', async () => {
        const createDocumentDto: CreateDocumentDto = {
            title: 'Test Title',
            description: 'Test Description',
            fileUrl: 'http://example.com/file',
            userId: '789',
        };
        const result = await resolver.createDocument(createDocumentDto);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.CreateDocument, createDocumentDto);
        expect(result).toEqual(createDocumentDto);
    });

    it('should update a document', async () => {
        const id = '123';
        const updateDto: CreateDocumentDto = {
            title: 'Updated Title',
            description: 'Updated Description',
            fileUrl: 'http://example.com/updated-file',
            userId: '456',
        };
        const result = await resolver.updateDocument(id, updateDto.title, updateDto.description, updateDto.fileUrl, updateDto.userId);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.UpdateDocument, { id, data: updateDto });
        expect(result).toEqual({ id, data: updateDto });
    });

    it('should delete a document', async () => {
        const id = '789';
        const result = await resolver.deleteDocument(id);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.DeleteDocument, { documentId: id });
        expect(result).toEqual({ documentId: id });
    });
});
