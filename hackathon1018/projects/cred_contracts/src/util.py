# Utility functions for credential verification
import hashlib
import json
from typing import Dict, Any

def stable_stringify(obj: Any) -> str:
    """Create a stable JSON string representation of an object"""
    if isinstance(obj, dict):
        # Sort keys for consistent ordering
        sorted_items = sorted(obj.items())
        return "{" + ",".join(f'"{k}":{stable_stringify(v)}' for k, v in sorted_items) + "}"
    elif isinstance(obj, list):
        return "[" + ",".join(stable_stringify(item) for item in obj) + "]"
    elif isinstance(obj, str):
        return json.dumps(obj)
    else:
        return json.dumps(obj)

def hash_credential(credential: Dict[str, Any]) -> str:
    """Hash a credential using SHA-256"""
    cred_str = stable_stringify(credential)
    return hashlib.sha256(cred_str.encode()).hexdigest()
