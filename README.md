# Demo for reveal 'select/focus' option problem.

This sample extension was branched off from the [vscode-extension-samples/tree-view-sample/](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample)

1. Open the Test View and click on a node other than the selected one to set the 'cursor focus' on a new one, then either leave the focus in the tree, or place focus in an editor pane.

2. hit CTRL+T to change the tree and set the selection automatically. (you can hit CTRL+T repeatedly to change the tree again)

3. Notice the last 'cursor focus' position is still outlined (if focus still in tree) or that the 'ghost' of that cursor-focus' is still active with the 'refresh' icon still visible. (hovering over it will also not highlight it)

## With the user having the focus in the editor, pressing CTRL+T will **leave icons on an un-hoverable node**. (the one that had the focus outline)

![Focus was in editor](./ghost-cursor-focus-in-editor.png)

## With the focus in the outline prior to pressing CTRL+T, the outline will be around the node which had focus. Even if the selection is changed with 'reveal'.

![Focus was in outline](./ghost-cursor-focus-in-outline.png)