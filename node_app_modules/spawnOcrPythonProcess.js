const config = require('../config');
const { spawn } = require('child_process');

function spawnOcrPythonProcess(filename) {

    return new Promise(async (resolve, reject) => {

        let pythonAnswerMessage;

        const pythonSliceMicroService = spawn(
            config.python_intepreter_path, [
            config.python_ocr_process,
            filename,
        ]
        );

        pythonSliceMicroService.stdout.setEncoding('utf8');
        pythonSliceMicroService.stdout.on('data', function (data) {
            try {
                JSON.parse(data);
                pythonAnswerMessage = JSON.parse(data);
            } catch (e) {
                console.log(data);
            }
        });

        pythonSliceMicroService.on('close', (code) => {
            //console.log(code);
            console.log(pythonAnswerMessage);
            if (code == "0") {
                resolve(
                    pythonAnswerMessage
                );
            } else {
                reject(
                    pythonAnswerMessage
                );
            }
        });

    });

};

module.exports = spawnOcrPythonProcess;