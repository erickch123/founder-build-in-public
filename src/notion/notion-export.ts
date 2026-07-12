import type {LearningItem} from '../domain/schemas.js';

const richText = (content: string) => [{type: 'text', text: {content: content.slice(0, 1_900)}}];

export const exportLearningToNotion = async (date: string, learnings: LearningItem[]): Promise<string> => {
  const {NOTION_API_KEY, NOTION_PARENT_PAGE_ID} = process.env;
  if (!NOTION_API_KEY || !NOTION_PARENT_PAGE_ID) {
    throw new Error('Notion export requires NOTION_API_KEY and NOTION_PARENT_PAGE_ID.');
  }
  const children = learnings.flatMap((learning) => [
    {object: 'block', type: 'heading_2', heading_2: {rich_text: richText(learning.topic)}},
    {object: 'block', type: 'paragraph', paragraph: {rich_text: richText(learning.whatILearned)}},
    {object: 'block', type: 'bulleted_list_item', bulleted_list_item: {rich_text: richText(`Why it matters: ${learning.whyItMatters}`)}},
    ...learning.nextActions.map((action) => ({object: 'block', type: 'to_do', to_do: {rich_text: richText(action.text), checked: false}})),
  ]);
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {Authorization: `Bearer ${NOTION_API_KEY}`, 'Content-Type': 'application/json', 'Notion-Version': '2026-03-11'},
    body: JSON.stringify({
      parent: {page_id: NOTION_PARENT_PAGE_ID},
      properties: {title: {title: richText(`Founder Learning — ${date}`)}},
      children,
    }),
  });
  const body = await response.json() as {url?: string; message?: string};
  if (!response.ok || !body.url) throw new Error(`Notion export failed: ${body.message ?? response.statusText}`);
  return body.url;
};
