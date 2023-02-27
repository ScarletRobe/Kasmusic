import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import { YaDisk } from './yandex-disk-api';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FileService {
  @Inject(ConfigService)
  public config: ConfigService;
  private disk;

  initDisk() {
    this.disk = new YaDisk(process.env.YANDEX_AUTH_TOKEN);
  }

  async createFile(type: FileType, file) {
    if (!this.disk) {
      this.initDisk();
    }
    const fileExtension = file.originalname.split('.').pop();
    const fileName = uuid.v4() + '.' + fileExtension;
    const path = `music-platform%2F${type}%2F${fileName}`;

    await this.disk.upload({ path, file: file });
    const publishUrl = (await this.disk.publish({ path })).href;
    const metaInfo = (await this.disk.getMetaInfo(publishUrl)).data;
    const fileUrl = metaInfo.file;
    return { url: fileUrl, name: fileName };
  }

  async removeFile(type: FileType, fileName: string) {
    if (!this.disk) {
      this.initDisk();
    }
    if (!fileName) {
      return;
    }
    await this.disk.remove({
      path: `music-platform%2F${type}%2F${fileName}`,
      permanently: true,
    });
  }
}
