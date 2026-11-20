"""Step Functions task 1: read the complaint and work out its priority."""
from common import table
from priority import detect_priority


def handler(event, context):
    item = table().get_item(Key={"complaintId": event["complaintId"]}).get("Item")
    if not item:
        raise ValueError(f"Complaint {event['complaintId']} not found")
    return {
        "complaintId": item["complaintId"],
        "title": item["title"],
        "priority": detect_priority(item["title"], item["description"], item["category"]),
    }
