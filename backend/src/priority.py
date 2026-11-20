"""Rule-based priority detection used by the Step Functions workflow.

Mirrored in frontend/src/api/priority.js so mock mode behaves like production.
"""
import re

LEVELS = ["Low", "Medium", "High", "Critical"]

CATEGORY_BASE = {
    "Classroom Equipment": 1,
    "Wi-Fi / Network": 0,
    "Water Supply": 1,
    "Electrical": 1,
    "Laboratory": 1,
    "Cleanliness & Maintenance": 0,
}

CRITICAL = re.compile(
    r"\b(fire|smoke|spark\w*|short[- ]?circuit\w*|shock\w*|gas leak|burning|burnt|"
    r"flood\w*|exposed wires?|sewage|collapse\w*|injur\w+)\b"
)
HIGH = re.compile(
    r"\b(leak\w*|no water|no power|power (cut|cuts|outage)|blackout|broken glass|"
    r"unsafe|hazard\w*|mosquito\w*|pests?|rats?)\b"
)
URGENT_CONTEXT = re.compile(
    r"\b(exam\w*|whole (building|block|hostel|campus)|entire (building|block|hostel|campus)|"
    r"all students|many students|urgent\w*|emergency)\b"
)
LOW = re.compile(r"\b(slow|minor|cosmetic|paint|small|slightly|suggestion|when possible)\b")


def detect_priority(title: str, description: str, category: str) -> str:
    text = f"{title} {description}".lower()
    level = CATEGORY_BASE.get(category, 1)

    if CRITICAL.search(text):
        return "Critical"
    if HIGH.search(text):
        level = max(level, 2)
    if URGENT_CONTEXT.search(text):
        level = min(level + 1, 3)
    elif LOW.search(text) and level < 2:
        level = max(level - 1, 0)
    return LEVELS[level]
