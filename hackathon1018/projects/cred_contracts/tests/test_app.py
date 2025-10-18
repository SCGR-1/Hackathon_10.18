import pytest
from src.util import hash_credential, stable_stringify

def test_stable_stringify():
    """Test that stable_stringify produces consistent output"""
    cred1 = {
        "type": "EmploymentVerification",
        "credentialId": "emp-123",
        "issuer": "company-abc",
        "subject": "employee-xyz",
        "claim": {"position": "Software Engineer", "department": "Engineering"},
        "issuedAt": "2024-01-01T00:00:00Z",
        "expiresAt": "2025-01-01T00:00:00Z"
    }
    
    cred2 = {
        "expiresAt": "2025-01-01T00:00:00Z",
        "claim": {"department": "Engineering", "position": "Software Engineer"},
        "subject": "employee-xyz",
        "issuer": "company-abc",
        "credentialId": "emp-123",
        "type": "EmploymentVerification",
        "issuedAt": "2024-01-01T00:00:00Z"
    }
    
    # Same data, different key order should produce same hash
    hash1 = hash_credential(cred1)
    hash2 = hash_credential(cred2)
    
    assert hash1 == hash2
    assert len(hash1) == 64  # SHA-256 hex length

def test_hash_credential():
    """Test credential hashing"""
    cred = {
        "type": "VisaVerification",
        "credentialId": "visa-456",
        "issuer": "immigration-office",
        "subject": "applicant-789",
        "claim": {"visaType": "Work Visa", "country": "USA"},
        "issuedAt": "2024-01-01T00:00:00Z",
        "expiresAt": "2026-01-01T00:00:00Z"
    }
    
    hash_result = hash_credential(cred)
    assert isinstance(hash_result, str)
    assert len(hash_result) == 64
    assert all(c in '0123456789abcdef' for c in hash_result)
