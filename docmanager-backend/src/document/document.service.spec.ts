import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('DocumentService', () => {
    let service: DocumentService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentService,
                {
                    provide: PrismaService,
                    useValue: {
                        document: {
                            create: jest.fn(),
                            delete: jest.fn(),
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
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
            const createDocumentDto = {
                title: 'Test Document',
                userId: '123',
                description: 'Test Description',
                fileUrl: 'http://example.com/file.pdf',
            };
            const createdDocument = { id: '1', ...createDocumentDto };

            jest.spyOn(prismaService.document, 'create').mockResolvedValue(createdDocument);

            const result = await service.createDocument(createDocumentDto);
            expect(result).toEqual(createdDocument);
            expect(prismaService.document.create).toHaveBeenCalledWith({ data: createDocumentDto });
        });
    });

    describe('delete', () => {
        it('should delete a document', async () => {
            (prismaService.document.findUnique as jest.Mock).mockResolvedValue({ id: '1', userId: '123' });
            jest.spyOn(prismaService.document, 'delete').mockResolvedValue({ id: '1', title: '', description: '', fileUrl: '', userId: '' });

            const result = await service.delete('1', '123');
            expect(result).toBe('Document supprimé');
            expect(prismaService.document.delete).toHaveBeenCalledWith({ where: { id: '1' } });
        });
    });

    describe('findAll', () => {
        it('should return all documents', async () => {
            const documents = [
                { id: '1', title: 'Doc1', description: 'Desc1', fileUrl: 'http://example.com/1', userId: '123' },
                { id: '2', title: 'Doc2', description: 'Desc2', fileUrl: 'http://example.com/2', userId: '456' },
            ];

            jest.spyOn(prismaService.document, 'findMany').mockResolvedValue(documents);

            const result = await service.findAll();
            expect(result).toEqual(documents);
            expect(prismaService.document.findMany).toHaveBeenCalled();
        });
    });

    describe('findByUser', () => {
        it('should return documents by user', async () => {
            const userId = '123';
            const documents = [
                { id: '1', title: 'Doc1', description: 'Desc1', fileUrl: 'http://example.com/1', userId },
            ];

            jest.spyOn(prismaService.document, 'findMany').mockResolvedValue(documents);

            const result = await service.findByUser(userId);
            expect(result).toEqual(documents);
            expect(prismaService.document.findMany).toHaveBeenCalledWith({ where: { userId } });
        });
    });

    describe('findById', () => {
        it('should return a document by ID', async () => {
            const document = { id: '1', title: 'Doc1', description: 'Desc1', fileUrl: 'http://example.com/1', userId: '123' };

            jest.spyOn(prismaService.document, 'findFirst').mockResolvedValue(document);

            const result = await service.findById('1', '123');
            expect(result).toEqual(document);
            expect(prismaService.document.findFirst).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should throw NotFoundException if document not found', async () => {
            jest.spyOn(prismaService.document, 'findFirst').mockResolvedValue(null);

            await expect(service.findById('1', '123')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a document', async () => {
            const updateDto = {
                title: 'Updated Title',
                description: 'Updated Description',
                fileUrl: 'http://example.com/updated.pdf',
                userId: '123',
            };
            const updatedDocument = { id: '1', ...updateDto };
            (prismaService.document.findUnique as jest.Mock).mockResolvedValue({ id: '1', userId: '123' });
            jest.spyOn(prismaService.document, 'update').mockResolvedValue(updatedDocument);

            const result = await service.update('1', updateDto, '123', 'admin');
            expect(result).toEqual(updatedDocument);
            expect(prismaService.document.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: updateDto,
            });
        });
    });
});
