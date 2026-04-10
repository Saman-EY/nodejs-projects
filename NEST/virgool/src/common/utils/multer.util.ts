import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { mkdirSync } from "fs";
import { extname, join, posix } from "path";
import { BadRequestMessage } from "../enums/messages.enum";
import { diskStorage } from "multer";

type CallbackFunction = (error: Error | null, destination: string) => void;
type CallbackFilename = (error: Error | null, filename: string | null) => void;
export type MulterFile = Express.Multer.File;

export function MulterDestination(fieldName: string) {
  return function (req: Request, file: MulterFile, callback: CallbackFunction): void {
    // let path = join("public", "uploads", fieldName);
    let path = posix.join("public", "uploads", fieldName);
    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
}

export function MulterFilename(req: Request, file: MulterFile, callback: CallbackFilename): void {
  const ext = extname(file.originalname);
  if (!isValidImageFormat(ext)) {
    callback(new BadRequestException(BadRequestMessage.InvalidImageFormat), null);
  } else {
    const filename = `${Date.now()}${ext}`;
    callback(null, filename);
  }
}

function isValidImageFormat(ext: string) {
  return [".png", ".jpg", ".jpeg"].includes(ext);
}

export function multerStorage(folderName: string) {
  return diskStorage({
    destination: MulterDestination(folderName),
    filename: MulterFilename as any,
  });
}
