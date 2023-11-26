const { S3Client } = require('@aws-sdk/client-s3'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    Response = require('./config.response');


const upload = (dirName) => {

    const s3 = new S3Client(
        {
            credentials: {
                accessKeyId:     global.config.aws.s3.accessKeyId,
                secretAccessKey: global.config.aws.s3.secretAccessKey
            },
            region: global.config.aws.s3.region
        }
    );

    return multer({
        storage: multerS3({
            s3:           s3,
            bucket:       global.config.aws.s3.bucket,
            cacheControl: global.config.aws.s3.cacheControl,
            region:       global.config.aws.s3.region,
            contentType:  multerS3.AUTO_CONTENT_TYPE,
            acl:          'public-read',
            metadata:     function (req, file, cb) { cb(null, { fieldName: file.fieldname }); },
            key:          function (req, file, cb) {

                const newFileName = `${dirName}/${Date.now()}-${file.originalname}`;

                cb(null, newFileName);

            }

        })

    });

};


const uploadImageResponse = (req, res, next) => {

    try {

        req.files = req.files.map(item => {

            if (item.location) {

                return item.location;

            }

            return false;

        })
            .filter(item => {

                if (item) {

                    return item;

                }

            });

        return Response.sendResponse(res, {
            msg:  '3',
            data: {
                urls: req.files
            },
            lang: req.params.lang
        });

    } catch (err) {

        console.log(err);

        return next({ msg: 2 });

    }

};

module.exports = {
    upload,
    uploadImageResponse
};

