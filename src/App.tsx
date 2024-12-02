import React, { useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EstimationColumn } from '@/components/EstimationColumn';
import { BacklogSection } from '@/components/BacklogSection';
import { AddStoryDialog } from '@/components/AddStoryDialog';
import { LoginDialog } from '@/components/LoginDialog';
import { ParticipantsList } from '@/components/ParticipantsList';
import { SessionList } from '@/components/SessionList';
import { SessionHeader } from '@/components/SessionHeader';
import { estimationScales } from '@/data/estimationScales';
import { calculateEstimationStats } from '@/lib/estimation';
import { Button } from './components/ui/button';
import { useStore } from '@/store/useStore';
import { Sparkles } from 'lucide-react';

React.useCallback;

export default function App() {
  const { 
    currentUser, 
    currentSession,
    updateSession,
    joinSession,
    leaveSession
  } = useStore();

  useEffect(() => {
    // Handle session joining from URL
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session');
    
    if (sessionId && currentUser) {
      joinSession(sessionId, currentUser);
      
      // Cleanup on unmount
      return () => {
        leaveSession(sessionId, currentUser.id);
      };
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginDialog open={true} />;
  }

  if (!currentSession) {
    return <SessionList />;
  }

  const onDragEnd = (result: DropResult) => {
    if (!currentUser || !currentSession) return;

    const { destination, draggableId } = result;
    if (!destination) return;

    const newStories = Array.from(currentSession.stories);
    const storyIndex = newStories.findIndex(s => s.id === draggableId);
    const story = newStories[storyIndex];

    if (destination.droppableId === 'backlog') {
      delete story.estimations![currentUser.id];
    } else {
      story.estimations = {
        ...story.estimations,
        [currentUser.id]: destination.droppableId,
      };
    }

    // Reorder the story
    newStories.splice(storyIndex, 1);
    const destinationIndex = destination.droppableId === 'backlog'
      ? newStories.filter(s => !s.estimations || Object.keys(s.estimations).length === 0).length
      : newStories.filter(s => s.estimations?.[currentUser.id] === destination.droppableId).length;
    newStories.splice(destinationIndex, 0, story);

    updateSession(currentSession.id, { stories: newStories });
  };

  const addStory = (title: string, description?: string) => {
    if (!currentSession) return;

    const newStory = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date(),
      estimations: {},
    };

    updateSession(currentSession.id, {
      stories: [...currentSession.stories, newStory],
    });
  };

  const deleteStory = (id: string) => {
    if (!currentSession) return;

    updateSession(currentSession.id, {
      stories: currentSession.stories.filter(story => story.id !== id),
    });
  };

  const revealEstimations = () => {
    if (!currentSession) return;
    updateSession(currentSession.id, { isRevealed: true });
  };

  const selectedScale = estimationScales.find(
    scale => scale.name === currentSession.selectedScale
  ) || estimationScales[0];

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 container p-4 max-w-7xl">
        <SessionHeader />

        <div className="flex items-center justify-between mb-8">
          {currentUser.role === 'moderator' && <AddStoryDialog onAddStory={addStory} />}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Tabs 
            defaultValue={selectedScale.name} 
            onValueChange={(value) => {
              if (!currentSession) return;
              updateSession(currentSession.id, { selectedScale: value });
            }}
          >
            <TabsList className="mb-6">
              {estimationScales.map((scale) => (
                <TabsTrigger key={scale.name} value={scale.name}>
                  {scale.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {estimationScales.map((scale) => (
              <TabsContent key={scale.name} value={scale.name}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {scale.values.map((value) => (
                    <EstimationColumn
                      key={value}
                      value={value}
                      stories={currentSession.stories.filter(
                        story => story.estimations?.[currentUser.id] === value.toString()
                      )}
                      isRevealed={currentSession.isRevealed}
                      stats={currentSession.stories.reduce((acc, story) => ({
                        ...acc,
                        [story.id]: calculateEstimationStats(story)
                      }), {})}
                      onDelete={currentUser.role === 'moderator' ? deleteStory : () => {}}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <BacklogSection
            stories={currentSession.stories.filter(
              story => !story.estimations || !story.estimations[currentUser.id]
            )}
            isRevealed={currentSession.isRevealed}
            onDelete={currentUser.role === 'moderator' ? deleteStory : () => {}}
          />
        </DragDropContext>

        {currentUser.role === 'moderator' && !currentSession.isRevealed && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={revealEstimations}
              size="lg"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Reveal Estimations
            </Button>
          </div>
        )}
      </div>
      
      <div className="w-[300px] p-4 border-l">
        <ParticipantsList />
      </div>
    </div>
  );
}