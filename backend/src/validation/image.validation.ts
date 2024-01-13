import { extname } from "path";
import { FileDto } from "../types/file.type";

export function validationImage(file: FileDto, allowedExtensions: string | Array<string>, maxFileSize: number) {
  const errors: any = {};

  const fileExtension = extname(file.originalname);

  if (Array.isArray(allowedExtensions)) {
    if (!allowedExtensions.includes(fileExtension)) {
      let allowedExtensionsString = '';     
      allowedExtensions.forEach((exception, index) => {
        allowedExtensionsString += exception + (index < allowedExtensions.length - 1 ? ', ' :  '')
      });
      errors.types = `Expected types - ${allowedExtensionsString}`
    }
  } else if(typeof allowedExtensions === 'string') {
    if (allowedExtensions !== fileExtension) {
      errors.types = `Expected types - ${allowedExtensions}`
    }
  }

  if (maxFileSize < file.size) {
    errors.size = `Expected size is less than ${maxFileSize} MB`
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}