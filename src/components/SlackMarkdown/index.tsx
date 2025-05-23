'use client'

import ReactMarkdown, { RuleType } from 'markdown-to-jsx'
import { Noto_Sans_KR } from 'next/font/google'
import { AnchorHTMLAttributes, HTMLAttributes } from 'react'

import { Blockquote } from '@/components/SlackMarkdown/components/Blockquote'
import { Code } from '@/components/SlackMarkdown/components/Code'
import { CodeBlock } from '@/components/SlackMarkdown/components/CodeBlock'
import { InlineEmoji } from '@/components/SlackMarkdown/components/InlineEmoji'
import { MdImage } from '@/components/SlackMarkdown/components/MdImage'
import { MdLink } from '@/components/SlackMarkdown/components/MdLink'
import { MentionSpan } from '@/components/SlackMarkdown/components/MentionSpan'
import {
  convertBlockquoteString,
  convertCodeBlockString,
  convertInlineEmojiString,
  convertLinkString,
  convertMentionString,
  convertNewLineToRawElement,
  convertStrikeString,
  decodeCodeBlockContent,
} from '@/components/SlackMarkdown/utils/convert'
import { parseDataset } from '@/components/SlackMarkdown/utils/dataset'
import { tramsformToHTMLAttributes } from '@/components/SlackMarkdown/utils/transform'
import { assertNonNullish } from '@/utils/assertion'

interface SlackMarkdownProps {
  children: string
  isEdited?: boolean
}

const NotoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
})

export const SlackMarkdown = ({ children, isEdited }: SlackMarkdownProps) => {
  const converts = [
    convertNewLineToRawElement,
    convertStrikeString,
    convertMentionString,
    convertCodeBlockString,
    convertLinkString,
    convertInlineEmojiString,
    convertBlockquoteString,
  ]

  return (
    <div
      className={`line-height-[22px] text-slack-text-primary text-[15px] ${NotoSansKR.className} antialiased`}
      style={{
        fontVariantLigatures: 'common-ligatures',
        wordBreak: 'break-word',
      }}
    >
      <ReactMarkdown
        options={{
          renderRule(next, node, _, state) {
            if (node.type === RuleType.codeInline) {
              return <Code key={state.key}>{node.text}</Code>
            }
            return next()
          },
          overrides: {
            pre: (props) => {
              const p = tramsformToHTMLAttributes<HTMLAttributes<HTMLPreElement>>(props)
              const { content, codeblock } = parseDataset(p)

              if (codeblock && typeof content === 'string') {
                return <CodeBlock {...p}>{decodeCodeBlockContent(content)}</CodeBlock>
              }
              return <pre {...p} />
            },
            code: ({ children }) => {
              return <>{children}</>
            },
            // Next.js Image로 폴백해줘요.
            img: (props) => <MdImage {...props} alt={props.alt} />,
            span: (props) => {
              const p = tramsformToHTMLAttributes<HTMLAttributes<HTMLSpanElement>>(props)
              const dataset = parseDataset(p)

              if (dataset.mention) {
                return <MentionSpan {...p} />
              }
              if (dataset['emoji-url'] && dataset['emoji-name'] && dataset['emoji-size']) {
                const { 'emoji-url': url, 'emoji-name': name, 'emoji-size': size } = dataset
                if (
                  typeof url === 'string' &&
                  typeof name === 'string' &&
                  typeof size === 'string' &&
                  (size === 'large' || size === 'medium')
                ) {
                  return <InlineEmoji name={name} size={size} url={url} />
                }
              }
              return <span {...p} />
            },
            p: ({ children }) => <>{children}</>,
            b: ({ children }) => <em>{children}</em>,
            em: ({ children }) => <b>{children}</b>,
            a: (props) => {
              const p = tramsformToHTMLAttributes<AnchorHTMLAttributes<HTMLAnchorElement>>(props)
              assertNonNullish(p.href)
              return <MdLink {...p} href={p.href} />
            },
            blockquote: (props) => {
              const p = tramsformToHTMLAttributes<HTMLAttributes<HTMLQuoteElement>>(props)
              const dataset = parseDataset(p)

              if (dataset.type === 'once' || dataset.type === 'twice') {
                return <Blockquote {...p} type={dataset.type} />
              }
              return <span {...p} />
            },
          },
        }}
      >
        {children && converts.reduce((acc, convert) => convert(acc), children)}
      </ReactMarkdown>
      {isEdited && <span className="text-slack-text-tertiary text-[13px]"> (편집됨)</span>}
    </div>
  )
}
