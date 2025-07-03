import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';
import { AuthGuard } from '../auth/auth.guard';
import { DocumentJobName } from '../enum/document.job.enum';
import { CreateDocumentDto } from './create-document.dto';
import { DocumentResolver } from './document.resolver';

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
                { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
                AuthGuard,
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
        const context = { req: { user: { sub: '123' } } };
        const result = await resolver.getDocumentById(id, context);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.FindDocumentById, { id, userId: '123' });
        expect(result).toEqual({ id, userId: '123' });
    });

    it('should create a document', async () => {
        const createDocumentDto: CreateDocumentDto = {
            title: 'Test Title',
            description: 'Test Description',
            fileUrl: 'http://example.com/file',
        };
        const context = { req: { user: { sub: '789' } } };
        const result = await resolver.createDocument(createDocumentDto, context);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.CreateDocument, { ...createDocumentDto, userId: '789' });
        expect(result).toEqual({ ...createDocumentDto, userId: '789' });
    });

    it('should update a document', async () => {
        const id = '123';
        const updateDto: CreateDocumentDto = {
            title: 'Updated Title',
            description: 'Updated Description',
            fileUrl: 'http://example.com/updated-file',
        };
        const context = { req: { user: { sub: '456', role: 'admin' } } };
        const result = await resolver.updateDocument(id, updateDto.title, updateDto.description, updateDto.fileUrl, context);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.UpdateDocument, { id, data: updateDto, userId: '456', userRole: 'admin' });
        expect(result).toEqual({ id, data: updateDto, userId: '456', userRole: 'admin' });
    });

    it('should delete a document', async () => {
        const id = '789';
        const context = { req: { user: { sub: '456', role: 'admin' } } };
        const result = await resolver.deleteDocument(id, context);
        expect(mockQueue.add).toHaveBeenCalledWith(DocumentJobName.DeleteDocument, { documentId: id, userId: '456', userRole: 'admin' });
        expect(result).toEqual({ documentId: id, userId: '456', userRole: 'admin' });
    });
});
