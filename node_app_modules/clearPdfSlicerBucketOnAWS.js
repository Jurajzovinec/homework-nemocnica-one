const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

function clearPdfSlicerBucketOnAWS(filesOnBucket) {

    return new Promise(async (resolve, reject) => {

        if (filesOnBucket.length === 0) {
            resolve({
                status: `OK`
            });
        }

        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });

        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: { Objects: filesOnBucket }
            };

            s3bucket.deleteObjects(params, (err, data) => {

                if (err) {
                    reject(
                        {
                            status: `FAILED`,
                            error: err
                        }
                    );
                }

                resolve(
                    {
                        status: `OK`
                    }
                );

            });
        });
    });

}

module.exports = clearPdfSlicerBucketOnAWS