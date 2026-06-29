"""
Video Registry Module - Handles saving and logging the analysis history to the OS.
"""

import os
from datetime import datetime
from pathlib import Path
import json

class VideoRegistry:
    """Handles persistent storage of video analysis summaries."""

    def __init__(self, registry_path: str):
        """
        Args:
            registry_path: Path to the central markdown registry file.
        """
        self.registry_path = Path(registry_path)

    def append_to_registry(self, video_metadata: dict, local_filepath: str) -> None:
        """
        Appends a new entry to the central registry markdown file.
        """
        date_str = datetime.now().strftime("%Y-%m-%d")
        title = video_metadata.get('title', 'Unknown Title')
        url = video_metadata.get('url', '#')
        channel = video_metadata.get('channel', 'Unknown Channel')
        
        entry = f"- **{date_str}**: [{title}]({url}) - By {channel} -> [Local File]({local_filepath})\n"

        # Ensure directory exists
        self.registry_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Append mode
        with open(self.registry_path, "a", encoding="utf-8") as f:
            f.write(entry)

    def write_analysis_file(self, content: str, title: str, output_dir: str) -> str:
        """
        Saves the specific video analysis markdown document.
        """
        date_str = datetime.now().strftime("%Y-%m-%d")
        safe_title = "".join([c if c.isalnum() else "_" for c in title])
        filename = f"Video_Analysis_{date_str}_{safe_title[:50]}.md"
        
        out_path = Path(output_dir) / filename
        out_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        return str(out_path)
