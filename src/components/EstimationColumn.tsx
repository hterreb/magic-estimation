import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoryCard } from './StoryCard';
import { UserStory, EstimationStats } from '@/types/estimation';

React.useCallback;

interface EstimationColumnProps {
  value: string | number;
  stories: UserStory[];
  isRevealed: boolean;
  stats: Record<string, EstimationStats | undefined>;
  onDelete: (id: string) => void;
}

export function EstimationColumn({ value, stories, isRevealed, stats, onDelete }: EstimationColumnProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={`${value}`}>
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
                  stats={stats[story.id]}
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