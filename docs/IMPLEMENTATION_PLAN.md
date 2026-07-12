# Implementation Plan

## 1. Strategy

Build one end-to-end content-creation golden path before adding integrations. The first milestone must prove that work a founder already performed can become polished content without requiring a separate writing and editing workflow.

The order is:

```text
fixture evidence
→ normalized record
→ structured learning and founder events
→ workspace/privacy filter
→ public-safe manifest
→ structured story plan
→ newsletter-style Founder Digest
→ Remotion Founder Reel
→ private cloud link
→ Gmail live input
→ optional Notion
```

Although Gmail is central to the story, the first pipeline milestone should use fixtures so video rendering and submission are never blocked by OAuth.

## 2. Definition of done

The project is done enough when:

```bash
founder demo default end-day --fixture
```

creates a newsletter-style Founder Digest and a faceless Founder Reel that can be opened locally.

GCS upload, Gmail live mode, Notion, and additional polish improve the submission but must not prevent this baseline.

## 3. Seven-hour build plan

### 11:00–11:25 — Repository and guardrails

Deliver:

- initialize public repository;
- add README, license, `.gitignore`, `.env.example`;
- add planning docs;
- establish TypeScript project;
- create first commit;
- verify no secrets are present.

Suggested commit:

```text
chore: initialize fresh hackathon repository
```

### 11:25–12:10 — CLI and domain model

Deliver:

- parse `user`, `workspace`, and `command`;
- implement local configuration;
- implement fixture loader;
- implement manual `capture`;
- write normalized event records.

Exit test:

```bash
founder erick hackathon capture "Started the build"
founder demo default timeline --fixture
```

Suggested commits:

```text
feat: add workspace-aware founder CLI
feat: add fixture and manual capture adapters
```

### 12:10–13:00 — Gmail candidate retrieval and curation

Deliver:

- desktop OAuth setup;
- read-only Gmail scope;
- bounded Gmail query;
- numbered inbox output;
- selection persistence;
- clean body extraction for selected messages.

Fallback:

- if OAuth takes more than 35 minutes, freeze live integration and continue with a sanitized exported fixture;
- document Gmail live mode as partially completed rather than blocking the project.

Suggested commit:

```text
feat: add read-only Gmail newsletter curation
```

### 13:00–13:45 — Structured learning extraction

Deliver:

- OpenAI Responses API adapter;
- strict structured output;
- compact learning model;
- batch selected newsletters;
- record token and cost metadata;
- save `learning-log.json`.

Exit test:

- ten fixture newsletters produce valid learning objects;
- no raw email body appears in public output.

Suggested commit:

```text
feat: extract structured learning from curated newsletters
```

### 13:45–14:20 — Privacy and story planning

Deliver:

- workspace visibility configuration;
- confidential workspace deny-by-default rule;
- public-safe sanitizer;
- story planner returning:
  - theme,
  - hook,
  - evidence,
  - founder lesson,
  - next action,
  - scene list.

Exit test:

- confidential fixture events do not appear in `public-manifest.json`.

Suggested commit:

```text
feat: add workspace privacy gate and story planner
```

### 14:20–14:50 — Founder Digest

Deliver:

- Markdown digest;
- styled HTML digest;
- private and public-safe versions;
- source traceability.

Suggested commit:

```text
feat: compile daily founder digest
```

### 14:50–16:10 — Remotion Founder Reel

Deliver:

- initialize Remotion;
- five to seven reusable scenes;
- accept `story-plan.json` as props;
- narration adapter;
- timed captions;
- 1080×1920 composition;
- render MP4.

Visual priority:

1. typography;
2. consistent spacing;
3. smooth but simple transitions;
4. clear mockups;
5. audio and caption timing.

Do not spend time on generative video.

Suggested commits:

```text
feat: add data-driven Remotion founder reel
feat: add narration and captions
```

### 16:10–16:35 — GCS delivery

Deliver:

