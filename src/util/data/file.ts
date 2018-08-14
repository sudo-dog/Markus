/**
 * @author WMXPY
 * @fileoverview Data File Utils
 */

import * as Fs from 'fs';
import * as Path from 'path';
import { IFileModel } from "../../database/model/file";
import { error, ERROR_CODE } from "../error/error";
import { uniqueSmall } from '../image';
import { fileBuilder } from './path';

export const fixConflictName = (name: string) => {
    const extname = Path.extname(name);
    const basename = name.substring(0, name.length - extname.length);

    return basename + uniqueSmall() + extname;
};

export const releaseStorage = (path: string): Promise<void> => {
    return new Promise<void>((resolve: () => void, reject: (err: Error) => void) => {
        Fs.unlink(path, (err: Error | null): void => {
            if (err) {
                reject(error(ERROR_CODE.IMAGE_UNLINK_FAILED));
            }
            resolve();
        });
    });
};

export const touchDecrementAndRelease = async (file: IFileModel): Promise<void> => {
    file.refDecrement();
    if (file.touchRemove()) {
        await removeFile(file);
    }
    return;
};

export const removeFile = async (file: IFileModel): Promise<void> => {
    await releaseStorage(fileBuilder(file.folder, file.filename));
    return;
};

export const mkPathDir = (path: string) => {
    const exist: boolean = Fs.existsSync(path);
    if (!exist) {
        Fs.mkdirSync(path);
    }
};
