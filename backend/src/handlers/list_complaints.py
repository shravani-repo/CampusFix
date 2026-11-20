from boto3.dynamodb.conditions import Key

from common import api, caller, respond, table


def _query_student(student_id: str) -> list:
    items, kwargs = [], dict(
        IndexName="student-index",
        KeyConditionExpression=Key("studentId").eq(student_id),
    )
    while True:
        page = table().query(**kwargs)
        items += page["Items"]
        if "LastEvaluatedKey" not in page:
            return items
        kwargs["ExclusiveStartKey"] = page["LastEvaluatedKey"]


def _scan_all() -> list:
    items, kwargs = [], {}
    while True:
        page = table().scan(**kwargs)
        items += page["Items"]
        if "LastEvaluatedKey" not in page:
            return items
        kwargs["ExclusiveStartKey"] = page["LastEvaluatedKey"]


@api
def handler(event, context):
    user = caller(event)
    qs = event.get("queryStringParameters") or {}

    if user["role"] == "admin":
        items = _query_student(qs["studentId"]) if qs.get("studentId") else _scan_all()
    else:  # students only ever see their own complaints
        items = _query_student(user["student_id"])

    if qs.get("status"):
        items = [i for i in items if i["status"] == qs["status"]]

    items.sort(key=lambda i: i["createdAt"], reverse=True)
    return respond(200, items)
