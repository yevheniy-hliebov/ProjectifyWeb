import { extname } from "path";
import { FileDto } from "../types/file.type";

export function validationImage(file: FileDto, options: { extensions?: string, maxImageSize?: number }) {
  const errors: any = {};
  const { extensions, maxImageSize } = options;
    
  const arrayAllowedExtensions = extensions.split(',')

  const fileExtension = extname(file.originalname).replace('.', '');

  if (extensions) {
    if (!arrayAllowedExtensions.includes(fileExtension)) {
      errors.types = `Expected type${arrayAllowedExtensions.length > 1 ? 's' : ''} - ${extensions}`
    }
  }

  if (maxImageSize && maxImageSize < file.size) {
    errors.size = `Expected size is less than ${maxImageSize} KB`
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}