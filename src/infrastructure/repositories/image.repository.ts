import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, In, Repository } from 'typeorm';
import { Storage } from '../../infrastructure/nest-storage/storage';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { getPathStorage } from '../nest-storage/helpers/extensions';
import { ImageUploadRepository } from '@repository/imageRepository.interface';
import { ImageUpload } from '@entity/image.entity';

@Injectable()
export class DatabaseImageUploadRepository extends ImageUploadRepository {
  notFoundMessage = 'Image not found';
  constructor(
    @InjectRepository(ImageUpload)
    private readonly imageEntityRepository: Repository<ImageUpload>,
    private readonly connection: Connection,
    private readonly exceptionService: ExceptionsService,
  ) {
    super(imageEntityRepository);
  }

  async uploadFile(file: Express.Multer.File, entityManager?: EntityManager) {
    const imagePath = `${getPathStorage()}images/${file.path}`;
    await Storage.disk().put(imagePath, file.buffer);
    const dataUpload = {
      file_name: file.filename,
      path: imagePath,
    };
    return entityManager?.save(ImageUpload, dataUpload) || this.imageEntityRepository.save(dataUpload);
  }

  async uploadFiles(files: Express.Multer.File[]) {
    // Start a new transaction
    const queryRunner = this.connection.createQueryRunner();
    // Establishing the connection
    await queryRunner.connect();
    // Starting the transaction
    await queryRunner.startTransaction();
    try {
      const filesUploaded = [];
      for (const file of files) {
        const filePath = `${getPathStorage()}images/${file.path}`;
        await Storage.disk().put(filePath, file.buffer);
        const image = await this.imageEntityRepository.create({
          file_name: file.filename,
          path: filePath,
        });
        filesUploaded.push(image);
      }

      // Saving the image records within the transaction
      await queryRunner.manager.save(ImageUpload, filesUploaded);
      // Commit the transaction if everything went well
      await queryRunner.commitTransaction();
      return filesUploaded
    } catch (err) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
