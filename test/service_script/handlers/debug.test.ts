/**
 * @author WMXPY
 * @description Script Handlers
 * @fileoverview Debug Handlers Test
 */

import { expect } from 'chai';
import * as Controller from '../../../src/database/controller/import';
import { IFileModel } from '../../../src/database/model/file';
import { IImageModel } from '../../../src/database/model/image';
import { ITagModel, TagModel } from '../../../src/database/model/tag';
import * as Handlers from '../../../src/script/handlers/import';
import { IMockHandlerResult, MockHandler } from '../../mock/express';
import { mockConfig } from '../../mock/mock';

export const testScriptDebugHandlers = (): void => {
    describe('debug handler test', (): void => {
        let testFile: IFileModel;
        let testTag: ITagModel;

        before(function (this: Mocha.Context, next: () => void) {
            this.timeout(4000);
            Controller.File.createFile({
                encoding: 'encoding',
                mime: 'mime',
                original: 'origin',
                size: 500,
                folder: 'test',
                filename: 'test',
                hash: 'hash-debug-temp',
            }).then((file: IFileModel) => {
                testFile = file;
                next();
            });
        });

        before(function (this: Mocha.Context, next: () => void) {
            this.timeout(4000);
            Controller.Tag.createTag({
                name: 'test-for-debug-handler',
            }).then((tag: ITagModel) => {
                testTag = tag;
                next();
            });
        });

        before(function (this: Mocha.Context, next: () => void) {
            this.timeout(4000);
            Controller.Image.createImage({
                tags: [testTag._id],
                file: testFile._id,
            }).then((image: IImageModel) => {
                next();
            });
        });

        it('output image id list should give a list of images', async (): Promise<void> => {
            const mock: MockHandler = new MockHandler();

            const { request, response } = mock.flush();
            await Handlers.Debug.OutputImageIdList(request, response);

            const result: IMockHandlerResult = mock.end();

            // tslint:disable-next-line
            expect(result).to.be.not.null;
            expect(result.status).to.be.equal(200);
            expect(result.body.data.length).to.be.gte(1);
            return;
        }).timeout(3200);

        it('output image id list should throw if not in debug mode', async (): Promise<void> => {
            const mock: MockHandler = new MockHandler();
            const restoreConfig: () => void = mockConfig({
                isDebug: false,
            });

            const { request, response } = mock.flush();
            await Handlers.Debug.OutputImageIdList(request, response);

            const result: IMockHandlerResult = mock.end();
            restoreConfig();
            // tslint:disable-next-line
            expect(result).to.be.not.null;
            expect(result.status).to.be.equal(400);
            return;
        }).timeout(3200);

        it('verify tags is created', async (): Promise<void> => {
            const Tags: ITagModel[] = await TagModel.find({});
            expect(Tags.length).to.be.gte(1);
            return;
        }).timeout(3200);

        it('empty data base should clean everything', async (): Promise<void> => {
            const mock: MockHandler = new MockHandler();

            const { request, response } = mock.flush();
            await Handlers.Debug.emptyDatabaseHandler(request, response);

            const result: IMockHandlerResult = mock.end();
            // tslint:disable-next-line
            expect(result).to.be.not.null;
            expect(result.status).to.be.equal(200);

            const Tags: ITagModel[] = await TagModel.find({});
            expect(Tags).to.be.lengthOf(0);
            return;
        }).timeout(3200);

        it('empty data base should throw if not in debug mode', async (): Promise<void> => {
            const mock: MockHandler = new MockHandler();
            const restoreConfig: () => void = mockConfig({
                isDebug: false,
            });

            const { request, response } = mock.flush();
            await Handlers.Debug.emptyDatabaseHandler(request, response);

            const result: IMockHandlerResult = mock.end();
            restoreConfig();
            // tslint:disable-next-line
            expect(result).to.be.not.null;
            expect(result.status).to.be.equal(400);
            return;
        }).timeout(3200);
    });
};
