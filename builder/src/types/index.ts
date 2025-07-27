/**
 * Type representing a tree item in a hierarchical structure.
 * Can be either a string (for files) or a tuple of [string, TreeItem[]] for folders.
 */
export type TreeItem = [string, TreeItem[]] | string; 