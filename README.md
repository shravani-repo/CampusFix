# CampusFix: Report. Track. Resolve.

Serverless campus issue reporting and resolution system.
Students report problems with photos; the system prioritises them automatically; admins manage and analyse them.

```
campusfix/
├── frontend/   React + Vite + Tailwind v4 + Recharts (9 pages)
├── backend/    AWS SAM: Lambda (Python), API Gateway, DynamoDB, S3, Step Functions
└── docs/       Architecture and API reference
```

## 1. Try it now (no AWS needed)

```bash
cd frontend
npm install
cp .env.example .env     # VITE_USE_MOCK=true
npm run dev              # http://localhost:5173
```

Sign in with any email. Choose **Student** for the student side, **Admin** for the admin side.
Mock mode includes 16 sample complaints, and new submissions are "triaged" after ~2.5 s to mimic the Step Functions workflow.

## 2. Deploy the backend

Prerequisites: an AWS account, [AWS CLI](https://aws.amazon.com/cli/) (`aws configure`), and [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html). Python 3.12.

```bash
cd backend
pip install -r requirements-dev.txt && python -m pytest    # optional: run tests
sam build
sam deploy --guided --parameter-overrides AdminEmail=you@college.edu
```

- `AdminEmail` is optional. If set, confirm the SNS subscription email so you receive Critical alerts.
- When it finishes, copy the **ApiUrl** output.

## 3. Connect the frontend

```bash
cd frontend
# .env
VITE_USE_MOCK=false
VITE_API_URL=<ApiUrl from sam deploy, no trailing slash>
npm run dev
```

## 4. Host the frontend

**Option A: AWS Amplify (easiest).** Push the repo to GitHub, create an Amplify app, connect the repo (it picks up `frontend/amplify.yml`). Add a rewrite rule: source `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>`, target `/index.html`, type `200 (Rewrite)`.

**Option B: S3 static website.**
```bash
cd frontend && npm run build
aws s3 mb s3://YOUR-UNIQUE-SITE-BUCKET
aws s3 sync dist s3://YOUR-UNIQUE-SITE-BUCKET
```
Enable static website hosting with `index.html` as both the index and error document (the error document makes React Router deep links work), and allow public read, or front it with CloudFront.

After hosting, redeploy the backend with your site URL so CORS is locked down:
```bash
sam deploy --parameter-overrides AllowedOrigin=https://your-site-url AdminEmail=you@college.edu
```

## How the workflow runs

1. Student submits the form. The browser asks `/upload-url` for a presigned S3 POST and uploads the photo **directly to S3**.
2. `POST /complaints` → Lambda validates and writes the item to DynamoDB (status `Pending`, priority empty).
3. The same Lambda starts the **Step Functions** execution.
4. `DetectPriority` Lambda applies keyword rules → `ApplyTriage` Lambda saves the priority.
   Critical issues go straight to `Processing` and **SNS emails the admins**; others wait as `Pending`.
5. Admins change status in Complaint Management. Students watch the timeline on Complaint Details.

## Important: production hardening

This build identifies users with `x-student-id` / `x-user-role` headers so it works without extra services. **That is not secure**, since anyone can send an admin header. Before real use, add Amazon Cognito and a JWT authorizer on the HTTP API, then read the role from the token claims in `backend/src/common.py` (`caller()`).

## Cost

Everything is pay-per-use. A typical campus's volume stays within or close to the AWS free tier.
To remove all resources: `sam delete` (empty the uploads bucket first).
