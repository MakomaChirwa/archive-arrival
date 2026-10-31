export const curriculum = [
  { id: 'ux', title: 'UX Design', steps: [
    ['Meet UX design', 'Learn what UX designers do and how they solve everyday problems.', '12 min read'],
    ['Understand your user', 'Practice asking good questions and listening without assumptions.', '25 min activity'],
    ['Sketch your first idea', 'Turn a problem into a simple screen design using paper.', '30 min activity'],
    ['Test and improve', 'Ask someone to try your idea and learn from their feedback.', '20 min activity'],
  ] },
  { id: 'web', title: 'Web Development', steps: [
    ['Explore HTML', 'Create a page with a heading, a paragraph and a link.', '20 min activity'],
    ['Style with CSS', 'Add spacing, colour and readable text to your page.', '25 min activity'],
    ['Try JavaScript', 'Make a button change the text on your page.', '30 min activity'],
    ['Build a small website', 'Combine your skills into a personal project.', '40 min activity'],
  ] },
  { id: 'data', title: 'Data Analytics', steps: [
    ['Ask a data question', 'Choose a question and collect a small set of information.', '20 min activity'],
    ['Organise your data', 'Put your information in a table and check for missing values.', '25 min activity'],
    ['Find patterns', 'Compare values and create a chart.', '30 min activity'],
    ['Share your findings', 'Explain what your data shows and what it cannot tell you.', '20 min activity'],
  ] },
] as const;
export type PathId = typeof curriculum[number]['id'];
export function completionPercent(rows: { path_id: string; step_index: number }[], pathId: string) {
  const count = new Set(rows.filter(r => r.path_id === pathId && r.step_index >= 0 && r.step_index < 4).map(r => r.step_index)).size;
  return count * 25;
}
export function filterMentors<T extends { category: string }>(items: T[], category: string): T[] {
  return category === 'All mentors' ? items : items.filter(m => m.category === category);
}