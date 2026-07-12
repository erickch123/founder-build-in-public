# Command Design

## 1. Canonical grammar

```text
founder <user> <workspace> <command> [options]
```

Meaning:

- `user` — owner of the memory and configuration;
- `workspace` — the hat or project context;
- `command` — the requested operation;
- `options` — date, mode, provider, visibility, and output controls.

## 2. Suggested commands

### Configuration

```bash
founder config init
founder config set-user erick
founder config add-workspace mcp --visibility public-review
founder config add-workspace cadt --visibility confidential
founder config status
```

### Newsletter workflow

```bash
founder erick learning inbox --date today
founder erick learning select --ids 1,3,4,7,10
founder erick learning digest
founder erick learning log
founder erick learning sync-notion
```

### Founder activity

```bash
founder erick hackathon capture "Implemented Gmail curation"
founder erick personal capture "Had coffee while reading"
founder erick mcp capture "Resolved OAuth callback issue"
```

### Workspace lifecycle

```bash
founder erick cadt close
founder erick mcp close
```

`close` means “I am done with this context for now.” It creates a workspace summary but does not generate the overall daily media.

### Overall day

```bash
founder erick default end-day
```

This aggregates all allowed contexts and generates the two final outputs.

### Weekly

```bash
founder erick default end-week
founder erick mcp digest --weekly
```

### Output-specific

```bash
founder erick default digest
founder erick default video
founder erick default outputs
```

### Demo

```bash
founder demo default end-day --fixture --storage local
founder demo default end-day --fixture --storage gcs
```

## 3. Useful options

```text
--date YYYY-MM-DD
--fixture
--live
--storage local|gcs
--visibility private|public-safe
--duration 60
--skip-gmail
--skip-notion
--skip-upload
--dry-run
--json
```

## 4. Defaults

A local config may define:

```text
default user: erick
default workspace: default
default storage: local
default visibility: private
```

Then shorter forms become possible:

```bash
founder end-day
founder learning inbox
```

Do not prioritize aliases until the explicit grammar works.

## 5. Hermes invocation

Officially aligned usage:

```bash
hermes -s founder-build-in-public -q \
  "Run end-day for user erick in workspace default using fixture mode"
```

Interactive skill usage:

```text
/founder-build-in-public end-day --user erick --workspace default --fixture
```

A later wrapper may offer:

```bash
hfounder erick default end-day
```

or the originally envisioned:

```bash
hermes founder erick default end-day
```

The latter should not be promised until a real plugin or wrapper implements it.

## 6. Terminal output principles

Good:

```text
Founder Build in Public — 12 Jul 2026

✓ Loaded 10 curated newsletters
✓ Extracted 18 key points
✓ Saved 6 founder learnings
✓ Excluded 2 confidential workspace events
✓ Selected story: From consumption to execution
✓ Generated Founder Digest
✓ Rendered 56-second vertical video
✓ Uploaded private draft

Digest  outputs/2026-07-12/founder-digest.html
Video   outputs/2026-07-12/founder-reel.mp4
Review  <signed URL; expires in 60 minutes>
```

Avoid printing:

- full email bodies;
- raw OAuth tokens;
- entire LLM payloads;
- verbose dependency logs;
- private object credentials.
