"""Step Functions task 2: store the priority and set the first status.

Critical complaints go straight to Processing; everything else waits as
Pending for an admin to pick up.
"""
from common import now_iso, table


def handler(event, context):
    priority = event["priority"]
    status = "Processing" if priority == "Critical" else "Pending"
    now = now_iso()
    note = f"Priority set to {priority}" + (" and escalated automatically" if status == "Processing" else "")

    table().update_item(
        Key={"complaintId": event["complaintId"]},
        UpdateExpression=(
            "SET priority = :p, #s = :s, updatedAt = :u, "
            "history = list_append(if_not_exists(history, :empty), :h)"
        ),
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={
            ":p": priority, ":s": status, ":u": now, ":empty": [],
            ":h": [{"status": status, "at": now, "note": note}],
        },
    )
    return {"complaintId": event["complaintId"], "title": event["title"],
            "priority": priority, "status": status}
