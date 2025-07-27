import { Button } from '@/components/ui/button';
import { Fragment } from '@/generated/prisma';
import { ExternalLinkIcon, RefreshCcwIcon } from 'lucide-react';
import React, { useState } from 'react'

interface Props {
  fragment: Fragment;
}

export const FragmentWeb = ({ fragment }: Props) => {

    const [fragmentKey,setFragmentKey] = useState(0)
    const [copied,setCopied] = useState(false)

    const handleRefresh = () => {
        setFragmentKey(prev => prev + 1)
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(fragment.SandboxUrl)
        setCopied(true)
        setTimeout(()=>{
            setCopied(false)
        },2000)
    }
  return (
    <div className='h-full w-full flex flex-col'>
        <div className='p-2 border-b bg-sidebar flex items-center gap-x-2'>
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
                <RefreshCcwIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" 
              onClick={handleCopy}
              disabled={!fragment.SandboxUrl || copied}
              className='flex-1 justify-start text-start font-normal'
            >
               <span className='truncate'>
                {fragment.SandboxUrl}
               </span>
            </Button>
            <Button variant="secondary" 
                size="sm"
                disabled={!fragment.SandboxUrl}
                onClick={()=>{
                    if(!fragment.SandboxUrl) return;
                    window.open(fragment.SandboxUrl, '_blank');
                }}
            >
                <ExternalLinkIcon className="w-4 h-4" />
            </Button>
        </div>
        <iframe 
        key={fragmentKey}
        src={fragment.SandboxUrl} 
        sandbox="allow-scripts allow-same-origin" 
        loading='lazy' 
        className="w-full h-full" 
        />
    </div>
  )
}