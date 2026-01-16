import type { RenderElementProps } from 'slate-react';
import type {
  PlaceholderElement as PlaceholderElementType,
} from '../../types/slate';
import { Editor, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';

export function PlaceholderElement(props: RenderElementProps) {
  const { attributes, children, element } = props;
  const editor = useSlateStatic();
  const placeholderElement = element as PlaceholderElementType;
  const hasValue = placeholderElement.children[0]?.text;

  const onClick = () => {
    try {
      const path = ReactEditor.findPath(editor, element);
      // 将选区设置为该元素的文本内容范围
      Transforms.select(editor, Editor.range(editor, path));
      // 确保编辑器获得焦点
      ReactEditor.focus(editor);
    }
    catch (e) {
      console.error('Focus Error:', e);
    }
  };

  return (
    <span
      {...attributes}
      className="mx-1 my-0.5 cursor-text rounded bg-slot-bg px-1.5 py-0.5 font-semibold leading-normal text-slot-text break-words"
      onClick={onClick}
    >
      {children}
      {!hasValue && (
        <span
          className="h-0 w-0 cursor-text select-none font-normal text-slot-placeholder"
          contentEditable={false}
        >
          {placeholderElement.placeholder}
        </span>
      )}
    </span>
  );
}
