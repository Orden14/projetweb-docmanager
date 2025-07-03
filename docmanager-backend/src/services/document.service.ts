import {Injectable} from '@nestjs/common';
import {CreateDocumentDto} from '../dto/create-document.dto';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
    constructor(private readonly prisma: PrismaService) {}

    async createDocument(createDocumentDto: CreateDocumentDto) {
        return await this.prisma.document.create({
            data: createDocumentDto,
        });
    }

    async delete(documentId: string, userId: string, userRole: string) {
        // Vérifie que le document appartient à l'utilisateur ou que l'utilisateur est admin
        const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
        if (!doc || (doc.userId !== userId && userRole !== 'admin')) {
            throw new Error('Unauthorized or document not found');
        }
        return await this.prisma.document.delete({
            where: { id: documentId },
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

    async update(id: string, createDocumentDto: CreateDocumentDto, userId: string, userRole: string) {
        const doc = await this.prisma.document.findUnique({ where: { id } });
        if (!doc || (doc.userId !== userId && userRole !== 'admin')) {
            throw new Error('Unauthorized or document not found');
        }
        return await this.prisma.document.update({
            where: { id },
            data: createDocumentDto,
        });
    }
}
