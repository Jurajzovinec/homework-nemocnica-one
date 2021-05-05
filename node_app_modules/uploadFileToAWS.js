const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

function uploadFileToAWS(file) {

    return new Promise(async (resolve, reject) => {

        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });


        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.name,
                Body: file.data
            };
            s3bucket.upload(params, (err, data) => {
                if (err) {

                    reject(
                        {
                            status: `FAILED`,
                            error: `${err}`,
                            uploadedFile: file.name
                        }
                    );
                }

                resolve(
                    {
                        status: 'OK',
                        uploadedFile: file.name
                    }
                );
            });
        });
    });

};

module.exports = uploadFileToAWS;