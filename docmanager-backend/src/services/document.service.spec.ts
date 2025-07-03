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
        it('should update a document (user owner)', async () => {
            prismaService.document.findUnique = jest.fn().mockResolvedValue({ ...mockDocument, userId: 'user1' });
            const result = await service.update('1', mockCreateDocumentDto, 'user1', 'user');
            expect(result).toEqual(mockDocument);
        });
        it('should update a document (admin)', async () => {
            prismaService.document.findUnique = jest.fn().mockResolvedValue({ ...mockDocument, userId: 'user1' });
            const result = await service.update('1', mockCreateDocumentDto, 'adminId', 'admin');
            expect(result).toEqual(mockDocument);
        });
        it('should throw if not owner or admin', async () => {
            prismaService.document.findUnique = jest.fn().mockResolvedValue({ ...mockDocument, userId: 'user1' });
            await expect(service.update('1', mockCreateDocumentDto, 'otherUser', 'user')).rejects.toThrow('Unauthorized or document not found');
        });
    });

    describe('delete', () => {
        it('should delete a document (user owner)', async () => {
            prismaService.document.findUnique = jest.fn().mockResolvedValue({ ...mockDocument, userId: 'user1' });
            const result = await service.delete('1', 'user1', 'user');
            expect(result).toEqual(mockDocument);
        });
        it('should delete a document (admin)', async () => {
            prismaService.document.findUnique = jest.fn().mockResolvedValue({ ...mockDocument, userId: 'user1' });
            const result = await service.delete('1', 'adminId', 'admin');
            expect(result).toEqual(mockDocument);
        });
        it('should throw if not owner or admin', async () => {
            prismaService.document.findUnique = jest.fn().mockResolvedValue({ ...mockDocument, userId: 'user1' });
            await expect(service.delete('1', 'otherUser', 'user')).rejects.toThrow('Unauthorized or document not found');
        });
    });
});
