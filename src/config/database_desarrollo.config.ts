import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseDesarrolloConfig implements TypeOrmOptionsFactory{
    constructor(private configService : ConfigService){}

    createTypeOrmOptions(){
        return this.configService.get('database2');
    }
}