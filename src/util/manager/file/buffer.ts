/**
 * @author WMXPY
 * @fileoverview Buffer File Management Utils
 */

import { hashBuffer } from '../../data/crypto';
import { getSaveImageByBufferFunction, ImageSaveFunction } from '../save';
import { IFileLink, IFileManager } from "./interface";

export default class BufferFileManager implements IFileManager {
    private _folder: string;
    private _filename: string;
    private _buffer: Buffer;
    private _mime: string;
    private _release: () => void;

    public constructor(folder: string, filename: string, release: () => void, buffer: Buffer, mime: string) {
        this._folder = folder;
        this._filename = filename;
        this._release = release;
        this._buffer = buffer;
        this._mime = mime;
    }

    public async save(): Promise<IFileLink> {
        const saveImageByBuffer: ImageSaveFunction = getSaveImageByBufferFunction();

        const link: IFileLink = await saveImageByBuffer(this._folder, this._filename, this._buffer);
        return link;
    }

    public mime(): string {
        return this._mime;
    }

    public async hash(): Promise<string> {
        const hash: string = await hashBuffer(this._buffer);
        return hash;
    }

    public release(): void {
        this._release();
    }
}
