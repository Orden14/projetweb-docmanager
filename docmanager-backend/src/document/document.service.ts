import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './create-document.dto';
import { Document } from '../entities/document.entity';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DocumentService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createDocument(
        createDocumentDto: CreateDocumentDto,
    ): Promise<Document> {
        return this.prisma.document.create({ data: createDocumentDto });
    }

    async findAll(): Promise<Document[]> {
        return this.prisma.document.findMany();
    }

    async findByUser(userId: string): Promise<Document[]> {
        return this.prisma.document.findMany({ where: { userId } });
    }

    async findById(id: string): Promise<Document> {
        const document = await this.prisma.document.findFirst({
            where: { id },
        });

        if (!document) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }

        return document;
    }

    async delete(documentId: string, userId : string) {
        const doc = await this.prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!doc || (doc.userId !== userId && userRole !== 'admin')) {
            throw new Error('Unauthorized or document not found');
        }

        return this.prisma.document.delete({
            where: {
                id: documentId,
            },
        });
    }

    async update(
        id: string,
        createDocumentDto: CreateDocumentDto,
        userId: string,
        userRole: string,
    ) {
        const doc = await this.prisma.document.findUnique({ where: { id } });
        if (!doc || (doc.userId !== userId && userRole !== 'admin')) {
            throw new Error('Unauthorized or document not found');
        }
        return await this.prisma.document.update({
            where: {
                id: id,
            },

            data: createDocumentDto,
        });
    }
}
