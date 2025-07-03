import { Injectable, NotFoundException } from '@nestjs/common';
import { Document } from '../entities/document.entity';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './create-document.dto';

@Injectable()
export class DocumentService {
    constructor(private readonly prisma: PrismaService) {}
    
    async createDocument(
        createDocumentDto: CreateDocumentDto & { userId: string },
    ): Promise<Document> {
        return this.prisma.document.create({ data: createDocumentDto });
    }

    async delete(documentId: string, userId: string): Promise<string> {
        const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
        if (!doc || (doc.userId !== userId)) {
            throw new Error('Unauthorized or document not found');
        }
        await this.prisma.document.delete({
            where: { id: documentId },
        });
        return 'Document supprimé';
    }

    async findAll(): Promise<Document[]> {
        return this.prisma.document.findMany();
    }

    async findByUser(userId: string): Promise<Document[]> {
        return this.prisma.document.findMany({ where: { userId } });
    }

    async findById(id: string, userId: string): Promise<Document> {
        const document = await this.prisma.document.findFirst({
            where: { id },
        });
        if (!document) {
            throw new NotFoundException('Document non trouvé');
        }
        if (document.userId !== userId) {
            throw new Error('Ce document ne vous appartient pas');
        }
        return document;
    }

    async update(id: string, createDocumentDto: CreateDocumentDto, userId: string, userRole: string) {
        const doc = await this.prisma.document.findUnique({ where: { id } });
        if (!doc || (doc.userId !== userId && userRole !== 'admin')) {
            throw new Error('Non autorisé ou document non trouvé');
        }
        return await this.prisma.document.update({
            where: { id },
            data: createDocumentDto,
        });
    }
}
