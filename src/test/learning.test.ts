import { describe, expect, it } from 'vitest';
import { completionPercent, filterMentors } from '@/lib/learning';
describe('Mentor filters', () => {
  const mentors = [{ name: 'Lerato', category: 'Design' }, { name: 'Nandi', category: 'Development' }, { name: 'Samira', category: 'Data' }];
  it.each(['Design', 'Development', 'Data'])('filters by %s', category => { expect(filterMentors(mentors, category)).toEqual(mentors.filter(m => m.category === category)); });
  it('restores all mentors', () => expect(filterMentors(mentors, 'All mentors')).toHaveLength(3));
});
describe('Saved learning progress', () => {
  it('starts at zero with no saved steps', () => expect(completionPercent([], 'ux')).toBe(0));
  it('counts unique steps only for the selected path', () => expect(completionPercent([{ path_id: 'ux', step_index: 0 }, { path_id: 'ux', step_index: 0 }, { path_id: 'web', step_index: 1 }], 'ux')).toBe(25));
  it('reaches 100 percent after all four steps', () => expect(completionPercent([0, 1, 2, 3].map(step_index => ({ path_id: 'ux', step_index })), 'ux')).toBe(100));
});