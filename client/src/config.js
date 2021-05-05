const config = {
    BACKEND_SERVER: (process.env.NODE_ENV === 'production') ? "https://ocr-recognition-homework.herokuapp.com/":"http://localhost:5050/" 
}

module.exports = config;