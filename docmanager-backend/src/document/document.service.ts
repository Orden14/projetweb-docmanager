import {Injectable} from '@nestjs/common';
import {CreateDocumentDto} from './create-document.dto';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
    constructor(private readonly prisma: PrismaService) {}

    async createDocument(createDocumentDto: CreateDocumentDto) {
        return await this.prisma.document.create({
            data: createDocumentDto,
        });
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
