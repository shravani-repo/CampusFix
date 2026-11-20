from botocore.exceptions import ClientError

from common import (ApiError, STATUSES, api, caller, now_iso, parse_body,
                    require_admin, respond, table)


@api
def handler(event, context):
    user = caller(event)
    require_admin(user)

    complaint_id = event["pathParameters"]["id"]
    body = parse_body(event)
    status = body.get("status")
    if status not in STATUSES:
        raise ApiError(400, f"Status must be one of: {', '.join(STATUSES)}")

    now = now_iso()
    entry = {"status": status, "at": now, "note": f"Marked as {status.lower()}"}
    try:
        result = table().update_item(
            Key={"complaintId": complaint_id},
            UpdateExpression=(
                "SET #s = :s, updatedAt = :u, "
                "history = list_append(if_not_exists(history, :empty), :h)"
            ),
            ConditionExpression="attribute_exists(complaintId)",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={":s": status, ":u": now, ":h": [entry], ":empty": []},
            ReturnValues="ALL_NEW",
        )
    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            raise ApiError(404, "Complaint not found")
        raise
    return respond(200, result["Attributes"])
