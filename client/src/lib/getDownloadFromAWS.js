const config = require('../config');

export default function getDownloadFileFromAWS(filenameOnAws) {

    console.log("...asking for file...");

    const urlToFetch = `${config.BACKEND_SERVER}filedownload/{"requestedFileName":"${filenameOnAws}"}`;

    fetch(urlToFetch, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(resolvedPromiseData => {
            
            const arrayBufferView = new Uint8Array(resolvedPromiseData.data.Body.data);
            const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
            const link = document.createElement("a");
            
            link.href = window.URL.createObjectURL(blob);
            link.download = resolvedPromiseData.downloadedFilename;
            link.click();

        });

}

