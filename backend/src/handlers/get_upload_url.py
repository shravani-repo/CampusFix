import os
import re
import uuid

from common import ApiError, api, caller, parse_body, respond, s3

MAX_BYTES = 5 * 1024 * 1024
TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}


@api
def handler(event, context):
    """Return a presigned S3 POST so the browser uploads straight to S3.

    This avoids API Gateway's payload limit and keeps Lambda costs near zero.
    """
    user = caller(event)
    content_type = parse_body(event).get("contentType")
    if content_type not in TYPES:
        raise ApiError(400, "Only JPEG, PNG or WebP images are allowed")

    owner = re.sub(r"[^\w\-]", "_", user["student_id"])[:40]
    key = f"uploads/{owner}/{uuid.uuid4().hex}.{TYPES[content_type]}"

    post = s3().generate_presigned_post(
        Bucket=os.environ["BUCKET_NAME"],
        Key=key,
        Fields={"Content-Type": content_type},
        Conditions=[{"Content-Type": content_type}, ["content-length-range", 1, MAX_BYTES]],
        ExpiresIn=300,
    )
    return respond(200, {"url": post["url"], "fields": post["fields"], "imageKey": key})
