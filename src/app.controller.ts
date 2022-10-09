import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';
import type BodyObject from './types/body-object.type';
import type Collection from './types/collection.type';
import type Entity from './types/entity.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('*')
  async create(
    @Req() req: Request,
    @Body() body: BodyObject | BodyObject[],
  ): Promise<Entity | Entity[] | BodyObject | BodyObject[]> {
    return this.appService.create(req, body);
  }

  @Get('*')
  async read(
    @Req() req: Request,
    @Body() body: BodyObject,
  ): Promise<Collection | BodyObject[] | Entity | BodyObject> {
    return this.appService.read(req, body);
  }

  @Patch('*')
  async update(
    @Req() req: Request,
    @Body() body: BodyObject | BodyObject[],
  ): Promise<Entity | Entity[] | BodyObject | BodyObject[]> {
    return this.appService.patch(req, body);
  }

  @Delete('*')
  async delete(@Req() req: Request): Promise<{ path: string; deleted: true }> {
    return this.appService.delete(req);
  }
}
