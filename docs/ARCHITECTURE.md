# Architecture

```
 Browser (React) ──► API Gateway (HTTP API) ──► Lambda ──► DynamoDB
      │                                           │
      │  presigned POST                           └──► Step Functions
      ▼                                                   │
   Amazon S3  ◄── presigned GET (details page)            ├─ DetectPriority (Lambda)
                                                          ├─ ApplyTriage    (Lambda → DynamoDB)
                                                          └─ Critical? ─► SNS email to admins
```

| Service | Role |
|---|---|
| Lambda | 5 API handlers + 2 workflow tasks (Python 3.12) |
| API Gateway | HTTP API with CORS, routes to the handlers |
| DynamoDB | `ComplaintsTable` (PK `complaintId`), GSI `student-index` (`studentId`, `createdAt`) |
| S3 | Private bucket; direct browser upload via presigned POST (JPEG/PNG/WebP, max 5 MB) |
| Step Functions | Priority detection and triage, with retries, error handling and a Choice state |
| SNS | Emails admins about Critical complaints |

## API

All calls need headers `x-student-id` and `x-user-role` (`student` or `admin`).

| Method | Path | Who | Description |
|---|---|---|---|
| POST | `/upload-url` | any | Body `{contentType}` → `{url, fields, imageKey}` |
| POST | `/complaints` | any | Body `{title, description, category, imageKey?}` → 201 complaint |
| GET | `/complaints` | any | Students: own. Admins: all (optional `?studentId=`, `?status=`) |
| GET | `/complaints/{id}` | owner/admin | One complaint plus a presigned `imageUrl` |
| PATCH | `/complaints/{id}` | admin | Body `{status}`: `Pending`, `Processing` or `Resolved` |

Errors return `{error, details?}` with 400, 401, 403, 404 or 500.

## Data model

```json
{
  "complaintId": "CF-3FA9B2",
  "studentId": "student@college.edu",
  "title": "...", "description": "...", "category": "Water Supply",
  "imageKey": "uploads/<student>/<uuid>.jpg",
  "priority": "High",              // null until the workflow runs
  "status": "Pending",
  "createdAt": "ISO-8601", "updatedAt": "ISO-8601",
  "history": [{ "status": "Pending", "at": "ISO-8601", "note": "Complaint submitted" }]
}
```

## Priority rules (`backend/src/priority.py`)

1. Category sets a baseline (Wi-Fi and Cleanliness: Low; others: Medium).
2. Danger words (fire, spark, short circuit, gas leak, flood, exposed wires…) → **Critical**.
3. Issue words (leak, no water, power cut, mosquito…) → at least **High**.
4. Context words (exam, whole hostel, urgent…) raise one level; words like "slow" or "minor" lower one level for low-priority issues.

The same rules live in `frontend/src/api/priority.js` for demo mode. To upgrade later, swap the body of `detect_priority` for Amazon Comprehend or Bedrock without touching the workflow.
