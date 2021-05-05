import os
import io
from boto3.session import Session
from dotenv import load_dotenv

def download_file_from_aws_s3(filename):

    load_dotenv()

    file_stream = io.BytesIO()

    session = Session(
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
        aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
    )

    s3 = session.resource('s3')

    ocr_bucket = s3.Bucket(os.getenv('AWS_BUCKET_NAME'))

    ocr_bucket.download_fileobj(filename, file_stream)

    file_stream.seek(0)

    return {"file_stream": file_stream, "filename": filename}


def upload_file_to_aws_s3(file_object):

    load_dotenv()

    file_stream = file_object['file_stream']

    file_name = file_object['file_name']

    session = Session(
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
        aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
    )

    s3 = session.resource('s3')

    ocr_bucket = s3.Bucket(os.getenv('AWS_BUCKET_NAME'))

    file_stream.seek(0)

    ocr_bucket.upload_fileobj(file_stream, file_name)

    return {"file_stream": file_stream, "filename": file_name}
