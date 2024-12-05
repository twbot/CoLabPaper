// src/components/Editor/EditorCommands.ts
import * as monaco from 'monaco-editor';

interface LatexCommand {
    command: string;
    description: string;
    snippet: string;
    category?: string;
}

// Comprehensive list of common LaTeX commands
const LATEX_COMMANDS: LatexCommand[] = [
    // Sections
    { command: 'section', description: 'Create section', snippet: '\\section{$1}$0', category: 'Structure' },
    { command: 'subsection', description: 'Create subsection', snippet: '\\subsection{$1}$0', category: 'Structure' },
    { command: 'subsubsection', description: 'Create subsubsection', snippet: '\\subsubsection{$1}$0', category: 'Structure' },

    // Environments
    { command: 'begin', description: 'Begin environment', snippet: '\\begin{$1}\n\t$0\n\\end{$1}', category: 'Environment' },
    { command: 'item', description: 'List item', snippet: '\\item $0', category: 'Environment' },

    // Text formatting
    { command: 'textbf', description: 'Bold text', snippet: '\\textbf{$1}$0', category: 'Text' },
    { command: 'textit', description: 'Italic text', snippet: '\\textit{$1}$0', category: 'Text' },
    { command: 'underline', description: 'Underlined text', snippet: '\\underline{$1}$0', category: 'Text' },

    // Math
    { command: 'equation', description: 'Equation environment', snippet: '\\begin{equation}\n\t$0\n\\end{equation}', category: 'Math' },
    { command: 'frac', description: 'Fraction', snippet: '\\frac{$1}{$2}$0', category: 'Math' },

    // References
    { command: 'cite', description: 'Citation', snippet: '\\cite{$1}$0', category: 'References' },
    { command: 'label', description: 'Label for reference', snippet: '\\label{$1}$0', category: 'References' },
    { command: 'ref', description: 'Reference', snippet: '\\ref{$1}$0', category: 'References' },

    // Custom
    { command: 'ai', description: 'Generate content using AI', snippet: '\\ai{$1}$0', category: 'AI' },
];

export function registerLatexCommands(editor: monaco.editor.IStandaloneCodeEditor) {
    monaco.languages.registerCompletionItemProvider('latex', {
        triggerCharacters: ['\\'],
        provideCompletionItems: (model, position, context, token) => {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });

            if (!textUntilPosition.endsWith('\\')) {
                return { suggestions: [] };
            }

            const range: monaco.IRange = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column - 1,
                endColumn: position.column
            };

            const suggestions = LATEX_COMMANDS.map(cmd => ({
                label: '\\' + cmd.command,
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: {
                    value: `**${cmd.command}**\n\n${cmd.description}${cmd.category ? `\n\n*Category: ${cmd.category}*` : ''}`
                },
                insertText: cmd.snippet,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: cmd.category,
                command: { id: 'editor.action.triggerSuggest', title: '...' },
                range: range
            }));

            return { suggestions };
        }
    });

    // Register a keyboard listener instead of using addCommand
    editor.onKeyDown((e) => {
        if (e.keyCode === monaco.KeyCode.Enter) {
            const model = editor.getModel();
            if (!model) return;

            const position = editor.getPosition();
            if (!position) return;

            const line = model.getLineContent(position.lineNumber);
            const aiCommandMatch = line.match(/\\ai\{([^}]*)\}/);

            if (aiCommandMatch) {
                // Prevent the default enter behavior
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
                    console.log(response)
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
        const response = await fetch('/api/v1/ai/generate', {
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