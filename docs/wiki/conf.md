# Markus - Configuration

## Template

```js
{
  "crossOrigin": "*",
  "host": "mongodb://localhost:27017",
  "database": "markus-test-2",
  "documentation": true,
  "imagePath": "image path",
  "tempPath": "image path",
  "imagePFolder": 5,
  "isDebug": true,
  "maxThread": 4,
  "uploadLimit": 25,
  "portNumber": 8080,
  "verbose": false,
  "authorization": [
    "test"
  ],
  "white404ImagePath": "assets/404image_white.png",
  "black404ImagePath": "assets/404image_black.png",
  "mode": "FILESYSTEM",
  "S3": {
    "bucket": "",
    "accessKeyId": "",
    "secretAccessKey": "",
    "getPath": ""
  }
}
```

## Keys

- crossOrigin: String
- host: "mongodb://localhost:27017",
- database: "markus-test-2",
- documentation: true,
- imagePath: "image path",
- tempPath: "image path",
- imagePFolder: 5,
- isDebug: true,
- maxThread: 4,
- uploadLimit: 25,
- portNumber: 8080,
- verbose: false,
- authorization: Array<String>
  - test"
- white404ImagePath: "assets/404image_white.png",
- black404ImagePath: "assets/404image_black.png",
- mode: "FILESYSTEM",
- S3: Object Shape
  - bucket: "",
  - accessKeyId: "",
  - secretAccessKey: "",
  - getPath: ""