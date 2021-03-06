/**
 * @author WMXPY
 * @description Routes
 * @fileoverview Auth
 */

import { Request, RequestHandler, Response } from "express";
import { assert } from "../../../util/error/assert";
import { ERROR_CODE } from "../../../util/error/error";
import { markusVersion } from "../../../util/struct/agent";
import { resource, testDrive } from "../../decorator";
// tslint:disable-next-line
import { ExpressNextFunction, EXPRESS_ASSERTION_TYPES_END, IExpressAssertionJSONType, IExpressRoute, ROUTE_MODE } from '../../interface';
import LodgeableExpressRoute from "../lodgeable";

@resource('/routes/system', 'auth')
@testDrive()
export default class RouteAuth extends LodgeableExpressRoute implements IExpressRoute {
    public readonly name: string = 'MR@Internal-Route^Auth';
    public readonly path: string = '/auth';
    public readonly mode: ROUTE_MODE = ROUTE_MODE.GET;

    public readonly prepare: boolean = true;
    public readonly authorization: boolean = true;
    public readonly stack: RequestHandler[] = [
        this.handle,
    ];
    public readonly after: boolean = true;

    public readonly assertResponse: IExpressAssertionJSONType = {
        agent: { type: EXPRESS_ASSERTION_TYPES_END.STRING },
        version: { type: EXPRESS_ASSERTION_TYPES_END.STRING },
    };

    protected async handle(req: Request, res: Response, next: ExpressNextFunction): Promise<void> {
        try {
            assert(req.valid).to.be.true(ERROR_CODE.PERMISSION_VALID_FAILED);
            const version: string = await markusVersion();
            res.agent.add('agent', 'Markus');
            res.agent.add('version', version);
        } catch (err) {
            res.agent.failed(500, err);
        } finally {
            next();
        }
        return;
    }
}
