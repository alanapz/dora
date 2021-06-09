// We declare a new type instead of using keyof RepositoryListItem to avoid having to import RepositoryListItem everywhere
export type RepositorySelectionType = "path"
  | "lastFetchDate"
  | "lastCommitDate"
  | "staged"
  | "unstaged"
  | "untracked"
  | "branches"
  | "branchesWithNoUpstream"
  | "branchesAheadOfUpstream"
  | "branchesBehindUpstream"
  | "branchesAheadOfAndBehindUpstream"
  | "branchesAheadOfParent"
  | "branchesBehindParent"
  | "branchesAheadOfAndBehindParent"
  | "stashes"
  | "warnings";

// Event thrown by RepositoryList when user clicks on a repository from the list
// (Causes RepositoryDetails to reload and sets fullScreenMode to false)
export interface RepositorySelectedEvent {
  path: string;
  selectionType: RepositorySelectionType;
}

export interface RepositoryModifiedEvent {
  path: string;
}
