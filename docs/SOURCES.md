# Official Sources Checked

Checked on 12 July 2026.

## Hermes Agent

- Official repository: https://github.com/NousResearch/hermes-agent
- Creating Skills: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/creating-skills.md
- Skills feature documentation: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md
- CLI documentation: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/cli.md
- Configuration: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md

Relevant findings:

- Hermes is terminal-oriented and supports preloading skills.
- Skills are the preferred mechanism for wrapping instructions and external CLIs.
- `SKILL.md` uses YAML frontmatter and procedural instructions.
- A capability with substantial API authentication and binary processing is better implemented in an external application/tool, with the skill orchestrating it.

## Remotion

- Main site: https://www.remotion.dev/
- Parameterized rendering: https://www.remotion.dev/docs/parameterized-rendering
- Rendering: https://www.remotion.dev/docs/render
- Dataset rendering: https://www.remotion.dev/docs/dataset-render
- Project setup: https://www.remotion.dev/docs/

Relevant findings:

- Remotion supports reusable React video templates.
- Data and props can parameterize content, timing, and dimensions.
- Videos can be rendered programmatically into MP4 output.
- Current setup supports agent-oriented skills.

## OpenAI

- Current model catalog: https://developers.openai.com/api/docs/models
- Text-to-speech guide: https://developers.openai.com/api/docs/guides/text-to-speech

Relevant findings:

- `gpt-5.6-luna` is positioned for cost-sensitive workloads.
- `gpt-5.6-terra` balances intelligence and cost.
- Use the application API key only at runtime; Codex subscription usage is separate.
- The TTS provider and exact model should remain configurable because model availability changes.

## Gmail

- Gmail API overview: https://developers.google.com/workspace/gmail/api/guides
- Gmail API scopes: https://developers.google.com/workspace/gmail/api/auth/scopes
- OAuth authorization: https://developers.google.com/identity/protocols/oauth2

Relevant findings:

- Gmail access requires OAuth 2.0.
- Scopes define access level.
- The product should use the least-privilege read-only scope for the hackathon.

## Google Cloud Storage

- Signed URLs: https://cloud.google.com/storage/docs/access-control/signed-urls

Relevant findings:

- Signed URLs provide time-limited access to a specific private resource.
- Anyone holding the URL can use it while active, so expiry and handling matter.

## Hackathon handbook

The participant handbook was supplied directly by the participant and remains the source of truth for:

- theme;
- Fresh Code Rule;
- 11:00 AM–6:00 PM hacking period;
- public source-code requirement;
- commit-history expectations;
- privacy restriction;
- submission deadline;
- judging and prize conditions.
