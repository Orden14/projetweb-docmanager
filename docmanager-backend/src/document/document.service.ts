import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './create-document.dto';
import { Document } from '../entities/document.entity';

@Injectable()
export class DocumentService {
    constructor(private readonly prisma: PrismaService) {}

    async createDocument(createDocumentDto: CreateDocumentDto): Promise<Document> {
        return this.prisma.document.create({ data: createDocumentDto });
    }

    async delete(documentId: string): Promise<boolean> {
        await this.prisma.document.delete({ where: { id: documentId } });
        return true;
    }

    async findAll(): Promise<Document[]> {
        return this.prisma.document.findMany();
    }

    async findByUser(userId: string): Promise<Document[]> {
        return this.prisma.document.findMany({ where: { userId } });
    }

    async findById(id: string): Promise<Document> {
        const document = await this.prisma.document.findFirst({ where: { id } });

        if (!document) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }

        return document;
    }

    async update(id: string, createDocumentDto: CreateDocumentDto): Promise<Document> {
        return this.prisma.document.update({
            where: { id },
            data: createDocumentDto,
        });
    }
}
