import React from 'react';
import { useStore } from '@/store/useStore';
import { CreateSessionDialog } from './CreateSessionDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

React.useCallback;

export function SessionList() {
  const { sessions, currentUser } = useStore();

  if (!currentUser) return null;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Estimation Sessions</h1>
        {currentUser.role === 'moderator' && <CreateSessionDialog />}
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{session.name}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = `${window.location.origin}?session=${session.id}`;
                    window.location.href = url;
                  }}
                >
                  Join Session
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{session.participants.length} participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDistanceToNow(session.createdAt)} ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {sessions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>No sessions available.</p>
              {currentUser.role === 'moderator' && (
                <p className="mt-2">Create a new session to get started.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}