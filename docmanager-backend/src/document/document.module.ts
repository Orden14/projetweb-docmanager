import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';

@Module({
    providers: [DocumentResolver, DocumentService],
    exports: [DocumentService],
})

export class DocumentModule {}
