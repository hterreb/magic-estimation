import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoryCard } from './StoryCard';
import { UserStory } from '@/types/estimation';

React.useCallback;

interface BacklogSectionProps {
  stories: UserStory[];
  isRevealed: boolean;
  onDelete: (id: string) => void;
}

export function BacklogSection({ stories, isRevealed, onDelete }: BacklogSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Backlog</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="backlog">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-h-[100px] space-y-2"
            >
              {stories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  index={index}
                  isRevealed={isRevealed}
                  onDelete={onDelete}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}