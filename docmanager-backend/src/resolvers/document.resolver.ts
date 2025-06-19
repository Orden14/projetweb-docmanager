import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {DocumentService} from '../services/document.service';
import {Document} from '../entities/document.entity';
import {CreateDocumentDto} from '../dto/create-document.dto';
import {v4 as uuidv4} from 'uuid';

@Resolver(() => Document)
export class DocumentResolver {
    constructor(private readonly documentService: DocumentService) {
    }

    @Query(() => [Document])
    findAllDocuments(): Document[] {
        return this.documentService.findAll();
    }

    @Query(() => [Document])
    getDocumentsByUser(@Args('userId') userId: string): Document[] {
        return this.documentService.findByUser(userId);
    }

    @Query(() => Document, {nullable: true})
    getDocumentById(@Args('id') id: string): Document | null {
        return this.documentService.findById(id);
    }

    @Mutation(() => Document)
    createDocument(
        @Args('createDocumentDto') createDocumentDto: CreateDocumentDto,
    ): Document {
        const document: Document = {id: uuidv4(), ...createDocumentDto};
        return this.documentService.create(document);
    }

    @Mutation(() => Document, {nullable: true})
    updateDocument(
        @Args('id') id: string,
        @Args('title', {nullable: true}) title?: string,
        @Args('description', {nullable: true}) description?: string,
        @Args('fileUrl', {nullable: true}) fileUrl?: string,
    ): Document | null {
        return this.documentService.update(id, {title, description, fileUrl});
    }
}
