import { describe, it, expect } from 'vitest';
import { filterItems } from '../utils/filterUtils';

describe('filterUtils', () => {
  it('filters items by search term', () => {
    const items = [{ name: 'Slack' }, { name: 'Jira' }, { name: 'GitHub' }];
    const res = filterItems(items, 'sla', ['name']);
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Slack');
  });
});
