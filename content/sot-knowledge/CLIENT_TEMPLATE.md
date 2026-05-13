# How to Create a Client-Specific Knowledge Package

When Jenks or Dr. Michael asks you to create a bespoke package for a client:

## Step 1: Create the directory
Create: sot-knowledge/<client-id>/

## Step 2: Create the 6 files
Copy from the core files and customize:

1. **SKILL.md** — Update the description to mention the client industry
2. **framework.md** — Add industry-specific examples for cvs2bvs, GBB, x10
3. **neuroscience.md** — Usually same as core (brain science is universal)
4. **curriculum.md** — Customize DFQ questions for the client industry
5. **thinking-tools.md** — Add industry-specific examples for each tool
6. **coaching-style.md** — Adapt QRH examples for the industry context

## Step 3: Notify Jenks
Tell Jenks: "Client package for <name> is ready at sot-knowledge/<client-id>/"
Jenks will run: python sot_client_manager.py update <client-id>

## Important
- Do NOT include personal information (names, IDs, phone numbers)
- Do NOT include internal SOT team communications
- DO include the client name and industry
- DO customize tool examples for their business context
- Keep the mandatory tool formats (10+10+10 for GBB, etc.)
