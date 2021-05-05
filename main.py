import json
import sys
from python_app_modules.aws_functions import *
from python_app_modules.validate_car_sign import *
from python_app_modules.image_manipulation_functions import *


if __name__ == '__main__':

    #file_name_on_aws_s3 = 'spz_4.jpg'
    file_name_on_aws_s3 = sys.argv[1]

    result_message = {
        'originalImageName': file_name_on_aws_s3,
        'thresholdImageName': '',
        'validationError': '',
        'childProcessError': '',
        'imageText': ''
    }

    try:

        # Config options for reading the text from image.
        read_image_to_string_config = '--psm 10 --oem 3  -c tessedit_char_whitelist=0123456789ABCDEFHIJKLMNPRSTVXYZ'
        
        # Get file obj from AWS S3 storage system.
        file_object = download_file_from_aws_s3(
            file_name_on_aws_s3)

        # Convert file obj to image.
        image = process_file_stream_to_image(
            file_object['file_stream'])

        # Apply Otsu algorithm on image in order to get recognizable text in image.
        apply_threshold = preprocess_image_with_otsu_algorithm(image)

        # Prepare thresholded image for upload process to AWS S3.
        image_to_file_object = process_image_to_file_stream(apply_threshold)

        # Log to output object.
        result_message['thresholdImageName'] = image_to_file_object['file_name']
        
        # Upload to AWS S3 storage system.
        upload_file_to_aws_s3(image_to_file_object)

        # Use tesseract neural network in order to retrieve text from image.
        image_text = read_text_from_image(
            apply_threshold, read_image_to_string_config
        )

        # Log to output object.
        result_message['imageText'] = image_text

        # Apply business logic on read text and check if found text can be car sign.
        validate_car_sign(image_text, file_object['filename'])
        
    except Car_sign_validation_error as error:

        # Catch car sign validation error and explain which test id did not pass.
        result_message['validationError'] = str(error)

    except:

        # Catch application error for development.
        result_message['childProcessError'] = str(sys.exc_info())

    finally:

        # Flush collected data to upper listener, which this child process is spawned from.
        print(json.dumps(result_message))
