/**
 * @author WMXPY
 * @description Doc Util
 * @fileoverview Code
 */

import * as Fs from "fs";
import * as Path from 'path';

export const nodeMarkusFormData = (domain: string): string => {
    const data: string = readAndReplaceTemplateFromAssets('node-markus-form-data', {
        domain,
    });
    return data;
};

export const nodeMarkusURLUrlencoded = () => {
    return null;
};

export const fetchMarkusFormData = () => {
    return null;
};

export const fetchMarkusURLUrlencoded = () => {
    return null;
};

export const readAndReplaceTemplateFromAssets = (name: string, replaces: {
    [key: string]: string;
}) => {
    let content: string = Fs.readFileSync(Path.resolve('assets', 'code', name + '.template'), 'UTF8');
    for (let key of Object.keys(replaces)) {
        content = content.replace(new RegExp('\\${' + key + '}', 'g'), replaces[key]);
    }
    return content;
};