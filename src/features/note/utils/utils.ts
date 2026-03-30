type NoteSource = 'MANUAL' | 'GITHUB_ISSUE' | 'GITHUB_PR';
type TagItem = { id?: number | null; name?: string | null };

interface MapNoteTagsOptions {
  source?: NoteSource;
  tags?: TagItem[];
  sourceItemId?: number | null;
  status?: string | null;
}

export function mapNoteTagsFromSource({
  source,
  tags,
  sourceItemId,
  status,
}: MapNoteTagsOptions): { id: string; string: string }[] {
  const githubSourceLabel = source === 'GITHUB_ISSUE' ? 'ISSUES' : source === 'GITHUB_PR' ? 'PR' : null;

  if (githubSourceLabel) {
    return [
      { id: 'source', string: githubSourceLabel },
      ...(sourceItemId != null ? [{ id: 'itemId', string: `#${sourceItemId}` }] : []),
      ...(status != null ? [{ id: 'status', string: status }] : []),
    ];
  }

  return (tags ?? []).map((t, i) => ({ id: t.id != null ? String(t.id) : 'manual-tag-' + i, string: t.name ?? '' }));
}
