const config = require('../config');

export default async function readTextFromImagesOnAws(filenameOnAws) {

    console.log("...asking for read texts of images...");

    const urlToFetch = `${config.BACKEND_SERVER}readtextfromimages`;

    return new Promise((resolve, reject) => {
        fetch(urlToFetch, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(resolvedPromiseData => {
                console.log(resolvedPromiseData);
                if (resolvedPromiseData.length === 0) {
                    reject('AWS S3 bucket is empty');
                } else {
                    resolve(resolvedPromiseData.results);
                }
            }).catch(error => console.log(error));
    });

}

