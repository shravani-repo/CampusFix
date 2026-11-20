import json
import os
import re
import time
import uuid

import boto3

from common import (ApiError, CATEGORIES, api, caller, logger, now_iso,
                    parse_body, respond, table)

IMAGE_KEY = re.compile(r"uploads/[\w\-./]{1,200}")


def validate(body: dict) -> dict:
    title = str(body.get("title", "")).strip()
    description = str(body.get("description", "")).strip()
    category = body.get("category")
    image_key = body.get("imageKey") or None

    errors = {}
    if not 3 <= len(title) <= 120:
        errors["title"] = "Title must be 3 to 120 characters"
    if not 10 <= len(description) <= 2000:
        errors["description"] = "Description must be 10 to 2000 characters"
    if category not in CATEGORIES:
        errors["category"] = "Choose a valid category"
    if image_key and (not IMAGE_KEY.fullmatch(image_key) or ".." in image_key):
        errors["imageKey"] = "Invalid image reference"
    if errors:
        raise ApiError(400, "Validation failed", errors)

    return {"title": title, "description": description,
            "category": category, "imageKey": image_key}


@api
def handler(event, context):
    user = caller(event)
    data = validate(parse_body(event))
    now = now_iso()

    item = {
        "complaintId": "CF-" + uuid.uuid4().hex[:6].upper(),
        "studentId": user["student_id"],
        **data,
        "priority": None,  # assigned by the Step Functions workflow
        "status": "Pending",
        "createdAt": now,
        "updatedAt": now,
        "history": [{"status": "Pending", "at": now, "note": "Complaint submitted"}],
    }
    table().put_item(Item=item, ConditionExpression="attribute_not_exists(complaintId)")

    # Kick off the processing workflow. A failure here must not lose the complaint.
    try:
        boto3.client("stepfunctions").start_execution(
            stateMachineArn=os.environ["STATE_MACHINE_ARN"],
            name=f"{item['complaintId']}-{int(time.time())}",
            input=json.dumps({"complaintId": item["complaintId"]}),
        )
    except Exception:
        logger.exception("Could not start workflow for %s", item["complaintId"])

    return respond(201, item)
