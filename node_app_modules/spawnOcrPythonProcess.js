const config = require('../config');
const { spawn } = require('child_process');

function spawnOcrPythonProcess(filename) {

    return new Promise(async (resolve, reject) => {

        let pythonAnswerMessage;
        let errorData;

        const pythonSliceMicroService = spawn(
            config.python_intepreter_path, [
            config.python_ocr_process,
            filename,
        ]
        );

        pythonSliceMicroService.stdout.setEncoding('utf8');
        pythonSliceMicroService.stdout.on('data', function (data) {
            JSON.parse(data);
            pythonAnswerMessage = JSON.parse(data);
        });

        pythonSliceMicroService.stderr.setEncoding('utf8');
        pythonSliceMicroService.stderr.on('data', function (data) {
            errorData += data;
        });

        pythonSliceMicroService.on('close', (code) => {

            if (code == "0") {
                resolve(pythonAnswerMessage);
            } else {
                reject({
                    'originalImageName': filename,
                    'serverAppError': errorData,
                });
            }
        });


    });

};

module.exports = spawnOcrPythonProcess;