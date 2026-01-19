import type { LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from 'lexical';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useToolbar } from '../hooks/use-toolbar';
import { ToolbarItems } from './toolbar-items';

function FloatingToolbar({ editor }: { editor: LexicalEditor }) {
  const popupCharStylesEditorRef = React.useRef<HTMLDivElement>(null);
  const toolbarState = useToolbar(editor);
  const { updateToolbar } = toolbarState;

  const updateFloatingToolbar = React.useCallback(() => {
    updateToolbar();

    const selection = window.getSelection();
    const rootElement = editor.getRootElement();

    if (
      selection === null
      || selection.isCollapsed
      || rootElement === null
      || !rootElement.contains(selection.anchorNode)
    ) {
      if (popupCharStylesEditorRef.current) {
        popupCharStylesEditorRef.current.style.opacity = '0';
        popupCharStylesEditorRef.current.style.transform = 'translate(-50%, 10px) scale(0.95)';
        popupCharStylesEditorRef.current.style.pointerEvents = 'none';
      }
      return;
    }

    const domRange = selection.getRangeAt(0);
    let rect;

    if (selection.anchorNode === rootElement) {
      let inner = rootElement.firstChild;
      while (inner && inner.nextSibling) {
        inner = inner.nextSibling;
      }
      rect = inner ? (inner as HTMLElement).getBoundingClientRect() : rootElement.getBoundingClientRect();
    }
    else {
      rect = domRange.getBoundingClientRect();
    }

    if (popupCharStylesEditorRef.current) {
      popupCharStylesEditorRef.current.style.opacity = '1';
      popupCharStylesEditorRef.current.style.transform = 'translate(-50%, -100%) scale(1)';
      popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
      popupCharStylesEditorRef.current.style.left = `${rect.left + rect.width / 2}px`;
      popupCharStylesEditorRef.current.style.top = `${rect.top - 10}px`;
    }
  }, [editor, updateToolbar]);

  React.useEffect(() => {
    const onResize = () => {
      editor.getEditorState().read(() => {
        updateFloatingToolbar();
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [editor, updateFloatingToolbar]);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateFloatingToolbar]);

  return (
    <div
      ref={popupCharStylesEditorRef}
      className="fixed z-50 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg transition-all duration-200 ease-in-out"
      style={{
        opacity: 0,
        transform: 'translate(-50%, 10px) scale(0.95)',
        pointerEvents: 'none',
      }}
    >
      <ToolbarItems editor={editor} {...toolbarState} showDivider={false} />
    </div>
  );
}

export function FloatingToolbarPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}) {
  const [editor] = useLexicalComposerContext();
  return createPortal(
    <FloatingToolbar editor={editor} />,
    anchorElem,
  );
}
