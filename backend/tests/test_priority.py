import pytest

from priority import detect_priority


@pytest.mark.parametrize("title,desc,category,expected", [
    ("Sparks from socket", "Smells of burning near bench 5", "Electrical", "Critical"),
    ("Gas leak smell", "Strong smell in the lab", "Laboratory", "Critical"),
    ("Water leak in hostel", "Pipe dripping in corridor", "Water Supply", "High"),
    ("No water in block A", "Nothing since morning", "Water Supply", "High"),
    ("Frequent power cuts", "Seminar hall loses power", "Electrical", "High"),
    ("Projector not working", "No signal from laptop", "Classroom Equipment", "Medium"),
    ("Wi-Fi down in library", "Floors 2 and 3", "Wi-Fi / Network", "Low"),
    ("Wi-Fi down", "Cannot connect during the exam", "Wi-Fi / Network", "Medium"),
    ("Wi-Fi very slow", "Slow in canteen", "Wi-Fi / Network", "Low"),
    ("Firewall blocks site", "Cannot open course page", "Wi-Fi / Network", "Low"),
    ("Washroom not cleaned", "Second floor", "Cleanliness & Maintenance", "Low"),
])
def test_detect_priority(title, desc, category, expected):
    assert detect_priority(title, desc, category) == expected
