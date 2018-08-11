/**
 * @author WMXPY
 * @description Toolbox
 * @fileoverview Tag Deduplicate
 */

import { IMarkusResult, IMarkusTool, MarkusController, MarkusDirect, MarkusRequireType } from "../toolbox";

export default class InternalToolTagDeduplicate implements IMarkusTool {
    public name: string = "Internal-Tag-Duplicate-Remover";
    public description: string = "Remove duplicate tags";
    public require: MarkusRequireType[] = [];

    private _controller: MarkusController;
    private _direct: MarkusDirect;

    public controller(controller: MarkusController): void {
        this._controller = controller;
    }

    public direct(direct: MarkusDirect): void {
        this._direct = direct;
    }

    public verify(): boolean {
        return true;
    }

    public async execute(): Promise<IMarkusResult[]> {
        await this._controller.Tag.rummageTag('test');
        return [];
    }
}
