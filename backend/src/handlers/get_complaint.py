import os

from common import ApiError, api, caller, respond, s3, table


@api
def handler(event, context):
    user = caller(event)
    complaint_id = event["pathParameters"]["id"]

    item = table().get_item(Key={"complaintId": complaint_id}).get("Item")
    if not item:
        raise ApiError(404, "Complaint not found")
    if user["role"] != "admin" and item["studentId"] != user["student_id"]:
        raise ApiError(403, "You can only view your own complaints")

    if item.get("imageKey"):
        item["imageUrl"] = s3().generate_presigned_url(
            "get_object",
            Params={"Bucket": os.environ["BUCKET_NAME"], "Key": item["imageKey"]},
            ExpiresIn=3600,
        )
    return respond(200, item)
