import { DocumentResolver } from './document.resolver';
import { DocumentService } from '../services/document.service';
import { CreateDocumentDto } from '../dto/create-document.dto';

describe('DocumentResolver', () => {
    let documentResolver: DocumentResolver;
    let mockDocumentService: DocumentService;

    beforeEach(() => {
        mockDocumentService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUser: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
        } as unknown as DocumentService;
        documentResolver = new DocumentResolver(mockDocumentService);
    });

    it('devrait créer un document', () => {
        const createDocumentDto: CreateDocumentDto = { title: 'Doc1', description: 'Description1', fileUrl: 'url1', userId: 'user1' };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const document = { id: expect.any(String), ...createDocumentDto };

        jest.spyOn(mockDocumentService, 'create').mockReturnValue(document);

        const result = documentResolver.createDocument(createDocumentDto);
        expect(result).toEqual(document);
        expect(mockDocumentService.create).toHaveBeenCalledWith(expect.objectContaining(createDocumentDto)); // Vérification des propriétés sans l'ID
    });

    it('devrait retourner tous les documents', () => {
        const documents = [{ id: '1', title: 'Doc1', description: 'Description1', fileUrl: 'url1', userId: 'user1' }];
        jest.spyOn(mockDocumentService, 'findAll').mockReturnValue(documents);

        const result = documentResolver.findAllDocuments();
        expect(result).toEqual(documents);
        expect(mockDocumentService.findAll).toHaveBeenCalled();
    });
});
