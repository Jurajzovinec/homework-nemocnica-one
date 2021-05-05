const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

function listPdfSlicerBucketOnAWS() {

    return new Promise(async (resolve, reject) => {

        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });

        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
            };
            s3bucket.listObjects(params, (err, data) => {

                if (err) {

                    reject({
                        status: `FAILED`,
                        error: err,
                        listedBucket: process.env.AWS_BUCKET_NAME
                    });

                } else {

                    let outputListOfFiles = [];

                    data.Contents.map((fileDetails) => {
                        outputListOfFiles.push({ Key: fileDetails.Key });
                    });

                    resolve({
                        status: `OK`,
                        listedBucket: process.env.AWS_BUCKET_NAME,
                        filesOnBucket: outputListOfFiles
                    });

                }
            });
        });
    });

}

module.exports = listPdfSlicerBucketOnAWS;