import { ImageUploadRepository } from '@repository/imageRepository.interface';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';

export class ImageUploadUsecases {
  constructor(
    private readonly exceptionsService: ExceptionsService,
    private readonly imageRepository: ImageUploadRepository,
  ) {}

  async uploadFiles(images: Express.Multer.File[]) {
    return this.imageRepository.uploadFiles(images);
  }
}
