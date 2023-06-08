import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.constructorHelper', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const text = document.getText(selection);
            const params = text.split(',');

            const refactoredParams = params.map((param) => {
                const trimmedParam = param.trim();
                return `this.${trimmedParam} = ${trimmedParam};`;
            });

            const refactoredText = refactoredParams.join('\n');

            editor.edit(editBuilder => {
                const constructorPosition = selection.active;
                const constructorLine = document.lineAt(constructorPosition.line);

                // Check if the constructor is already defined
                if (constructorLine.text.trim().startsWith('constructor')) {
                    const constructorRange = constructorLine.range;
                    const openingBraceLine = document.lineAt(constructorRange.end.line + 1);
                    const startPosition = new vscode.Position(openingBraceLine.lineNumber, -1);

                    const newConstructorText = `\n${refactoredText}\n`;

                    editBuilder.insert(startPosition, newConstructorText);
                }
            });
        }
    });

    context.subscriptions.push(disposable);
}
