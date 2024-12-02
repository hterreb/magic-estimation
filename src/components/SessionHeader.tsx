import React from 'react';
import { Button } from '@/components/ui/button';
//import { Input } from '@/components/ui/input';
import {
  Share2,
  //Copy,
  Users,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/use-toast';

React.useCallback;

export function SessionHeader() {
  const { currentSession } = useStore();
  const { toast } = useToast();
  
  if (!currentSession) return null;

  const copySessionLink = () => {
    const sessionUrl = `${window.location.origin}?session=${currentSession.id}`;
    navigator.clipboard.writeText(sessionUrl).then(() => {
      toast('Link copied!');
    });
  };

  return (
    <div className="flex items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          {currentSession.name}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{currentSession.participants.length} participants</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={copySessionLink}
          title="Copy session link"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}