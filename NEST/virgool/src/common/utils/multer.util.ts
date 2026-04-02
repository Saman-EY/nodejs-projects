import { Request } from "express";
import { mkdirSync } from "fs";
import { extname, join } from "path";

type CallbackFunction = (error: Error | null, destination: string) => void;
type CallbackFilename = (error: Error | null, filename: string) => void;
type MulterFile = Express.Multer.File;

export function MulterDestination(fieldName: string) {
  return function (req: Request, file: MulterFile, callback: CallbackFunction): void {
    let path = join("public", "uploads", fieldName);
    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
}

export function MulterFilename(req: Request, file: MulterFile, callback: CallbackFilename): void {
  const ext = extname(file.originalname);
  const filename = `${Date.now()}${ext}`;
  callback(null, filename);
}
