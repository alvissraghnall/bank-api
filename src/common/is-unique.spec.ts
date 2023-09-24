import { Test, TestingModule } from '@nestjs/testing';
import { IsUnique, IsUniqueConstraint } from './is-unique';
import { DataSource, Entity, Repository } from 'typeorm';

// Sample entity for testing
@Entity()
class SampleEntity {
  constructor(public id: number, public name: string) {}
}

describe('IsUniqueConstraint', () => {
  let isUniqueConstraint: IsUniqueConstraint;

  beforeEach(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
      query: jest.fn(),
    } as any;
    isUniqueConstraint = new IsUniqueConstraint(dataSource);
  });

  it('should be defined', () => {
    expect(isUniqueConstraint).toBeDefined();
  });

  it('should return true if the entity with the specified field value does not exist', async () => {
    // Mock the findOne method of the repository to return null
    const mockRepository = {
        findOne: jest.fn().mockResolvedValue(null),
    } as unknown as Repository<SampleEntity>;

    const dataSource: DataSource = {
      getRepository: jest.fn(() => mockRepository),
    } as any;

    isUniqueConstraint = new IsUniqueConstraint(dataSource);

    const result = await isUniqueConstraint.validate('test-value', {
        constraints: ['SampleEntity', 'name'],
        value: undefined,
        targetName: '',
        object: undefined,
        property: ''
    });

    expect(result).toBe(true);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { name: 'test-value' },
    });
  });

  it('should return false if the entity with the specified field value exists', async () => {
    // Mock the findOne method of the repository to return an entity
    const mockRepository = {
      findOne: jest.fn().mockResolvedValue(new SampleEntity(1, 'test-value')),
    } as unknown as Repository<SampleEntity>;

    const dataSource: DataSource = {
      getRepository: jest.fn(() => mockRepository),
    } as any;

    isUniqueConstraint = new IsUniqueConstraint(dataSource);

    const result = await isUniqueConstraint.validate('test-value', {
      constraints: ['SampleEntity', 'name'],
      value: undefined,
      targetName: '',
      object: undefined,
      property: ''
    });

    expect(result).toBe(false);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { name: 'test-value' },
    });
  });
});

// describe('IsUnique Decorator', () => {
//     it('should create a validator constraint with the provided model and field', () => {
//       // Create a mock class with a property decorated with @IsUnique
//       class SampleEntity {
//         @IsUnique('SampleEntity', 'name', { message: 'Name must be unique' })
//         propertyName: string;
//       }
  
//       // Create an instance of the class to trigger the decorator
//       const target = new SampleEntity();
  
//       console.log(SampleEntity.constructor.toString(), target.constructor.length, SampleEntity.constructor['__validators']);

//       // Get the validators from the class constructor
//       const validators = target.constructor['__validators'];
  
//       // Expect the validators to contain the IsUniqueConstraint
//       expect(validators).toEqual([
//         {
//           name: 'isUnique',
//           target: target.constructor,
//           constraints: ['SampleEntity', 'name'],
//           options: { message: 'Name must be unique' },
//           propertyName: 'propertyName',
//           validator: IsUniqueConstraint,
//         },
//       ]);
//     });
// });
