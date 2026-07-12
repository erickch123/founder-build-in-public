# Data Model

## 1. Design goal

Every connector should emit the same normalized evidence model. The system should preserve traceability from source to digest sentence and video scene.

## 2. User

| Field | Description |
|---|---|
| `id` | Stable lowercase identifier, such as `erick` |
| `first_name` | Display name |
| `timezone` | IANA timezone, such as `Asia/Singapore` |
| `default_workspace` | Usually `default` |

## 3. Workspace

| Field | Description |
|---|---|
| `id` | `cadt`, `mcp`, `photography`, and so on |
| `name` | Display name |
| `type` | employment, venture, side-project, creative, learning, personal |
| `visibility` | confidential, private, public-review |
| `aggregate_into_default` | Whether it may inform the overall day |
| `allow_public_output` | Explicit public-output permission |
| `source_filters` | Gmail labels, repo paths, Notion pages |
| `tone` | Optional content tone |

Recommended defaults:

```text
confidential    → no public output
private         → private digest only
public-review   → may enter public manifest after filtering
```

## 4. Source item

A source item represents a retrieved object before interpretation.

Suggested fields:

```json
{
  "id": "src_001",
  "source_type": "gmail",
  "source_ref": "opaque-local-reference",
  "received_at": "2026-07-12T09:30:00+08:00",
  "title": "Newsletter subject",
  "sender_display": "Newsletter name",
  "clean_text_path": "private/local/path",
  "selected": true,
  "workspace_hint": "learning",
  "visibility": "private"
}
```

Do not store live Gmail message IDs in public fixtures.

## 5. Founder event

```json
{
  "id": "evt_001",
  "user_id": "erick",
  "workspace_id": "hackathon",
  "occurred_at": "2026-07-12T14:00:00+08:00",
  "event_type": "build_progress",
  "summary": "Implemented curated newsletter extraction",
  "source_ids": ["src_001"],
  "visibility": "public-review",
  "confidence": 1.0,
  "tags": ["gmail", "agent", "hackathon"]
}
```

## 6. Learning item

```json
{
  "id": "learn_001",
  "source_ids": ["src_001"],
  "topic": "agent memory",
  "key_points": [
    "Durable memory should be separated from active context"
  ],
  "what_i_learned": "Useful knowledge needs explicit retention rules.",
  "why_it_matters": "The founder agent needs workspace-specific memory.",
  "next_actions": [
    {
      "text": "Prototype a workspace memory schema",
      "time_horizon": "next-week",
      "schedule_candidate": true
    }
  ],
  "public_safe": true
}
```

## 7. Public manifest

This is the only founder-data input allowed into public digest and video compilation.

```json
{
  "date": "2026-07-12",
  "user_display": "Erick",
  "theme_candidates": [
    "From consuming information to building with it"
  ],
  "events": [
    {
      "id": "evt_public_001",
      "workspace_label": "Hackathon",
      "summary": "Built a workflow that turns curated learning into media",
      "source_event_ids": ["evt_001"]
    }
  ],
  "learnings": [
    {
      "id": "learn_public_001",
      "summary": "Building in public should be generated from existing work",
      "source_learning_ids": ["learn_001"]
    }
  ],
  "forbidden_topics": [
    "confidential employer implementation details"
  ]
}
```

## 8. Story plan

```json
{
  "title": "From Reading to Building",
  "theme": "Turning information consumption into founder execution",
  "hook": "Today started with football, newsletters and coffee—and ended with this video.",
  "founder_lesson": "Building in public should be an output of building.",
  "next_step": "Connect the workflow to a repeatable daily habit.",
  "target_duration_seconds": 55,
  "voiceover": "A concise narration grounded in evidence.",
  "scenes": [
    {
      "id": "scene_01",
      "type": "hook",
      "duration_seconds": 6,
      "headline": "Football. Newsletters. Coffee. Then a hackathon.",
      "evidence_ids": ["evt_public_001"]
    }
  ]
}
```

## 9. Run manifest

The run manifest is proof and debugging metadata.

Suggested contents:

- run ID;
- start and finish time;
- mode: live or fixture;
- user and workspace;
- source counts;
- selected email count;
- models and providers used;
- token usage;
- stages completed;
- artifacts generated;
- upload object URI;
- signed URL expiry;
- warnings and skipped integrations;
- application version and commit hash.

Never include secret values.

## 10. Fixture policy

Public fixtures should be:

- synthetic or rewritten;
- semantically representative;
- free of real email addresses;
- free of copyrighted full newsletter content;
- free of private repository names and customer data;
- clearly marked as fixtures.
