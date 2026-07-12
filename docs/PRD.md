# Product Requirements Document

## 1. Product summary

**Founder Build in Public** is a local-first, workspace-aware agent for solo founders. It turns selected newsletter knowledge and founder activity into two review-ready outputs:

1. a daily or weekly **Founder Digest**; and
2. a 45–60 second **faceless vertical video** stored privately in cloud storage.

The founder remains the editor. The system retrieves and organizes information, but the founder chooses which emails matter and approves anything intended for public use.

## 2. Problem

Solo founders continuously:

- read newsletters and research;
- make decisions;
- build products;
- switch between jobs, ventures, and side projects;
- take scattered notes;
- know that building in public could grow trust and distribution.

The problem is that converting this activity into good content requires another workflow:

```text
remember → curate → summarize → find a story → write → narrate → edit → upload
```

This often means the content is never created, or it becomes shallow automated spam.

## 3. Product thesis

A founder should not have to create content from a blank page.

The agent should reconstruct a story from **founder-approved evidence**, preserve workspace and privacy boundaries, and compile that story into reusable media.

The product is not “AI video generation.” It is a:

> workspace-aware founder-story compiler.

## 4. Target user

### Primary persona

A technical solo founder or indie hacker who:

- works mainly from a terminal;
- reads useful newsletters in Gmail;
- manages several projects or identities;
- wants to build in public;
- does not want to record their face;
- prefers reviewing a draft over editing from scratch.

### Example user contexts

A single user may have:

- `default` — overall personal day;
- `cadt` — confidential full-time work;
- `coffee-carbon` — climate venture;
- `photography` — creative work;
- `mcp` — coding side project;
- `track-hub` — another side project;
- `hackathon` — the current build.

## 5. Product goals

### MVP goals

- Retrieve a bounded set of Gmail newsletters using read-only access.
- Let the founder curate up to ten useful emails.
- Extract key points, personal learning, relevance, and suggested actions.
- Save a structured local learning log.
- Accept manual founder activity captures.
- Separate activity by workspace and visibility.
- Generate a daily Founder Digest.
- Generate a coherent 45–60 second video script and scene plan.
- Render a polished 9:16 faceless video with Remotion.
- Upload the draft to a private Google Cloud Storage bucket.
- Return a time-limited signed review URL.
- Support fixture/demo mode with no private data.

### Stretch goals

- Sync the learning log to Notion.
- Read local Git activity.
- Generate a weekly digest.
- Add a better voice provider or multiple visual themes.
- Add a scheduled Hermes job.
- Add cross-day memory and project progress arcs.

## 6. Non-goals for the hackathon

- A web dashboard.
- Browser-history surveillance.
- Automatic social-media publishing.
- Full production multi-tenancy.
- Perfect Gmail newsletter classification.
- Real-time background monitoring.
- A general-purpose video editor.
- Face cloning or automatic face footage.
- Reading confidential CAD Trust or employer content for the public demo.
- Replacing human editorial judgment.
- Forking or substantially modifying Hermes core.

## 7. Core user journey

### Step 1 — Inspect source newsletters

```bash
founder erick learning inbox --date today
```

The system lists likely newsletter emails from a bounded period or label.

### Step 2 — Curate

```bash
founder erick learning select --ids 1,2,5,6,8,10
```

The founder explicitly chooses what deserves further processing.

### Step 3 — Extract learning

```bash
founder erick learning digest
```

For every selected email, the agent extracts:

- key points;
- what the founder learned;
- why it matters to active projects;
- possible follow-up actions;
- public-safety classification.

### Step 4 — Log work and life context

```bash
founder erick personal capture "Watched an Argentina match this morning"
founder erick learning capture "Read newsletters over coffee"
founder erick hackathon capture "Vibe-planned the agent workflow"
founder erick hackathon capture "Built the first end-to-end pipeline"
```

### Step 5 — End the overall day

```bash
founder erick default end-day
```

The agent:

1. collects the day’s approved evidence;
2. reconstructs a timeline;
3. excludes confidential workspace details;
4. selects one clear narrative;
5. generates the Founder Digest;
6. creates a video script and structured scene plan;
7. generates narration;
8. renders the Remotion composition;
9. uploads the video privately;
10. returns local paths and a signed review URL.

## 8. End features

### 8.1 Founder Digest

The digest may be daily or weekly. It should contain:

- theme;
- selected learning;
- what was built;
- connections between learning and work;
- founder lesson;
- next actions;
- disclosure note indicating what sources were used.

The private version may include more detail. The public version must use only the public-safe manifest.

### 8.2 Founder Reel

The video must be:

- 9:16;
- 45–60 seconds;
- faceless;
- understandable without audio through burned-in captions;
- composed from deterministic templates;
- based on the same evidence as the digest;
- stored locally and uploaded privately;
- ready for review, not automatically published.

Recommended scene types:

1. hook;
2. daily-moments montage;
3. problem;
4. terminal or pipeline;
5. newsletter/result mockup;
6. founder lesson;
7. self-referential reveal.

## 9. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Run entirely from a CLI | Must |
| FR-02 | Support `user` and `workspace` context | Must |
| FR-03 | Gmail OAuth uses read-only access | Must |
| FR-04 | Process only explicitly selected emails | Must |
| FR-05 | Normalize inputs into a common event model | Must |
| FR-06 | Store raw private data outside the public repo | Must |
| FR-07 | Produce structured LLM output | Must |
| FR-08 | Create public-safe manifest before rendering | Must |
| FR-09 | Generate Markdown and HTML digest | Must |
| FR-10 | Render MP4 with Remotion | Must |
| FR-11 | Upload to private GCS and create signed URL | Must |
| FR-12 | Fixture/demo mode works with no OAuth | Must |
| FR-13 | Notion sync | Should |
| FR-14 | Git activity import | Could |
| FR-15 | Weekly digest | Could |

## 10. Agentic behavior

The system qualifies as agentic because it does more than run a fixed template. Given founder-approved evidence, it must decide:

- which facts are relevant;
- which workspace each fact belongs to;
- which facts are private or public-safe;
- what changed during the day;
- what the strongest narrative is;
- which scene type best expresses each part;
- which next actions are concrete enough to retain.

Human judgment guides:

- email selection;
- workspace configuration;
- privacy classification overrides;
- final review;
- any future publication.

## 11. Acceptance criteria

A hackathon MVP is complete when one command in fixture mode:

```bash
founder demo default end-day --fixture
```

successfully produces:

- a valid daily learning log;
- a readable Markdown/HTML Founder Digest;
- a valid public-safe story plan;
- a narrated and captioned 9:16 MP4;
- a local output path;
- either a working GCS signed URL or a clear local-only fallback;
- a run manifest showing the stages completed.

The generated hackathon submission video should be produced by this same pipeline.

## 12. Success metrics

For Top-30 screening, optimize for:

- judges understand the product within ten seconds;
- end-to-end demo completes reliably;
- repository architecture is understandable within two minutes;
- generated video looks intentionally designed;
- privacy choices are visible and credible;
- source code and commit history prove the system was built during the event.

## 13. One-sentence pitch

> Founder Build in Public turns the work and learning a solo founder already does into a curated founder digest and a faceless, review-ready progress reel.
