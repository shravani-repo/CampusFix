import functools
import json
import logging
import os
from datetime import datetime, timezone
from decimal import Decimal

import boto3
from botocore.config import Config

logger = logging.getLogger()
logger.setLevel(logging.INFO)

CATEGORIES = [
    "Classroom Equipment",
    "Wi-Fi / Network",
    "Water Supply",
    "Electrical",
    "Laboratory",
    "Cleanliness & Maintenance",
]
STATUSES = ["Pending", "Processing", "Resolved"]

_table = None


def table():
    global _table
    if _table is None:
        _table = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
    return _table


def s3():
    return boto3.client("s3", config=Config(signature_version="s3v4"))


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


class ApiError(Exception):
    def __init__(self, status: int, message: str, details=None):
        super().__init__(message)
        self.status, self.message, self.details = status, message, details


class _Encoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return int(o) if o % 1 == 0 else float(o)
        return super().default(o)


def respond(status: int, body) -> dict:
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body, cls=_Encoder),
    }


def parse_body(event) -> dict:
    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        raise ApiError(400, "Request body must be valid JSON")
    if not isinstance(body, dict):
        raise ApiError(400, "Request body must be a JSON object")
    return body


def caller(event) -> dict:
    """Identity comes from headers in this demo build.

    For production, swap for a Cognito JWT authorizer on API Gateway and read
    event["requestContext"]["authorizer"]["jwt"]["claims"] instead.
    """
    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    student_id = (headers.get("x-student-id") or "").strip()
    role = "admin" if headers.get("x-user-role") == "admin" else "student"
    if not student_id:
        raise ApiError(401, "Missing x-student-id header")
    return {"student_id": student_id, "role": role}


def require_admin(user: dict):
    if user["role"] != "admin":
        raise ApiError(403, "Admin access required")


def api(fn):
    """Turn exceptions into clean JSON error responses."""

    @functools.wraps(fn)
    def wrapper(event, context):
        try:
            return fn(event, context)
        except ApiError as e:
            body = {"error": e.message}
            if e.details:
                body["details"] = e.details
            return respond(e.status, body)
        except Exception:
            logger.exception("Unhandled error")
            return respond(500, {"error": "Internal server error"})

    return wrapper
