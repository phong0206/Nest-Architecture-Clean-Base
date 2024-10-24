import { BaseService } from '@common';
import { ImageUpload } from '@entity/image.entity';
export abstract class ImageUploadRepository extends BaseService<ImageUpload> {
  abstract uploadFile(file: Express.Multer.File);
  abstract uploadFiles(files: Express.Multer.File[]);
}
