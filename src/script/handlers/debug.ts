/**
 * @author WMXPY
 * @fileoverview Debug Handler
 */

import { Request, Response } from "express";
import * as Controller from '../../database/controller/import';
import { IImageListResponse } from "../../database/interface/image";
import * as Direct from '../../direct/import';
import { error, ERROR_CODE, handlerError } from "../../util/error/error";
import { RESPONSE } from '../../util/interface';
import UniqueArray from '../../util/struct/uniqueArray';

/**
 * POST
 * remove all data in db, only use in debug
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const emptyDatabaseHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        if (global.Markus.Config.isDebug) {
            await Direct.Clean.emptyDatabase();
            res.status(200).send({
                status: RESPONSE.SUCCEED,
            });
        } else {
            throw error(ERROR_CODE.DEBUG_ONLY_FUNCTION_CALLED_IN_PRODUCTION);
        }
    } catch (err) {
        handlerError(res, err);
    }
    return;
};


/**
 * POST
 * get all image list, only use in debug
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const OutputImageIdList = async (req: Request, res: Response): Promise<void> => {
    try {
        if (global.Markus.Config.isDebug) {
            const images: IImageListResponse[] = await Controller.Image.getImageList();
            const tagIds: UniqueArray<string> = new UniqueArray<string>();

            for (let image of images) {
                tagIds.push(...image.tags);
            }

            const tagMap: Map<string, string> = await Direct.Tag.getTagStringsNamesMapByTagIdStrings(tagIds.list);

            for (let image of images) {
                for (let i: number = 0; i < image.tags.length; i++) {
                    const name: string | undefined = tagMap.get(image.tags[i]);
                    if (name) {
                        image.tags[i] = name;
                    } else {
                        throw error(ERROR_CODE.INTERNAL_ERROR);
                    }
                }
            }

            res.status(200).send({
                status: RESPONSE.SUCCEED,
                data: images,
            });
        } else {
            throw error(ERROR_CODE.DEBUG_ONLY_FUNCTION_CALLED_IN_PRODUCTION);
        }
    } catch (err) {
        handlerError(res, err);
    }
    return;
};
