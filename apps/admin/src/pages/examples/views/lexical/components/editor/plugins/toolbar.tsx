import {
  RedoOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { Button, Divider, Tooltip } from 'antd';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import * as React from 'react';
import { useToolbar } from '../hooks/use-toolbar';
import { ToolbarItems } from './toolbar-items';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = React.useRef(null);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  const toolbarState = useToolbar(editor);
  const { updateToolbar } = toolbarState;

  React.useEffect(
    () => {
      return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(
            () => {
              updateToolbar();
            },
            { editor },
          );
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (_payload, _newEditor) => {
            updateToolbar();
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
    [editor, updateToolbar],
  );

  return (
    <div ref={toolbarRef} className="flex h-12 items-center justify-center gap-2.5">
      <Tooltip title="撤销" arrow={false}>
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
      </Tooltip>
      <Tooltip title="恢复" arrow={false}>
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
      </Tooltip>
      <Divider orientation="vertical" className="m-0" />
      <ToolbarItems editor={editor} {...toolbarState} />
    </div>
  );
}
