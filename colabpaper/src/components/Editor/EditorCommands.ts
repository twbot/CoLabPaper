// src/components/Editor/EditorCommands.ts
import { LATEX_COMMANDS } from '@/constants';
import * as monaco from 'monaco-editor';

export function registerLatexCommands(editor: monaco.editor.IStandaloneCodeEditor) {
    // Configure LaTeX language
    monaco.languages.register({ id: 'latex' });

    // Set up syntax highlighting
    monaco.languages.setMonarchTokensProvider('latex', {
        tokenizer: {
            root: [
                [/\\[a-zA-Z]+(?![a-zA-Z])/, 'keyword'],
                [/\{|\}|\[|\]/, 'bracket'],
                [/\$.*?\$/, 'variable'],
                [/%.*$/, 'comment'],
                [/\\ai\{[^}]*\}/, 'custom-ai'],
            ]
        }
    });

    // Register completion provider
    monaco.languages.registerCompletionItemProvider('latex', {
        triggerCharacters: ['\\'],
        provideCompletionItems: (model, position) => {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });

            if (!textUntilPosition.endsWith('\\')) {
                return { suggestions: [] };
            }

            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endColumn: position.column
            };

            // Create a Set of unique commands
            const uniqueCommands = new Set(LATEX_COMMANDS.map(cmd => cmd.command));

            // Map each unique command to a completion item
            const suggestions = Array.from(uniqueCommands).map(command => {
                const cmdDetails = LATEX_COMMANDS.find(cmd => cmd.command === command)!;
                return {
                    label: '\\' + cmdDetails.command,
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: {
                        value: `**${cmdDetails.command}**\n\n${cmdDetails.description}${cmdDetails.category ? `\n\n*Category: ${cmdDetails.category}*` : ''}`
                    },
                    insertText: cmdDetails.snippet,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: cmdDetails.category,
                    range: range
                };
            });

            return { suggestions };
        }
    });

    // Handle AI command execution
    editor.onKeyDown((e) => {
        if (e.keyCode === monaco.KeyCode.Enter) {
            const model = editor.getModel();
            if (!model) return;

            const position = editor.getPosition();
            if (!position) return;

            const line = model.getLineContent(position.lineNumber);
            const aiCommandMatch = line.match(/\\ai\{([^}]*)\}/);

            if (aiCommandMatch) {
                e.preventDefault();
                e.stopPropagation();

                const prompt = aiCommandMatch[1];
                handleAiCommand({ prompt }).then(response => {
                    const range = new monaco.Range(
                        position.lineNumber,
                        line.indexOf('\\ai'),
                        position.lineNumber,
                        line.indexOf('}') + 1
                    );

                    editor.executeEdits('ai-command', [{
                        range,
                        text: response,
                    }]);
                }).catch(error => {
                    console.error('Error executing AI command:', error);
                });
            }
        }
    });
}

async function handleAiCommand(payload: { prompt: string }): Promise<string> {
    try {
        const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/ai/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to generate AI content');
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error generating AI content:', error);
        throw error;
    }
}