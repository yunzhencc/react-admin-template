import type { Descendant } from 'slate';
import type { RenderElementProps } from 'slate-react';
import type { CustomEditor, CustomElement, CustomText } from '../_types';
import { Button, Card, Divider, message } from 'antd';
import * as React from 'react';
import { createEditor, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { DefaultElement, Editable, Slate, withReact } from 'slate-react';
import { PlaceholderElement } from '../_components';
import './App.css';

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: '帮我收集合适的素材，写一篇关于' },
      {
        type: 'placeholder',
        placeholder: '主题',
        children: [
          { text: '' },
        ],
      },
      { text: ' 的 ' },
      {
        type: 'placeholder',
        placeholder: '报告材料/方案策划/营销文章等',
        children: [
          { text: '' },
        ],
      },
      { text: ' 。' },
    ],
  },
];

function withEditable(editor: CustomEditor) {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'placeholder' ? true : isInline(element);
  };

  return editor;
}

function Textarea() {
  const editor = React.useRef(
    withEditable(withHistory(withReact(createEditor()))),
  ).current;

  const renderElement = React.useCallback(
    (props: RenderElementProps) => {
      switch (props.element.type) {
        case 'placeholder':
          return <PlaceholderElement {...props} />;
        default:
          return <DefaultElement {...props} />;
      }
    },
    [],
  );

  const getText = () => {
    message.info(Editor.string(editor, []));
  };

  return (
    <div className="container">
      <Card>
        <Button onClick={getText}>获取文本</Button>
        <Divider />
        <div className="editor-container">
          <Slate editor={editor} initialValue={initialValue}>
            <Editable
              className="editable"
              renderElement={renderElement}
              renderLeaf={({ attributes, children }) => {
                return (
                  <span
                    {...attributes}
                    className="vain-leaf"
                  >
                    {children}
                  </span>
                );
              }}
            />
          </Slate>
        </div>
      </Card>
    </div>
  );
}

export default Textarea;
