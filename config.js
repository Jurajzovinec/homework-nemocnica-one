const path = require('path');

const config = {
    python_intepreter_path: (process.env.NODE_ENV === 'production') ?
        'python' : (path.resolve(process.cwd(), 'python_packages/Scripts/python')),
    python_ocr_process: (path.resolve(process.cwd(), 'main.py')),
};

module.exports = config;