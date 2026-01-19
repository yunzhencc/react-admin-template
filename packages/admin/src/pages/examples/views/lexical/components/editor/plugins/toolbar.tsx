import {
  BoldOutlined,
  ItalicOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { Button, Divider } from 'antd';
import {
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

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = React.useRef(null);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);

  const $updateToolbar = React.useCallback(
    () => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // Update text format
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
      }
    },
    [],
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
      <Button
        type="text"
        size="small"
        icon={<BoldOutlined />}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={isBold ? 'bg-[var(--ant-btn-bg-color-hover)]' : ''}
        aria-label="Format Bold"
      />
      <Button
        type="text"
        size="small"
        icon={<ItalicOutlined />}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={isItalic ? 'bg-[var(--ant-btn-bg-color-hover)]' : ''}
        aria-label="Format Italics"
      />
      <Button
        type="text"
        size="small"
        icon={<UnderlineOutlined />}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={isUnderline ? 'bg-[var(--ant-btn-bg-color-hover)]' : ''}
        aria-label="Format Underline"
      />
      <Button
        type="text"
        size="small"
        icon={<StrikethroughOutlined />}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={isStrikethrough ? 'bg-[var(--ant-btn-bg-color-hover)]' : ''}
        aria-label="Format Strikethrough"
      />
    </div>
  );
}
