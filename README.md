
# Optical character recognition homework
*************************************************
## APPLICATION URL https://ocr-recognition-homework.herokuapp.com/
Note this is prototype and has some issues:
Issues: 
* long boot time
* lack of operational memory may lead to 503 status code or fail of server
*************************************************

This ocr application uses Otsu algorithm in order to preprocess image file. Application uses AWS s3 storage as temporarly file storage system and allows user to get thresholded image with **DOWNLOAD IMAGE** button.

## Web app workflow

* User initiate app with **UPLOAD CAR SIGNS IMAGES**
* Uploaded images are sent to backend
* Backend REST API stores images are stored on AWS S3 storage system
* process **main.py** is spawned from node
* result of this process is sent to fronend, where is visualized as table row

## Python part

Spawned and top layer script is [main.py](https://github.com/Jurajzovinec/homework-nemocnica-one/blob/master/python_app_modules/image_manipulation_functions.py) which returns result of its process by printing in json object. For the purpose of this application have been coded three modules:

* [aws_functions.py](https://github.com/Jurajzovinec/homework-nemocnica-one/blob/master/python_app_modules/aws_functions.py) -> which consinsts of functions regarding communication with AWS S3 file storage cloud
* [image_manipulation_functions.py.py](https://github.com/Jurajzovinec/homework-nemocnica-one/blob/master/python_app_modules/image_manipulation_functions.py) -> which consists of functions regarding image processing
* [validate_car_sign.py](https://github.com/Jurajzovinec/homework-nemocnica-one/blob/master/python_app_modules/validate_car_sign.py) -> 'business logic' with no external dependecies, evaluates scanned text from image with real life czech evidential car sign patterns

For thresholding has been used **OTSU algorithm** which has been imported from pytreshold package

```python
otsu.py (pytreshold package)

def otsu_threshold(image=None, hist=None):
    """ Runs the Otsu threshold algorithm.

    Reference:
    Otsu, Nobuyuki. "A threshold selection method from gray-level
    histograms." IEEE transactions on systems, man, and cybernetics
    9.1 (1979): 62-66.

    @param image: The input image
    @type image: ndarray
    @param hist: The input image histogram
    @type hist: ndarray

    @return: The Otsu threshold
    @rtype int
    """
    if image is None and hist is None:
        raise ValueError('You must pass as a parameter either'
                         'the input image or its histogram')

    # Calculating histogram
    if not hist:
        hist = np.histogram(image, bins=range(256))[0].astype(np.float)

    cdf_backg = np.cumsum(np.arange(len(hist)) * hist)
    w_backg = np.cumsum(hist)  # The number of background pixels
    w_backg[w_backg == 0] = 1  # To avoid divisions by zero
    m_backg = cdf_backg / w_backg  # The means

    cdf_foreg = cdf_backg[-1] - cdf_backg
    w_foreg = w_backg[-1] - w_backg  # The number of foreground pixels
    w_foreg[w_foreg == 0] = 1  # To avoid divisions by zero
    m_foreg = cdf_foreg / w_foreg  # The means

    var_between_classes = w_backg * w_foreg * (m_backg - m_foreg) ** 2

    return np.argmax(var_between_classes)
```

## Setup application (windows)

prerequisites:
* Node +v14.16.1
* python +3.9.0
* npm +6.14.12
* tesseract

1. Init python environment with **Command Prompt**:

```text
python -m venv python_packages && python_packages\Scripts\activate && pip install -r requirements.txt
```

2. Select local environment with **Powershell**: 

```text
. python_packages\Scripts\activate
```

3. Set local path to tesseract.exe in [module](https://github.com/Jurajzovinec/homework-nemocnica-one/blob/master/python_app_modules/image_manipulation_functions.py):

```python
def read_text_from_image(image, config):

    load_dotenv()

    # Development
    pytesseract.pytesseract.tesseract_cmd = os.getenv('PATH_TO_TESSERACT_EXE')

    # Production (Heroku)
    # pytesseract.pytesseract.tesseract_cmd = '/app/.apt/usr/bin/tesseract'

    read_text = pytesseract.image_to_string(image, config=config)

    sanitized_text = remove_non_alphanumeric_chars(read_text)

    return sanitized_text
```

4. Install dependecies for Node (backend) with **Powershell**/**Command Prompt**:

```text
npm i
```

5. Install dependecies for React (frontend) **Command Prompt**:

```text
cd client && npm i
```

6. Start backend with **Powershell**/**Command Prompt**:

```text
npm run start
```

7. Start frontend with **Command Prompt**:

```text
cd client && npm run start
```

8. Create **.env** file with valid keys:

```text
AWS_ACCESS_KEY=yourAWSAccessKey
AWS_SECRET_KEY=youtAWSSecretKey
AWS_BUCKET_NAME=car-sing-parking-recognition-bucket
PATH_TO_TESSERACT_EXE='C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
```
