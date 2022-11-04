import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Request } from 'express';
import DBService from './db.service';
import type BodyObject from './types/body-object.type';
import CollectionOrEntity from './types/collection-or-entity.enum';
import type Collection from './types/collection.type';
import type Entity from './types/entity.type';
import PathInfo from './utils/path-info';

const AppConfig = {
  entityIdentifier: 'id',
  useEntityAndCollection: true,
} as const;

@Injectable()
export class AppService {
  constructor(private db: DBService) {}

  async read(
    request: Request,
    body: BodyObject,
  ): Promise<Collection | Entity | BodyObject[] | BodyObject> {
    const pathInfo = new PathInfo(request.url);

    if (Object.keys(body).length) {
      return body;
    }

    if (pathInfo.collectionOrEntity === CollectionOrEntity.Collection) {
      if (AppConfig.useEntityAndCollection) {
        return this.readCollection(pathInfo.key);
      }

      return this.readPrefix(pathInfo.key);
    }

    if (AppConfig.useEntityAndCollection) {
      return this.readEntity(pathInfo.key);
    }

    return this.readOne(pathInfo.key);
  }

  async create(
    request: Request,
    body: BodyObject | BodyObject[],
  ): Promise<Entity | BodyObject | Entity[] | BodyObject[]> {
    const pathInfo = new PathInfo(request.url);

    if (Array.isArray(body)) {
      const created = await Promise.all(
        body.map((one) => this.createOne(pathInfo, one)),
      );

      if (AppConfig.useEntityAndCollection) {
        return created;
      }

      return created.map((entity) => entity.Entity);
    }

    const created = await this.createOne(pathInfo, body);

    if (AppConfig.useEntityAndCollection) {
      return created;
    }

    return created.Entity;
  }

  private async createOne(
    pathInfo: PathInfo,
    one: BodyObject,
  ): Promise<Entity> {
    let entityId = randomUUID();
    const oneEntityId = one[AppConfig.entityIdentifier];

    if (oneEntityId) {
      entityId = oneEntityId;
    }

    if (!oneEntityId) {
      one[AppConfig.entityIdentifier] = entityId;
    }

    const dbKey = `${pathInfo.hashedPrefix}:${entityId}`;

    await this.db.put(dbKey, one);

    return this.readEntity(dbKey);
  }

  async patch(
    request: Request,
    body: BodyObject | BodyObject[],
  ): Promise<Entity | Entity[] | BodyObject | BodyObject[]> {
    const pathInfo = new PathInfo(request.url);

    if (Array.isArray(body)) {
      if (pathInfo.collectionOrEntity !== CollectionOrEntity.Collection) {
        throw new BadRequestException(
          'Patching a collection require an Array of objects to patch',
        );
      }

      const patched = await Promise.all(
        body.map((one) =>
          this.patchOne(
            pathInfo.newWithEntityId(one[AppConfig.entityIdentifier]),
            one,
          ),
        ),
      );

      if (AppConfig.useEntityAndCollection) {
        return patched;
      }

      return patched.map((p) => p.Entity);
    }

    const patched = await this.patchOne(pathInfo, body);

    if (AppConfig.useEntityAndCollection) {
      return patched;
    }

    return patched.Entity;
  }

  async patchOne(pathInfo: PathInfo, one: BodyObject): Promise<Entity> {
    const entity = await this.db.get(pathInfo.key);

    if (!entity) {
      throw new NotFoundException();
    }

    const entityId = entity[AppConfig.entityIdentifier];

    if (!entityId) {
      throw new Error('entityIdentifier missing from Entity');
    }

    // Do not override 'entityIdentifier' in entity
    one[AppConfig.entityIdentifier] = entityId;

    Object.keys(one).forEach((k) => {
      entity[k] = one[k];
    });

    await this.db.patch(pathInfo.key, entity);

    return this.readEntity(pathInfo.key);
  }

  async delete(request: Request): Promise<{ path: string; deleted: true }> {
    const pathInfo = new PathInfo(request.url);

    if (pathInfo.collectionOrEntity === CollectionOrEntity.Entity) {
      const entity = await this.db.get(pathInfo.key);

      if (!entity) {
        throw new NotFoundException();
      }

      await this.db.delete(pathInfo.key);
    } else {
      await this.db.deleteByPrefix(pathInfo.key);
    }

    return { path: pathInfo.key, deleted: true };
  }

  async readPrefix(prefix: string): Promise<BodyObject[]> {
    return this.db.getObjectsByPrefix(prefix);
  }

  async readCollection(path: string): Promise<Collection> {
    return {
      path,
      Collection: await this.readPrefix(path),
    };
  }

  async readOne(path: string): Promise<BodyObject> {
    const Entity = await this.db.get(path);

    if (!Entity) {
      throw new NotFoundException();
    }

    return Entity;
  }

  async readEntity(path: string): Promise<Entity> {
    return {
      path,
      Entity: await this.readOne(path),
    };
  }
}
