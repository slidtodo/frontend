type NoteSource = 'MANUAL' | 'GITHUB_ISSUE' | 'GITHUB_PR';
type TagItem = { id?: number | null; name?: string | null };

export function mapNoteTagsFromSource(
  source: NoteSource | undefined,
  tags: TagItem[] | undefined,
): { id: string; string: string }[] {
  const githubSourceLabel =
    source === 'GITHUB_ISSUE' ? 'ISSUES' : source === 'GITHUB_PR' ? 'PR' : null;

  if (githubSourceLabel) {
    return [{ id: 'source', string: githubSourceLabel }];
  }

  return (tags ?? []).map((t) => ({ id: String(t.id), string: t.name ?? '' }));
}
