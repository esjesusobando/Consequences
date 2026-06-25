"""
OS Integration Module - Verifies required tools against OS capabilities.
"""

import os
import re
import subprocess
from typing import List, Dict

class OSIntegration:
    """Verifies and maps REQUIRED tools against current OS capabilities."""

    @staticmethod
    def verify_tools(required_tools: List[str]) -> Dict:
        """
        Verify required tools against OS capabilities.

        Args:
            required_tools: List of tool names to check

        Returns:
            Dictionary with available, missing, and version info
        """
        result = {"available": [], "missing": [], "versions": {}}

        for tool in required_tools:
            # Check if tool is available
            cmd = ["where" if os.name == "nt" else "which", tool]

            try:
                check_result = subprocess.run(
                    cmd, capture_output=True, text=True, timeout=5
                )

                if check_result.returncode == 0:
                    result["available"].append(tool)

                    # Get version if possible
                    version_cmd = [tool, "--version"]
                    try:
                        version_result = subprocess.run(
                            version_cmd, capture_output=True, text=True, timeout=5
                        )
                        if version_result.returncode == 0:
                            # Extract version number using regex
                            version_match = re.search(
                                r"(\d+\.\d+(?:\.\d+)?)", version_result.stdout
                            )
                            if version_match:
                                result["versions"][tool] = version_match.group(1)
                            else:
                                result["versions"][tool] = version_result.stdout.split(
                                    "\n"
                                )[0][:50].strip()
                    except (subprocess.SubprocessError, FileNotFoundError):
                        pass
                else:
                    result["missing"].append(tool)

            except (subprocess.SubprocessError, FileNotFoundError):
                result["missing"].append(tool)

        return result
