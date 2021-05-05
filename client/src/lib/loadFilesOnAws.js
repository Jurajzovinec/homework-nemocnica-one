const config = require('../config');

export default function loadFileOnAWS(eventTarget) {

    console.log("...loading Files On AWS S3 Storage...");

    let formData = new FormData();

    for (let i = 0; i < eventTarget.files.length; i++) {
        formData.append('carSigns', eventTarget.files[i]);
    }

    return new Promise(async (resolve, reject) => {
        const urlToFetch = `${config.BACKEND_SERVER}uploadmultiplefiles`;
        fetch(urlToFetch, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(response => resolve(response))
            .catch((error) => {
                reject(error);
            });
    });
}