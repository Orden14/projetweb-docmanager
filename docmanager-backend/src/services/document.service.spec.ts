import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Document } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from '../dto/create-document.dto';

describe('DocumentService', () => {
    let service: DocumentService;
    let prismaService: PrismaService;

    const mockDocument: Document = {
        id: '1',
        title: 'Test Document',
        description: 'Test Description',
        fileUrl: 'test.pdf',
        userId: 'user1'
    };

    const mockCreateDocumentDto: CreateDocumentDto = {
        title: 'Test Document',
        description: 'Test Description',
        fileUrl: 'test.pdf',
        userId: 'user1'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentService,
                {
                    provide: PrismaService,
                    useValue: {
                        document: {
                            create: jest.fn().mockResolvedValue(mockDocument),
                            findMany: jest.fn().mockResolvedValue([mockDocument]),
                            findFirst: jest.fn().mockResolvedValue(mockDocument),
                            update: jest.fn().mockResolvedValue(mockDocument),
                            delete: jest.fn().mockResolvedValue(mockDocument),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<DocumentService>(DocumentService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createDocument', () => {
        it('should create a document', async () => {
            const result = await service.createDocument(mockCreateDocumentDto);
            expect(result).toEqual(mockDocument);
            expect(prismaService.document.create).toHaveBeenCalledWith({
                data: mockCreateDocumentDto,
            });
        });
    });

    describe('findAll', () => {
        it('should return all documents', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockDocument]);
            expect(prismaService.document.findMany).toHaveBeenCalled();
        });
    });

    describe('findByUser', () => {
        it('should return user documents', async () => {
            const userId = 'user1';
            const result = await service.findByUser(userId);
            expect(result).toEqual([mockDocument]);
            expect(prismaService.document.findMany).toHaveBeenCalledWith({
                where: { userId },
            });
        });
    });

    describe('findById', () => {
        it('should return a document by id', async () => {
            const id = '1';
            const result = await service.findById(id);
            expect(result).toEqual(mockDocument);
            expect(prismaService.document.findFirst).toHaveBeenCalledWith({
                where: { id },
            });
        });
    });

    describe('update', () => {
        it('should update a document', async () => {
            const id = '1';
            const result = await service.update(id, mockCreateDocumentDto);
            expect(result).toEqual(mockDocument);
            expect(prismaService.document.update).toHaveBeenCalledWith({
                where: { id },
                data: mockCreateDocumentDto,
            });
        });
    });

    describe('delete', () => {
        it('should delete a document', async () => {
            const id = '1';
            const result = await service.delete(id);
            expect(result).toEqual(mockDocument);
            expect(prismaService.document.delete).toHaveBeenCalledWith({
                where: { id },
            });
        });
    });
});
