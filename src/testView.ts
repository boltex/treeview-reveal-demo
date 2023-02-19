import * as vscode from 'vscode';

let testView: vscode.TreeView<{ key: string; }>;
let testViewProvider: vscode.TreeDataProvider<{ key: string }>;
const _onDidChangeTreeData = new vscode.EventEmitter<{ key: string } | undefined>();

export class TestView {

	constructor(context: vscode.ExtensionContext) {
		testViewProvider = aNodeWithIdTreeDataProvider();
		const view = vscode.window.createTreeView('testView', { treeDataProvider: testViewProvider, showCollapseAll: true });
		testView = view;
		context.subscriptions.push(view);

		vscode.commands.registerCommand('testView.changeTree', () => {
			changeTree();
		});

		vscode.commands.registerCommand('testView.changeTitle', async () => {
			const title = await vscode.window.showInputBox({ prompt: 'Type the new title for the Test View', placeHolder: view.title });
			if (title) {
				view.title = title;
			}
		});
	}
}

let treeVersion = 0;

const tree1: any = {
	'a': {
		'aa': {
			'aaa': {
				'aaaa': {
					'aaaaa': {
						'aaaaaa': {

						}
					}
				}
			}
		},
		'ab': {}
	},
	'b': {
		'ba': {},
		'bb': {}
	}
};

const tree2: any = {
	'c': {
		'cb': {},
		'cc': {}
	},
	'b': {
		'bb': {
			'bbb': {
				'bbbb': {
					'bbbbb': {
						'bbbbbb': {

						}
					}
				}
			}
		},
		'bc': {}
	}
};

let tree = tree1;

const nodes: any = {};


function aNodeWithIdTreeDataProvider(): vscode.TreeDataProvider<{ key: string }> {
	return {

		onDidChangeTreeData: _onDidChangeTreeData.event,

		getChildren: (element: { key: string }): { key: string }[] => {
			return getChildren(element ? element.key : undefined).map(key => getNode(key));
		},
		getTreeItem: (element: { key: string }): vscode.TreeItem => {
			const treeItem = getTreeItem(element.key);
			if (element.key.length === 4) {
				// Set the selected one to be the one (arbitrary choice) with 4 letters
				gotSelected(element);
			}
			// tree version prefixed to id (for uniqueness when tree structure changes)
			treeItem.id = treeVersion.toString() + element.key;
			treeItem.tooltip = " Id is : " + treeItem.id;
			return treeItem;
		},
		getParent: ({ key }: { key: string }): { key: string } | undefined => {
			const parentKey = key.substring(0, key.length - 1);
			return parentKey ? new Key(parentKey) : undefined;
		}
	};
}

function getChildren(key: string | undefined): string[] {
	if (!key) {
		return Object.keys(tree);
	}
	const treeElement = getTreeElement(key);
	if (treeElement) {
		return Object.keys(treeElement);
	}
	return [];
}

function getTreeItem(key: string): vscode.TreeItem {
	const treeElement = getTreeElement(key);
	return {
		label: { label: key },
		collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None
	};
}

function getTreeElement(element: string): any {
	let parent = tree;
	for (let i = 0; i < element.length; i++) {
		parent = parent[element.substring(0, i + 1)];
		if (!parent) {
			return null;
		}
	}
	return parent;
}

function getNode(key: string): { key: string } {
	if (!nodes[key]) {
		nodes[key] = new Key(key);
	}
	return nodes[key];
}

function changeTree(): void {
	treeVersion = treeVersion + 1; // Increment uniqueness prefix of node ids.

	// Alternate tree structure
	if (treeVersion % 2) {
		tree = tree2;
	} else {
		tree = tree1;
	}
	if (testViewProvider.onDidChangeTreeData) {
		_onDidChangeTreeData.fire(undefined); // Refresh whole tree !
	}

}

function gotSelected(element: { key: string }): void {
	// Got selected ! reveal it while leaving vscode's focus where it currently already is! (so user can continue typing, etc.)
	console.log('Trying to set selected node: ', element.key);
	testView.reveal(element, {
		select: true, // This sets tree selection without changing current focus location of vscode
		// ? How to set 'cursor' without changing focus to the sidebar/treeview ?
		focus: false // if true, This places cursor on item, AND changes focus to the treeview!
	});
}

class Key {
	constructor(readonly key: string) { }
}