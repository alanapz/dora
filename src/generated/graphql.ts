
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum GitTagKind {
    LIGHTWEIGHT = "LIGHTWEIGHT",
    ANNOTATED = "ANNOTATED",
    SIGNED = "SIGNED"
}

export enum GitWorkingDirectoryItemStatus {
    ADDED = "ADDED",
    COPIED = "COPIED",
    DELETED = "DELETED",
    MODIFIED = "MODIFIED",
    TYPE_CHANGED = "TYPE_CHANGED",
    UNMERGED = "UNMERGED",
    UNKNOWN = "UNKNOWN",
    BROKEN = "BROKEN",
    UNTRACKED = "UNTRACKED"
}

export interface GitBranchFilter {
    upstreamConfigured?: boolean;
}

export interface GitObject {
    id: string;
    repository: GitRepository;
}

export interface GitRef {
    refName: string;
    displayName: string;
    repository: GitRepository;
    commit?: GitCommit;
    ancestors: GitCommit[];
    distance?: GitRefDistance;
}

export interface GitTreeItem {
    tree: GitTree;
    name: string;
    mode: number;
}

export interface IQuery {
    __typename?: 'IQuery';
    repository(path: string): GitRepository | Promise<GitRepository>;
    searchRepositories(startingPath?: string): GitRepository[] | Promise<GitRepository[]>;
}

export interface GitBlob extends GitObject {
    __typename?: 'GitBlob';
    id: string;
    repository: GitRepository;
    size: number;
    value: string;
}

export interface GitBranch extends GitRef {
    __typename?: 'GitBranch';
    branchName: string;
    upstream?: GitTrackingBranch;
    upstreamDistance?: GitRefDistance;
    parent?: GitTrackingBranch;
    parentDistance?: GitRefDistance;
    refName: string;
    displayName: string;
    repository: GitRepository;
    commit: GitCommit;
    ancestors: GitCommit[];
    distance?: GitRefDistance;
}

export interface GitCommit extends GitObject {
    __typename?: 'GitCommit';
    id: string;
    repository: GitRepository;
    firstParent?: GitCommit;
    parents: GitCommit[];
    tree: GitTree;
    author: GitPrincipal;
    committer: GitPrincipal;
    subject: string;
    message: string;
    ancestors: GitCommit[];
    refNotes: string[];
}

export interface GitPrincipal {
    __typename?: 'GitPrincipal';
    name: string;
    emailAddress: string;
    timestamp: number;
}

export interface GitRefDistance {
    __typename?: 'GitRefDistance';
    mergeBase: GitCommit;
    ahead: number;
    behind: number;
}

export interface GitRemote {
    __typename?: 'GitRemote';
    name: string;
    fetchUrl: string[];
    pushUrls: string[];
}

export interface GitRepository {
    __typename?: 'GitRepository';
    path: string;
    commit?: GitCommit;
    blob?: GitBlob;
    tree?: GitTree;
    ref?: GitRef;
    branches: GitBranch[];
    branch?: GitBranch;
    trackingBranches: GitTrackingBranch[];
    trackingBranch?: GitTrackingBranch;
    stashes: GitStash[];
    stash?: GitStash;
    lastFetchDate?: GitTimestamp;
    head?: GitRef;
    workingDirectory?: GitWorkingDirectory;
}

export interface GitRepositoryMutator {
    __typename?: 'GitRepositoryMutator';
    path: string;
}

export interface GitStash extends GitRef {
    __typename?: 'GitStash';
    refName: string;
    displayName: string;
    repository: GitRepository;
    commit: GitCommit;
    ancestors: GitCommit[];
    distance?: GitRefDistance;
}

export interface GitTag extends GitRef {
    __typename?: 'GitTag';
    refName: string;
    displayName: string;
    repository: GitRepository;
    commit?: GitCommit;
    ancestors: GitCommit[];
    distance?: GitRefDistance;
}

export interface GitTrackingBranch extends GitRef {
    __typename?: 'GitTrackingBranch';
    remote: GitRemote;
    branchName: string;
    refName: string;
    displayName: string;
    repository: GitRepository;
    commit: GitCommit;
    ancestors: GitCommit[];
    distance?: GitRefDistance;
}

export interface GitTree extends GitObject {
    __typename?: 'GitTree';
    id: string;
    repository: GitRepository;
    items: GitTreeItem[];
    item?: GitTreeItem;
    descendants: GitTreeDescendant[];
}

export interface GitTreeDescendant {
    __typename?: 'GitTreeDescendant';
    path: string;
    item: GitTreeItem;
}

export interface GitTreeBlobItem extends GitTreeItem {
    __typename?: 'GitTreeBlobItem';
    blob: GitBlob;
    tree: GitTree;
    name: string;
    mode: number;
    testErrorXXX: string;
}

export interface GitTreeSubtreeItem extends GitTreeItem {
    __typename?: 'GitTreeSubtreeItem';
    subtree: GitTree;
    tree: GitTree;
    name: string;
    mode: number;
}

export interface GitWorkingDirectory {
    __typename?: 'GitWorkingDirectory';
    path: string;
    repository: GitRepository;
    staged: GitWorkingDirectoryItem[];
    unstaged: GitWorkingDirectoryItem[];
    untracked: GitWorkingDirectoryItem[];
}

export interface GitWorkingDirectoryItem {
    __typename?: 'GitWorkingDirectoryItem';
    directory: GitWorkingDirectory;
    path: string;
    status: GitWorkingDirectoryItemStatus[];
}

export type GitTimestamp = any;