- private upload;
- object naming by user/date/run;
- signed URL;
- local-only fallback;
- clear terminal result.

Suggested commit:

```text
feat: upload private video drafts to GCS
```

### 16:35–17:05 — Hermes skill

Deliver:

- `SKILL.md`;
- map founder requests to the core CLI;
- fixture-mode demo command;
- verification procedure;
- no change to Hermes core.

Suggested commit:

```text
feat: expose workflow as Hermes skill
```

### 17:05–17:30 — Generate the submission video with the product

Use the actual day:

- watched an Argentina match;
- read and curated newsletters;
- got coffee;
- planned the hackathon;
- built the agent;
- generated the video being watched.

Generate:

- final digest;
- 45–60 second submission reel;
- backup local MP4;
- cloud review link.

Suggested commit:

```text
docs: add self-generated hackathon demo artifacts
```

### 17:30–17:50 — Proof and documentation

Deliver:

- clean README;
- architecture diagram;
- demo command;
- screenshots or GIF;
- credits and licenses;
- privacy explanation;
- known limitations;
- commit-history review;
- backup recording.

### 17:50–18:00 — Submit

Do not use these final ten minutes for feature development.

## 4. Compressed plan when behind schedule

### Cut line A — Must survive

- fixture input;
- manual capture;
- structured story plan;
- Founder Digest;
- Remotion MP4;
- local output.

### Cut line B — Strong submission

Add:

- OpenAI structured learning extraction;
- public-safe manifest;
- GCS upload;
- self-generated submission video.

### Cut line C — Nice integrations

Add only if stable:

- live Gmail OAuth;
- Hermes skill;
- Notion sync;
- Git import.

If time is constrained, a reliable fixture-mode Gmail-shaped adapter plus a working Hermes skill can communicate the intended integration better than an unstable OAuth demo.

## 5. Testing plan

### Unit tests

Test pure functions:

- event normalization;
- workspace selection;
- visibility filtering;
- public-safe manifest construction;
- scene duration totals;
- output-path construction.

### Contract tests

Validate:

- LLM output against schema;
- fixture adapter and Gmail adapter produce the same normalized type;
- story plan is accepted by Remotion props;
- `public-manifest.json` contains no forbidden fixture values.

### End-to-end smoke test

```bash
founder demo default end-day --fixture --storage local
```

Assert:

- exit status is zero;
- expected files exist;
- MP4 duration is between 40 and 65 seconds;
- digest is non-empty;
- no raw confidential markers appear.

## 6. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Gmail OAuth setup consumes too much time | High | Fixture-first; hard 35-minute cut line |
| Remotion render fails on venue machine | High | Test early; save a known-good local render |
| TTS model/API issue | Medium | System-voice or narration-free fallback |
| LLM output is invalid | High | Structured schema, validation, one repair attempt |
| Story feels generic | Medium | Require evidence IDs and one central thesis |
| GCS signing credentials fail | Medium | Keep local MP4 and upload manually if necessary |
| Private data enters repository | Critical | Sanitized fixtures, secret scan, final grep |
| Hermes syntax is more complex than expected | Medium | Skill invokes core CLI; demo core CLI if needed |
| Submission is late | Critical | Feature freeze by 17:30 and submit early |

## 7. Commit discipline

Commit after every working vertical slice.

Good history:

```text
chore: initialize fresh hackathon repository
feat: add workspace-aware founder CLI
feat: add fixture and manual capture adapters
feat: add read-only Gmail newsletter curation
feat: extract structured learning
feat: add privacy gate and story planner
feat: compile founder digest
feat: render data-driven founder reel
feat: upload private drafts to GCS
feat: expose workflow as Hermes skill
docs: finalize demo and credits
```

Avoid:

- one giant final commit;
- committing generated dependencies;
- rewriting history close to submission;
- committing credentials and then deleting them;
- importing code from a previous private project.

## 8. Scope rule

When choosing between another integration and better output quality:

> Improve the one-minute generated video unless the missing integration is necessary to prove the core workflow.
