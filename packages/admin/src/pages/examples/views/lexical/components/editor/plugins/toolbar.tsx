import type { HeadingTagType } from '@lexical/rich-text';
import {
  BoldOutlined,
  ItalicOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { Button, Divider, Select } from 'antd';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import * as React from 'react';

const blockTypeToBlockName = {
  paragraph: '正文',
  h1: '一级标题',
  h2: '二级标题',
  h3: '三级标题',
};

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = React.useRef(null);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [blockType, setBlockType] = React.useState<keyof typeof blockTypeToBlockName>('paragraph');

  const $updateToolbar = React.useCallback(
    () => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // Update text format
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));

        // Update block type
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);

        if (elementDOM !== null) {
          if ($isHeadingNode(element)) {
            setBlockType(element.getTag() as keyof typeof blockTypeToBlockName);
          }
          else {
            setBlockType('paragraph');
          }
        }
      }
    },
    [editor],
  );

  React.useEffect(
    () => {
      return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(
            () => {
              $updateToolbar();
            },
            { editor },
          );
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (_payload, _newEditor) => {
            $updateToolbar();
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload);
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload);
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
      );
    },
    [editor, $updateToolbar],
  );

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  return (
    <div ref={toolbarRef} className="flex h-12 items-center justify-center gap-2.5">
      <Button
        type="text"
        size="small"
        icon={<UndoOutlined />}
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      />
      <Button
        type="text"
        size="small"
        icon={<RedoOutlined />}
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      />
      <Divider orientation="vertical" className="m-0" />
      <Select
        value={blockType}
        variant="borderless"
        size="small"
        className="w-24"
        onChange={(value) => {
          if (value === 'paragraph') {
            formatParagraph();
          }
          else {
            formatHeading(value as HeadingTagType);
          }
        }}
        options={Object.entries(blockTypeToBlockName).map(([value, label]) => ({
          value,
          label,
        }))}
      />
      <Button
        type="text"
        size="small"
        icon={<BoldOutlined />}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={isBold ? 'bg-(--ant-btn-bg-color-hover)' : ''}
        aria-label="Format Bold"
      />
      <Button
        type="text"
        size="small"
        icon={<ItalicOutlined />}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={isItalic ? 'bg-(--ant-btn-bg-color-hover)' : ''}
        aria-label="Format Italic"
      />
      <Button
        type="text"
        size="small"
        icon={<UnderlineOutlined />}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={isUnderline ? 'bg-(--ant-btn-bg-color-hover)' : ''}
        aria-label="Format Underline"
      />
      <Button
        type="text"
        size="small"
        icon={<StrikethroughOutlined />}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={isStrikethrough ? 'bg-(--ant-btn-bg-color-hover)' : ''}
        aria-label="Format Strikethrough"
      />
    </div>
  );
}
