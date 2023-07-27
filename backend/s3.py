import logging
from minio import Minio
from urllib3.exceptions import ResponseError
from config import *
from datetime import timedelta

def create_presigned_url(object_name, bucket_name="rcts-audio-data-ncert", expiration=timedelta(seconds=1000)):
    """Generate a presigned URL to share an object in MinIO

    :param object_name: string
    :param bucket_name: string
    :param expiration: Time duration for the presigned URL to remain valid (as timedelta)
    :return: Presigned URL as string. If error, returns None.
    """

    # Initialize MinIO client
    minio_client = Minio(MINIO_ENDPOINT,
                         access_key=MINIO_ACCESS_KEY,
                         secret_key=MINIO_SECRET_KEY,
                         secure=False)

    try:
        # Generate a presigned URL for the object in MinIO
        response = minio_client.presigned_put_object(bucket_name,
                                                     object_name,
                                                     expires=expiration)
    except ResponseError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response
