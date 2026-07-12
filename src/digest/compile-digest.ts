import type {PublicManifest, StoryPlan} from '../domain/schemas.js';

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export const compileDigestMarkdown = (manifest: PublicManifest, story: StoryPlan): string => `# ${story.title}

> ${story.hook}

## Today’s theme

${story.theme}

## What I learned

${manifest.learnings.map((learning) => `- ${learning.summary}`).join('\n')}

## What I built

${manifest.events.map((event) => `- **${event.workspaceLabel}:** ${event.summary}`).join('\n')}

## Founder lesson

${story.founderLesson}

## Next step

${story.nextStep}

---

_Disclosure: ${manifest.disclosure.statement}_
`;

export const compileDigestHtml = (manifest: PublicManifest, story: StoryPlan): string => {
  const learnings = manifest.learnings.map((item) => `<li>${escapeHtml(item.summary)}</li>`).join('');
  const events = manifest.events.map((item) => `<li><strong>${escapeHtml(item.workspaceLabel)}:</strong> ${escapeHtml(item.summary)}</li>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(story.title)}</title><style>body{background:#0b1020;color:#f7f3e8;font:18px/1.6 system-ui;max-width:760px;margin:auto;padding:64px 24px}h1{font-size:48px;line-height:1.05}h2{color:#7fdbca;margin-top:40px}blockquote{border-left:4px solid #ffcc66;margin:32px 0;padding:12px 24px;font-size:24px}footer{opacity:.65;margin-top:56px}</style></head><body><h1>${escapeHtml(story.title)}</h1><blockquote>${escapeHtml(story.hook)}</blockquote><h2>Today’s theme</h2><p>${escapeHtml(story.theme)}</p><h2>What I learned</h2><ul>${learnings}</ul><h2>What I built</h2><ul>${events}</ul><h2>Founder lesson</h2><p>${escapeHtml(story.founderLesson)}</p><h2>Next step</h2><p>${escapeHtml(story.nextStep)}</p><footer>Disclosure: ${escapeHtml(manifest.disclosure.statement)}</footer></body></html>`;
};
