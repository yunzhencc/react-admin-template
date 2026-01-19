import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Divider } from 'antd';
import { ToolbarPlugin } from './plugins/toolbar';

const theme = {};

const onError: InitialConfigType['onError'] = (error) => {
  console.error(error);
};

export function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
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
