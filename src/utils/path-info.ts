import { BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';
import isInt from 'validator/lib/isInt';
import isUUID from 'validator/lib/isUUID';
import CollectionOrEntity from '../types/collection-or-entity.enum';

export default class PathInfo {
  public readonly collectionOrEntity: CollectionOrEntity;
  public readonly prefix: string;
  public readonly entityId: string | null = null;

  public readonly url: string;

  constructor(url: string) {
    this.url = url;

    const urlSegments = url.split('/').filter((p) => !!p);

    if (urlSegments.length === 0) {
      throw new BadRequestException(
        'At least one collection needs to be part of url',
      );
    }

    const lastUrlSegment = urlSegments[urlSegments.length - 1];

    if (!lastUrlSegment) {
      throw new Error('Failed to find lastUrlSegment');
    }

    if (isInt(lastUrlSegment) || isUUID(lastUrlSegment)) {
      this.collectionOrEntity = CollectionOrEntity.Entity;
      this.entityId = urlSegments.pop() ?? null;
    } else {
      this.collectionOrEntity = CollectionOrEntity.Collection;
    }

    this.prefix = urlSegments.join();
  }

  get key(): string {
    if (this.collectionOrEntity === CollectionOrEntity.Entity) {
      if (!this.entityId) {
        throw new Error('Guessed Entity but not EntityId to be found');
      }

      return `${this.hashedPrefix}:${this.entityId}`;
    }

    return this.hashedPrefix;
  }

  get hashedPrefix(): string {
    const hash = createHash('sha256');

    hash.update(this.prefix);

    return hash.digest('hex');
  }

  newWithEntityId(entityId?: string | number): PathInfo {
    if (!entityId) {
      throw new BadRequestException('entityId is required');
    }

    if (this.entityId) {
      throw new BadRequestException('PathInfo.entityId is already set');
    }

    return new PathInfo(`${this.url}/${entityId}`);
  }
}
