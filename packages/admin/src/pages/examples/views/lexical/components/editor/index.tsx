import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { Divider } from 'antd';
import { ToolbarPlugin } from './plugins/toolbar';

const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
  },
  heading: {
    h1: 'text-3xl font-bold mt-3',
    h2: 'text-2xl font-bold mt-3',
    h3: 'text-xl font-bold mt-3',
  },
};

const onError: InitialConfigType['onError'] = (error) => {
  console.error(error);
};

export function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [HeadingNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <Divider size="small" className="m-0" />
      <div>
        <RichTextPlugin
          contentEditable={(
            <ContentEditable
              className="relative block h-full border-0 p-6 pb-0 text-base outline-0"
            />
          )}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
}
