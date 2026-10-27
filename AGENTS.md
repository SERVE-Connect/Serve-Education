# Agent Instructions

## Project Index
This project uses a `project-map.json` file to help you navigate the codebase efficiently.

### How to use the Project Map:
1.  **Check the map first:** Before calling `view_file` on multiple files to find a component or logic, read `project-map.json`.
2.  **Identify relevant files:** Use the `exports`, `imports`, and `purpose` fields to narrow down which files are relevant to the user's request.
3.  **Update the map:** If you add new files or significantly change exports/imports, run the indexer script to keep the map up to date:
    ```bash
    npx tsx scripts/indexer.ts
    ```

### Efficiency Goals:
- Minimize `view_file` calls by using the map to jump directly to the correct file.
- Understand the "blast radius" of changes by checking the `imports` field in the map (e.g., "If I change `types.ts`, which files import it?").
