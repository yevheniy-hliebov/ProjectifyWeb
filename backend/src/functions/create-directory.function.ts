import * as fs from 'fs';
import { Logger } from '@nestjs/common';

export default async function createDirectory(path: string) {
  const logger = new Logger('FileSystem')
  const existFolder = fs.existsSync(path)
  if (!existFolder)
    try {
      await fs.promises.mkdir(path, { recursive: true });
      logger.log('Created directory: ' + path);
    } catch (err) {
      logger.error('Error creating directory:', err);
    }
}