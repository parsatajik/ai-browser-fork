import React, { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode, $getSelection } from 'lexical';

import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import '@pages/sidepanel/LexicalEditor.css';

const theme = {
  paragraph: 'editor-paragraph',
};

const onError = (error: Error) => {
  console.error(error);
};

const initialConfig = {
  namespace: 'BrowserAIEditor',
  theme,
  onError,
};

const MyCustomAutoFocusPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
};

const MyOnChangePlugin: React.FC<{ onChange: (editorState: any) => void }> = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    console.log('registering update listener');
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
};

interface CustomCommandsPluginProps {
  messages: string[];
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
}

const CustomCommandsPlugin: React.FC<CustomCommandsPluginProps> = ({ messages, setMessages }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter behavior

        chrome.runtime.sendMessage({ action: 'REQUEST_MARKDOWN' }, response => {
          console.log(response.markdown); // Set the received Markdown content
        });

        editor.update(() => {
          const root = $getRoot();
          let currentText = '';

          const collectText = (node: any) => {
            if (node.getType() === 'text') {
              currentText += node.__text;
            } else if (node.getChildren) {
              node.getChildren().forEach(collectText);
            }
          };

          root.getChildren().forEach(collectText);

          if (currentText.trim().length > 0) {
            setMessages(prevMessages => [...prevMessages, currentText]); // Store the current message
            root.clear(); // Clear the editor for new input
            const paragraphNode = $createParagraphNode();
            root.append(paragraphNode); // Add a new paragraph for the next input
          }
        });
      }
    };

    // Get the editor's content editable element
    const contentEditableElement = editor.getRootElement();

    // Attach the keydown event listener to the content editable element
    contentEditableElement?.addEventListener('keydown', handleEnterPress);

    // Cleanup function to remove the event listener
    return () => {
      contentEditableElement?.removeEventListener('keydown', handleEnterPress);
    };
  }, [editor]);

  return null;
};

const MessagesDisplay: React.FC<{ messages: string[] }> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className="message">
          {message}
        </div>
      ))}
    </div>
  );
};

const LexicalEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<string | undefined>();
  const [messages, setMessages] = useState<string[]>([]);

  const onChange = (editorState: any) => {
    const editorStateJSON = editorState.toJSON();
    console.log(messages);
    setEditorState(JSON.stringify(editorStateJSON));
  };

  return (
    <div>
      <LexicalComposer initialConfig={initialConfig}>
        <MessagesDisplay messages={messages} />
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-container" placeholder="Ask anything..." />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin />
        <MyOnChangePlugin onChange={onChange} />
        <CustomCommandsPlugin messages={messages} setMessages={setMessages} />
      </LexicalComposer>
    </div>
  );
};
export default LexicalEditor;
