const config = require('../config');

export default async function clearFilesBucketOnAWS() {

    console.log("...clearing AWS S3 file storage...");

    const urlToFetch = `${config.BACKEND_SERVER}clearawsbucket`;
    
    return new Promise((resolve, reject) => {
        fetch(urlToFetch)
            .then(response => response.json())
            .then(res => {
                resolve(JSON.stringify(res));
            })
            .catch((error) => {
                reject(error);
            });
    });

}