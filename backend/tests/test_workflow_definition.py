import json
import os

PATH = os.path.join(os.path.dirname(__file__), "..", "statemachine", "complaint_workflow.asl.json")


def test_state_machine_is_wired_correctly():
    asl = json.load(open(PATH))
    states = asl["States"]
    assert asl["StartAt"] in states

    targets = []
    for s in states.values():
        if "Next" in s:
            targets.append(s["Next"])
        if "Default" in s:
            targets.append(s["Default"])
        targets += [c["Next"] for c in s.get("Choices", [])]
        targets += [c["Next"] for c in s.get("Catch", [])]
    assert all(t in states for t in targets)
