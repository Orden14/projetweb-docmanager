import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import {DocumentProcessor} from "./document.processor";
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [DocumentResolver, DocumentService, DocumentProcessor],
    exports: [DocumentService],
})

export class DocumentModule {}
