import { MessageItem } from '@/apis/messages'
import { SlackThreadMessageItem } from '@/app/archives/[channelId]/[threadId]/components/SlackThreadMessageItem'

interface SlackThreadHeadMessageItemProps {
  message: MessageItem
  messageCount: number
}

export const SlackThreadHeadMessageItem = ({
  message,
  messageCount,
}: SlackThreadHeadMessageItemProps) => {
  return (
    <>
      <SlackThreadMessageItem message={message} />
      <div className="flex items-center gap-3 px-4">
        <span className="text-[13px] text-[rgba(29,28,29,0.7)]">{messageCount}개의 댓글</span>
        <div className="h-[1px] grow bg-[rgb(29,28,29,0.13)]" />
      </div>
    </>
  )
}
