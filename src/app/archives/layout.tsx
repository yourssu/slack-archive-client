import { getChannels } from '@/apis/channels'
import { ArchivePannel } from '@/app/archives/components/ArchivePannel'
import { SidebarChannelItem } from '@/app/archives/components/SidebarChannelItem'

const ArchivesLayout = async ({ children }: React.PropsWithChildren<unknown>) => {
  const channels = await getChannels()

  return (
    <div className="flex h-full gap-2 px-5 py-2">
      <ArchivePannel className="w-[320px]" title="채널">
        <div className="flex flex-col gap-1">
          {channels.map((channel) => (
            <SidebarChannelItem channel={channel} key={channel.id} />
          ))}
        </div>
      </ArchivePannel>
      {children}
    </div>
  )
}

export default ArchivesLayout
