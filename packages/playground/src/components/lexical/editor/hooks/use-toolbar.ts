import type { HeadingTagType } from '@lexical/rich-text';
import type { LexicalEditor } from 'lexical';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';
import * as React from 'react';

export const blockTypeToBlockName = {
  paragraph: { label: '正文', short: 'T' },
  h1: { label: '一级标题', short: 'H1' },
  h2: { label: '二级标题', short: 'H2' },
  h3: { label: '三级标题', short: 'H3' },
};

export type BlockType = keyof typeof blockTypeToBlockName;

export function useToolbar(editor: LexicalEditor) {
  const [blockType, setBlockType] = React.useState<BlockType>('paragraph');
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);

  const updateToolbar = React.useCallback(() => {
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

      if ($isHeadingNode(element)) {
        setBlockType(element.getTag() as BlockType);
      }
      else {
        setBlockType('paragraph');
      }
    }
  }, []);

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

  return {
    blockType,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    updateToolbar,
    formatHeading,
    formatParagraph,
  };
}
