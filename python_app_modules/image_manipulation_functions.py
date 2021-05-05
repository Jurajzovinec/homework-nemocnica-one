import cv2
import numpy
import pytesseract
import os
import numpy
from io import BytesIO
from dotenv import load_dotenv
from PIL import Image
from pythreshold.utils import *
from .utils import *


def process_file_stream_to_image(file_stream):

    image_processed_to_bytes = numpy.asarray(

        bytearray(file_stream.read()), dtype=numpy.uint8)

    return cv2.imdecode(image_processed_to_bytes, cv2.IMREAD_COLOR)


def process_image_to_file_stream(image):

    file_name = f'{name_generator()}'

    read_arrayed_img = Image.fromarray(image)

    file_stream = BytesIO()
    
    read_arrayed_img.save(file_stream, "JPEG")

    return {'file_name': file_name,  'file_stream': file_stream}


def preprocess_image_with_otsu_algorithm(image):

    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    otsu_algorithm_treshold = otsu_threshold(gray_image)

    return apply_threshold(gray_image, otsu_algorithm_treshold)


def read_text_from_image(image, config):

    load_dotenv()

    # Development
    pytesseract.pytesseract.tesseract_cmd = os.getenv('PATH_TO_TESSERACT_EXE')

    # Production
    # pytesseract.pytesseract.tesseract_cmd = '/app/.apt/usr/bin/tesseract'

    read_text = pytesseract.image_to_string(image, config=config)

    sanitized_text = remove_non_alphanumeric_chars(read_text)

    return sanitized_text
