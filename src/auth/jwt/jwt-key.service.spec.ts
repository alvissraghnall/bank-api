import { Test, TestingModule } from '@nestjs/testing';
import { JwtKeyService } from './jwt-key.service';
import * as fs from 'fs';
import * as path from 'path';

describe('JwtKeyService', () => {
  let jwtKeyService: JwtKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtKeyService],
    }).compile();

    jwtKeyService = module.get<JwtKeyService>(JwtKeyService);
  });

  it('should be defined', () => {
    expect(jwtKeyService).toBeDefined();
  });

  describe('getPrivKey', () => {
    it('should return the private key as a Buffer', async () => {
      const privateKeyPath = path.join(process.cwd(), './private.pem');

      // Mock the fs.readFile method to return a Buffer
      jest.spyOn(fs, 'readFile').mockImplementation((path, callback) => {
        callback(null, Buffer.from('fake-private-key'));
      });

      const result = await jwtKeyService.getPrivKey();

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('fake-private-key');

      // Ensure that fs.readFile was called with the correct path
      expect(fs.readFile).toHaveBeenCalledWith(privateKeyPath, expect.any(Function));
    });

    it('should throw an error if reading the private key fails', async () => {
      // Mock the fs.readFile method to return an error
      jest.spyOn(fs, 'readFile').mockImplementation((path, callback) => {
        callback(new Error('Failed to read private key'), null);
      });

      try {
        await jwtKeyService.getPrivKey();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed to read private key');
      }
    });
  });

  describe('getPubKey', () => {
    it('should return the public key as a Buffer', async () => {
      const publicKeyPath = path.join(process.cwd(), './public.pem');

      // Mock the fs.readFile method to return a Buffer
      jest.spyOn(fs, 'readFile').mockImplementation((path, callback) => {
        callback(null, Buffer.from('fake-public-key'));
      });

      const result = await jwtKeyService.getPubKey();

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('fake-public-key');

      // Ensure that fs.readFile was called with the correct path
      expect(fs.readFile).toHaveBeenCalledWith(publicKeyPath, expect.any(Function));
    });

    it('should throw an error if reading the public key fails', async () => {
      // Mock the fs.readFile method to return an error
      jest.spyOn(fs, 'readFile').mockImplementation((path, callback) => {
        callback(new Error('Failed to read public key'), Buffer.from(path.toString()));
      });

      try {
        await jwtKeyService.getPubKey();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed to read public key');
      }
    });
  });
});
