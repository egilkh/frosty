import { ConflictException, Injectable } from '@nestjs/common';
import { Level } from 'level';
import type BodyObject from './types/body-object.type';
import hasOwnProperty from './utils/has-own-property';

@Injectable()
export default class DBService {
  private db: Level<string, BodyObject>;

  constructor() {
    this.db = new Level('db', { valueEncoding: 'json' });
  }

  async get(key: string): Promise<BodyObject | null> {
    try {
      const entity = await this.db.get(key);

      return entity;
    } catch (err) {
      if (
        typeof err === 'object' &&
        hasOwnProperty(err, 'code') &&
        err.code === 'LEVEL_NOT_FOUND'
      ) {
        return null;
      }

      throw err;
    }
  }

  private async getAllByPrefix(
    prefix: string,
  ): Promise<[string, BodyObject][]> {
    const iterator = this.db.iterator({ gte: prefix });

    const results: [string, BodyObject][] = [];

    for await (const result of iterator) {
      if (!result[0].startsWith(prefix)) {
        break;
      }

      results.push(result);
    }

    return results;
  }

  async getObjectsByPrefix(prefix: string): Promise<BodyObject[]> {
    const results = await this.getAllByPrefix(prefix);

    return results.map((r) => r[1]);
  }

  async put(key: string, value: BodyObject): Promise<void> {
    try {
      const entity = await this.db.get(key);

      if (entity) {
        throw new ConflictException('Item exists');
      }
    } catch (err) {
      if (
        typeof err === 'object' &&
        !(hasOwnProperty(err, 'code') && err.code === 'LEVEL_NOT_FOUND')
      ) {
        throw err;
      }
    }

    return this.db.put(key, value);
  }

  async patch(key: string, value: BodyObject): Promise<void> {
    return this.db.put(key, value);
  }

  async delete(key: string): Promise<void> {
    return this.db.del(key);
  }

  async deleteByPrefix(prefix: string): Promise<void[]> {
    const results = await this.getAllByPrefix(prefix);

    return Promise.all(results.map((r) => this.delete(r[0])));
  }
}
