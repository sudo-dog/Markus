/**
 * @author WMXPY
 * @fileoverview Image Controller
 */

import * as Crypto from 'crypto';
import { NextFunction, Request, Response } from "express";
import * as Fs from 'fs';
import * as Multer from 'multer';
import * as Path from 'path';
import Config from '../config/config';
import { IImageCallback, IImageListResponse, IImageListResponseAdmin } from '../db/interface/image';
import { IImageModel } from '../db/model/image';
import { error, ERROR_CODE } from './error';

export const imageModelToImageListResponse = (image: IImageModel): IImageListResponse => {
    return {
        active: image.active,
        id: image.id,
        createdAt: image.createdAt,
        original: image.original,
        size: image.size,
        tags: image.tags,
    };
};

export const imageModelToImageListResponseAdmin = (image: IImageModel): IImageListResponseAdmin => {
    return {
        active: image.active,
        id: image.id,
        createdAt: image.createdAt,
        hash: image.hash,
        original: image.original,
        size: image.size,
        tags: image.tags,
    };
};

export const imageModelToImageCallback = (image: IImageModel): IImageCallback => {
    return {
        createdAt: image.createdAt,
        encoding: image.encoding,
        mime: image.mime,
        original: image.original,
        path: image.path,
        size: image.size,
        tags: image.tags,
    };
};

export const uniqueSmall = (): string => {
    return '_' + Math.random().toString(36).substring(2, 9);
};

export const unique = (len?: number) => {
    if (len) {
        if (len > 12 || len < 0) {
            return uniqueSmall();
        }

        const left: string = Math.random().toString(36);
        const right: string = Math.random().toString(36);
        return '_' + ((left + right).substring(2, 2 + len));
    } else {
        return uniqueSmall();
    }
};

export const mkPathDir = (path: string) => {
    Fs.mkdirSync(path);
};

export const checkUploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).body.key === Config.key) {
        (req as any).valid = true;
    } else if (!Config.key) {
        (req as any).valid = true;
    } else {
        (req as any).valid = false;
    }
    next();
};

export const hashImage = (imagePath: string): Promise<string> => {
    const stream: Fs.ReadStream = Fs.createReadStream(imagePath);
    const fsHash: Crypto.Hash = Crypto.createHash('md5');

    return new Promise<string>((resolve: (md5: string) => void, reject: (reason: Error) => void) => {
        stream.on('data', (dataChunk: any) => {
            fsHash.update(dataChunk);
        });

        stream.on('end', () => {
            const md5: string = fsHash.digest('hex');
            resolve(md5);
        });

        stream.on('close', (err: Error) => {
            reject(err);
        });
    });
};

export const Upload = (): Multer.Instance => {
    let count: number = 0;
    let currentPath: string = Path.join(Config.imagePath, unique(7));
    mkPathDir(currentPath);

    const storage: Multer.StorageEngine = Multer.diskStorage({
        destination: (req: any, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
            if (count++ >= Config.imagePFolder) {
                count = 0;
                currentPath = Path.join(Config.imagePath, unique(7));
                mkPathDir(currentPath);
            }
            callback(null, currentPath);
        },
        filename: (req: any, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
            const type = file.mimetype.split('/')[1];
            callback(null, unique(10) + '.' + type);
        },
    });

    return Multer({
        storage,
    });
};

export const UploadWithBase64 = (): ((base64: string) => Promise<string>) => {
    let count: number = 0;
    let currentPath: string = Path.join(Config.imagePath, unique(7));
    mkPathDir(currentPath);

    return (base64: string): Promise<string> => {
        if (count++ >= Config.imagePFolder) {
            count = 0;
            currentPath = Path.join(Config.imagePath, unique(7));
            mkPathDir(currentPath);
        }
        return new Promise<string>((resolve: (value: string) => void, reject: (error: Error) => void) => {
            const splited: string[] = base64.split(';');
            const type: string = splited[0].split('/')[1];
            const filePath: string = Path.join(currentPath, unique(10) + '.' + type);
            const data: string = splited[1].replace(/^base64,/, "");
            Fs.writeFile(filePath, new Buffer(data, 'base64'), (err: Error) => {
                if (err) {
                    reject(error(ERROR_CODE.IMAGE_SAVE_FAILED));
                }
                resolve(filePath);
            });
        });
    };
};
