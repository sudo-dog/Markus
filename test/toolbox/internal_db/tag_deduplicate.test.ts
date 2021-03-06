/**
 * @author WMXPY
 * @fileoverview Tool Tag duplicate remover tests
 */

import { ObjectID } from 'bson';
import { expect } from 'chai';
import * as Controller from '../../../src/database/controller/import';
import { IImageModel } from '../../../src/database/model/image';
import { ITagModel } from '../../../src/database/model/tag';
import { InternalToolTagDeduplicate } from '../../../src/toolbox/import';
import { IMarkusTool } from '../../../src/toolbox/interface';

export const testTagDeduplicateInternalTool = (): void => {
    describe('tag deduplicate internal tool', (): void => {
        let testDupTag: ITagModel;
        let testTag: ITagModel;

        let testImage: IImageModel;
        let testDupImage: IImageModel;

        before(function (this: Mocha.Context, next: () => void) {
            this.timeout(4000);
            let count: number = 0;
            Controller.Tag.createTag({
                name: 'test-tag-deduplicate-internal-tool',
            }).then((tag: ITagModel) => {
                testTag = tag;
                if (++count === 2) {
                    next();
                }
            });

            Controller.Tag.createTag({
                name: 'test-tag-deduplicate-internal-tool',
            }).then((tag: ITagModel) => {
                testDupTag = tag;
                if (++count === 2) {
                    next();
                }
            });
        });

        before(function (this: Mocha.Context, next: () => void) {
            this.timeout(4000);
            let count: number = 0;
            Controller.Image.createImage({
                tags: [testTag._id],
                file: new ObjectID(),
            }).then((image: IImageModel) => {
                testImage = image;
                if (++count === 2) {
                    next();
                }
            });

            Controller.Image.createImage({
                tags: [testDupTag._id],
                file: new ObjectID(),
            }).then((image: IImageModel) => {
                testDupImage = image;
                if (++count === 2) {
                    next();
                }
            });
        });

        it('estimate tool should give a time', async (): Promise<void> => {
            const tool: IMarkusTool = new InternalToolTagDeduplicate();
            const verify: boolean = tool.verify({});
            // tslint:disable-next-line
            expect(verify).to.be.true;

            const estimate: number = await tool.estimate({});
            expect(estimate).to.be.gte(1);
            return;
        }).timeout(3200);

        it('test available', async (): Promise<void> => {
            const tool: IMarkusTool = new InternalToolTagDeduplicate();
            const result: boolean = tool.available();
            // tslint:disable-next-line
            expect(result).to.be.true;
            return;
        }).timeout(3200);

        it('execute tool should remove duplicated tag', async (): Promise<void> => {
            const tool: IMarkusTool = new InternalToolTagDeduplicate();
            const verify: boolean = tool.verify({});
            // tslint:disable-next-line
            expect(verify).to.be.true;

            await tool.execute({});

            const newImage = await Controller.Image.getImageById(testImage._id);
            const new2Image = await Controller.Image.getImageById(testDupImage._id);
            expect(newImage.tags).to.be.deep.equal(new2Image.tags);
            return;
        }).timeout(3200);
    });
};
