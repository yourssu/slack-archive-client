'use client'

import clsx from 'clsx'
import { useContext, useState } from 'react'

import { PopoverContext } from '@/components/Popover/context'
import { usePopoverBehavior } from '@/components/Popover/hook'
import { PopoverBehaviorType } from '@/components/Popover/type'
import * as PrimivtivePopover from '@radix-ui/react-popover'

export interface PopoverProps {
  behavior?: PopoverBehaviorType
}

interface ContentProps extends PrimivtivePopover.PopoverContentProps {
  onCloseWithOutside?: () => void
}

const Content = ({
  children,
  className,
  sideOffset,
  onCloseWithOutside,
  ...props
}: React.PropsWithChildren<ContentProps>) => {
  const { onPointerEnter, onPointerLeave } = usePopoverBehavior()

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    props.onClick?.(e)
  }

  return (
    <PrimivtivePopover.Portal>
      <PrimivtivePopover.Content
        className="z-[500] outline-none"
        {...props}
        onClick={onClick}
        onCloseAutoFocus={onCloseWithOutside}
        onEscapeKeyDown={onCloseWithOutside}
        onFocusOutside={onCloseWithOutside}
        onInteractOutside={onCloseWithOutside}
        onPointerDownOutside={onCloseWithOutside}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {sideOffset && <div style={{ height: sideOffset }} />}
        <div
          className={clsx(
            'rounded-3 border-stroke-decorative bg-bg-layerElevated shadow-popover-light dark:shadow-popover-dark border-1',
            className
          )}
        >
          {children}
        </div>
      </PrimivtivePopover.Content>
    </PrimivtivePopover.Portal>
  )
}

const Trigger = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => {
  const { onClick, onPointerEnter, onPointerLeave } = usePopoverBehavior()

  return (
    <PrimivtivePopover.Trigger
      className={clsx('outline-none', className)}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      tabIndex={-1}
    >
      {children}
    </PrimivtivePopover.Trigger>
  )
}

export const Closeable = ({ children }: React.PropsWithChildren<unknown>) => {
  const { setOpen } = useContext(PopoverContext)
  return <div onClick={() => setOpen(false)}>{children}</div>
}

export const Popover = ({
  children,
  behavior = 'click',
}: React.PropsWithChildren<PopoverProps>) => {
  const [open, setOpen] = useState(false)

  return (
    <PopoverContext.Provider value={{ behavior, open, setOpen }}>
      <PrimivtivePopover.Root onOpenChange={(v) => setOpen(v)} open={open}>
        {children}
      </PrimivtivePopover.Root>
    </PopoverContext.Provider>
  )
}

Popover.Target = Trigger
Popover.Content = Content
Popover.Closeable = Closeable
