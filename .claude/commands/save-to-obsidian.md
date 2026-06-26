# Save to Obsidian (Second Brain)

Capture something to my Obsidian vault.

Ask me for:
1. **Title** — short, clear (becomes the filename)
2. **Content** — the note body (I'll paste or describe it)
3. **Type** — Note / Idea / Goal / Book Note / Reference / Daily Log
4. **Tags** — comma-separated

Then check if the Obsidian vault is accessible via Google Drive MCP (`mcp__Google_Drive__search_files` — search for the vault folder name). If found, create the file there directly. If not found, output the fully-formatted markdown so the user can paste it manually.

Format:

```markdown
---
title: "Note Title"
date: YYYY-MM-DD
type: Note
tags: [tag1, tag2]
---

# Note Title

Content here...

## Related
- [[Related Note]]
```

Use `[[wikilinks]]` for cross-references where relevant. Confirm whether the file was written to Drive or output for manual paste.
