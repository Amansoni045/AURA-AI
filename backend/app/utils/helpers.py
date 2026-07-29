"""
Utility helper functions for backend request processing.
"""

from typing import Dict, Any


def format_error_response(message: str, code: int = 500) -> Dict[str, Any]:
    """
    Standardized error payload formatter.
    """
    return {
        "error": message,
        "code": code,
    }
