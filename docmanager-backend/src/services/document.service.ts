import { Injectable } from '@nestjs/common';
import { Document } from '@prisma/client';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentService {
    constructor(private readonly prisma: PrismaService) {}

    async createDocument(createDocumentDto: CreateDocumentDto) {
        const document = await this.prisma.document.create({
            data: createDocumentDto,
        });

        return document;
    }

    async delete(documentId: string) {
        return await this.prisma.document.delete({
            where: {
                id: documentId,
            },
        });
    }

    async findAll() {
        return await this.prisma.document.findMany();
    }

    async findByUser(userId: string) {
        return await this.prisma.document.findMany({
            where: {
                userId: userId,
            },
        });
    }

    async findById(id: string) {
        return await this.prisma.document.findFirst({
            where: {
                id: id,
            },
        });
    }

    async update(id: string, createDocumentDto: CreateDocumentDto) {
        return await this.prisma.document.update({
            where: {
                id: id,
            },
            data: createDocumentDto,
        });
    }
}
