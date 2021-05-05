const express = require('express');
const cors = require('cors');
const upload = require('express-fileupload');

const spawnOcrPythonProcess = require('./node_app_modules/spawnOcrPythonProcess');
const listPdfSlicerBucketOnAWS = require('./node_app_modules/listPdfSlicerBucketOnAWS');
const clearPdfSlicerBucketOnAWS = require('./node_app_modules/clearPdfSlicerBucketOnAWS');
const uploadFileToAWS = require('./node_app_modules/uploadFileToAWS');
const downloadFileFromAWS = require('./node_app_modules/downloadFileFromAWS');

const app = express();
const port = (process.env.NODE_ENV === 'production') ? process.env.PORT : 5050;

app.use(upload());
app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
    app.use(cors({ origin: "*" }));
}

app.get('/readtextfromimages', async (req, res) => {

    console.log('/readtextfromimages API invoked');

    res.setHeader('Content-Type', 'application/json');

    let responseObject = {};

    const listed_bucket = await listPdfSlicerBucketOnAWS()
        .catch(rejectedMessage => {
            console.error(rejectedMessage);
            res.status(500);
            responseObject = rejectedMessage;
        });

    console.log(listed_bucket.filesOnBucket.length);

    if (listed_bucket.filesOnBucket.length > 15) {

        res.status(202);
        responseObject = { message: "Please clear AWS bucket at first. Number of files exceeds 15." };

    } else if (listed_bucket.filesOnBucket.length == 0) {

        res.status(202);
        responseObject = { message: "S3 bucket is empty, load some files at first." };

    } else {

        try {

            let spawnDataOutput = [];

            await Promise.all(listed_bucket.filesOnBucket.map(async (singleFileObject) => {
                spawnDataOutput.push(await spawnOcrPythonProcess(singleFileObject.Key));
            }));

            res.status(200);
            responseObject = { results: spawnDataOutput };


        } catch (error) {
            console.log(error);
            res.status(500);
            responseObject.spawnError = error;

        }
    }

    res.end(JSON.stringify(responseObject));

});

app.get('/clearawsbucket', (req, res) => {

    console.log('/clearawsbucket API invoked');

    res.setHeader('Content-Type', 'application/json');

    listPdfSlicerBucketOnAWS()
        .then(outputMessage => clearPdfSlicerBucketOnAWS(outputMessage.filesOnBucket))
        .then(resolvedData => {

            res.status(200);
            res.end(JSON.stringify(resolvedData));

        })
        .catch(rejectedMessage => {

            res.status(202);
            res.end(JSON.stringify(rejectedMessage));

        });
});

app.get('/filedownload/:filetodownload', (req, res) => {

    console.log('/filedownload API invoked');

    res.setHeader('Content-Type', 'application/json');

    console.log(JSON.parse(req.params.filetodownload)['requestedFileName']);

    if (JSON.parse(req.params.filetodownload)['requestedFileName']) {
        downloadFileFromAWS(JSON.parse(req.params.filetodownload)['requestedFileName'])
            .then(resolvedResponse => {

                res.status(200);
                res.end(JSON.stringify(resolvedResponse));

            })
            .catch(rejectedMessage => {

                res.status(202);
                res.end(JSON.stringify(rejectedMessage));

            });
    } else {

        res.status(400);
        res.end(JSON.stringify({ error: 'Could not handle request. Check for missing parameter {requestedFilename: fileYouWant} in the URL.' }));

    }
});

app.post('/uploadmultiplefiles', async (req, res) => {

    console.log('/uploadmultiplefiles API invoked');

    res.setHeader('Content-Type', 'application/json');

    //console.log(typeof(req.files.carSigns));

    if (req.files == undefined) {

        res.status(404);
        res.end(JSON.stringify({ error: 'Could not handle request. No recognized data attached.' }));

    }

    else if (req.files.carSigns == undefined) {

        res.status(400);
        res.end(JSON.stringify({ error: "Could not handle request. Make sure formdata file key name is 'carSign'." }));

    }

    else if (typeof req.files.carSigns === 'object' && req.files.carSigns !== null && !Array.isArray(req.files.carSigns)) {

        uploadFileToAWS(req.files.carSigns)
            .then(resolvedObj => res.send(resolvedObj))
            .catch(rejectedObj => {
                res.end(JSON.stringify(rejectedObj));
            });

    } else if (req.files.carSigns.length > 15) {

        res.status(400);
        res.end(JSON.stringify({ error: "Please do not send that many files, maximum is 15." }));

    } else {

        let outputMessage = [];

        await Promise.all(req.files.carSigns.map(async (singleFileObject) => {

            return uploadFileToAWS(singleFileObject)
                .then(resolvedObj => {
                    outputMessage.push(resolvedObj);
                })
                .catch(rejectedObj => {
                    outputMessage.push(rejectedObj);
                });
        }));

        console.log(outputMessage);

        res.status(200);
        res.end(JSON.stringify({ processOutput: outputMessage }));

    }

});

app.post('/uploadsinglefile', (req, res) => {

    console.log('/uploadSingleFile API invoked');

    res.setHeader('Content-Type', 'application/json');

    if (req.files == undefined) {

        res.status(404);
        res.end(JSON.stringify({ error: 'Could not handle request. No recognized data attached.' }));

    }

    else if (req.files.carSign == undefined) {

        res.status(400);
        res.end(JSON.stringify({ error: "Could not handle request. Make sure formdata file key name is 'carSign'." }));

    } else {

        uploadFileToAWS(req.files.carSign)
            .then(resolvedObj => res.send(resolvedObj))
            .catch(rejectedObj => {

                res.status(200);
                res.end(JSON.stringyfy(rejectedObj));

            });
    }

});

// error catcher middleware
app.use(function (err, req, res, next) {
    res.status(500).send('Something broke!');
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(port, () => console.log(`Express server running on ${port}.`));