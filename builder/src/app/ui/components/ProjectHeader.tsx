import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Home, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
    id: projectId
  }));

  return (
    <header className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{project.name}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Project Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Project Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-red-600 cursor-pointer">
              <Trash2 className="h-4 w-4" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};