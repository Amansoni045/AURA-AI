"""
Memory Profiler — Helper utility to inspect process RSS memory footprint.
"""

import os
import resource
import sys


def get_process_memory_mb() -> float:
    """
    Returns current process resident set size (RSS) memory footprint in Megabytes (MB).
    Works across macOS and Linux.
    """
    usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    if sys.platform == "darwin":
        return usage / (1024 * 1024)
    return usage / 1024


if __name__ == "__main__":
    ram = get_process_memory_mb()
    print(f"Current Process Memory: {ram:.2f} MB")
