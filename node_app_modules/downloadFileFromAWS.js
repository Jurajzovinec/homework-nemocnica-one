const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

function downloadFilerequire(filename) {

    return new Promise(async (resolve, reject) => {

        let s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });

        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: filename
            };

            s3bucket.getObject(params, (err, data) => {

                if (err) {
                    reject(
                        {
                            status: "FAILED",
                            downloadedFilename: filename,
                            error: err
                        }
                    );
                }

                resolve(
                    {
                        status: "OK",
                        downloadedFilename: filename,
                        data: data
                    }
                );

            });
        });
    });
}

module.exports = downloadFilerequire;