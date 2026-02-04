import type { HeadingTagType } from '@lexical/rich-text';
import type { LexicalEditor } from 'lexical';
import type { BlockType } from '../hooks/use-toolbar';
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import { Button, Divider, Select, Tooltip } from 'antd';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { blockTypeToBlockName } from '../hooks/use-toolbar';

interface ToolbarItemsProps {
  editor: LexicalEditor;
  blockType: BlockType;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  formatHeading: (headingSize: HeadingTagType) => void;
  formatParagraph: () => void;
  showDivider?: boolean;
}

export function ToolbarItems({
  editor,
  blockType,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough,
  formatHeading,
  formatParagraph,
  showDivider = true,
}: ToolbarItemsProps) {
  return (
    <>
      <Tooltip title="切换字号" arrow={false}>
        <Select
          value={blockType}
          variant="borderless"
          size="small"
          className="w-14"
          popupMatchSelectWidth={false}
          classNames={{
            popup: {
              root: 'min-w-30',
            },
          }}
          onChange={(value) => {
            if (value === 'paragraph') {
              formatParagraph();
            }
            else {
              formatHeading(value as HeadingTagType);
            }
          }}
          options={Object.entries(blockTypeToBlockName).map(([value, { label, short }]) => ({
            value,
            label: (
              <div className="flex justify-between gap-4">
                <span>{label}</span>
                <span className="text-gray-400">{short}</span>
              </div>
            ),
            short,
          }))}
          optionLabelProp="short"
        />
      </Tooltip>
      {showDivider && <Divider orientation="vertical" className="m-0" />}
      <Tooltip title="加粗" arrow={false}>
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
      </Tooltip>
      <Tooltip title="斜体" arrow={false}>
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
      </Tooltip>
      <Tooltip title="下划线" arrow={false}>
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
      </Tooltip>
      <Tooltip title="删除线" arrow={false}>
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
      </Tooltip>
    </>
  );
}
