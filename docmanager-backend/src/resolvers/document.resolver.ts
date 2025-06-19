import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DocumentService } from '../services/document.service';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { v4 as uuidv4 } from 'uuid';

@Resolver(() => Document)
export class DocumentResolver {
    constructor(private readonly documentService: DocumentService) {}

    @Query(() => [Document])
    findAllDocuments(): Document[] {
        return this.documentService.findAll();
    }

    @Mutation(() => Document)
    createDocument(@Args('createDocumentDto') createDocumentDto: CreateDocumentDto): Document {
        const document: Document = { id: uuidv4(), ...createDocumentDto };
        return this.documentService.create(document);
    }
}
