import { Repository, EntityTarget, EntityManager, DeepPartial, SaveOptions } from 'typeorm';

export class SaveRepository<Entity extends any> extends Repository<Entity> {
  constructor(
    entity: EntityTarget<Entity>,
    manager: EntityManager,
  ) {
    super(entity, manager);
  }

  async save<T extends DeepPartial<Entity>>(
    entity: T | T[],
    options?: SaveOptions,
  ): Promise<T & Entity | (T & Entity)[]> {
    if (Array.isArray(entity)) {
      // Handle array of entities
      return Promise.all(entity.map((e) => super.save(e, options))) as unknown as (T & Entity)[];
    } else {
      // Handle single entity
      const savedEntity = await super.save(entity, options);
      return Array.isArray(savedEntity) ? savedEntity[0] : savedEntity;
    }
  }
}
