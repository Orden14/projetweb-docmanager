import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import {DocumentProcessor} from "./document.processor";

@Module({
    providers: [DocumentResolver, DocumentService, DocumentProcessor],
    exports: [DocumentService],
})

export class DocumentModule {}
