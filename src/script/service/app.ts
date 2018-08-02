/**
 * @author WMXPY
 * @fileoverview Express Application
 */

import * as bodyParser from "body-parser";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";
import Config, { middleware } from "../../markus";
import UploadManager from '../../util/manager/upload';
import * as Handler from './../handlers/import';

mongoose.connect(Config.host + '/' + Config.database);

const db: mongoose.Connection = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));

const app: express.Express = express();
app.use(bodyParser.json({
    limit: Config.uploadLimit + 'mb',
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: Config.uploadLimit + 'mb',
}));

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", Config.crossOrigin);
    res.header("X-Powered-By", 'Markus');
    res.header("X-Markus-Version", "2.0.0");
    next();
});

const prepares: middleware[] = Config.middleware.prepares;
const permissions: middleware[] = Config.middleware.permissions;

const uploadManager: UploadManager = new UploadManager();

// Handler(s) for Image Get
app.get(
    '/w/:id',
    ...prepares,
    Handler.G.imageGetBlankWhiteHandler,
);
app.get(
    '/b/:id',
    ...prepares,
    Handler.G.imageGetBlankBlackHandler,
);

// Handler(s) for Image Upload
app.post(
    '/m/buffer',
    ...prepares,
    uploadManager.generateMulterEngine('image'),
    uploadManager.generateBufferEngine(),
    ...permissions,
    Handler.M.UploadBufferHandler,
);
app.post(
    '/m/base64',
    ...prepares,
    uploadManager.generateBase64Engine(),
    ...permissions,
    Handler.M.UploadBase64Handler,
);

// Handler(s) for Avatar Get
app.get(
    '/a/:avatar',
    ...prepares,
    Handler.Avatar.avatarGetHandler,
);

// Handler(s) for Avatar Set
app.post(
    '/v/buffer',
    ...prepares,
    uploadManager.generateMulterEngine('image'),
    uploadManager.generateBufferEngine(),
    ...permissions,
    Handler.Avatar.avatarBufferHandler,
);
app.post(
    '/v/base64',
    ...prepares,
    uploadManager.generateBase64Engine(),
    ...permissions,
    Handler.Avatar.avatarBase64Handler,
);

// Handler(s) for Image List Get
app.post(
    '/tag',
    ...prepares,
    Handler.G.imageGetListByTagHandler,
);

// Handler(s) for Image status change
app.post(
    '/deactivate/id',
    ...prepares,
    ...permissions,
    Handler.M.DeactivateImageHandler,
);
app.post(
    '/deactivate/tag',
    ...prepares,
    ...permissions,
    Handler.M.DeactivateTagHandler,
);

// Handler(s) for debug
app.post(
    '/list',
    ...prepares,
    Handler.Debug.OutputImageIdList,
);
app.delete(
    '/empty',
    ...prepares,
    Handler.Debug.emptyDatabaseHandler,
);

// Handler(s) for 404
app.all(
    '*',
    ...prepares,
    Handler.G.fourOFourHandler,
);

export default app;