import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ThumbsUp, AlertTriangle, BarChart2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserStory, EstimationStats } from '@/types/estimation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

React.useCallback;

interface StoryCardProps {
  story: UserStory;
  index: number;
  isRevealed: boolean;
  stats?: EstimationStats;
  onDelete: (id: string) => void;
}

export function StoryCard({ story, index, isRevealed, stats, onDelete }: StoryCardProps) {
  return (
    <Draggable draggableId={story.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-secondary p-3 rounded-lg flex items-center justify-between group hover:bg-secondary/80 transition-colors"
        >
          <div className="flex-1 mr-4">
            <h3 className="font-medium">{story.title}</h3>
            {story.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
            )}
          </div>
          
          {isRevealed && stats && (
            <div className="flex items-center space-x-4">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <ThumbsUp className="text-green-500 mr-2 h-4 w-4" />
                    <span>{stats.mode}</span>
                    {stats.consensus >= 0.7 && (
                      <span className="ml-1 text-xs text-green-500">
                        ({Math.round(stats.consensus * 100)}%)
                      </span>
                    )}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="space-y-2">
                    <p className="text-sm">
                      {Math.round(stats.consensus * 100)}% of participants agreed on {stats.mode}
                    </p>
                    {stats.average && (
                      <p className="text-sm text-muted-foreground">
                        Average: {stats.average.toFixed(1)}
                      </p>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>

              <div className="flex items-center">
                <AlertTriangle className="text-yellow-500 mr-2 h-4 w-4" />
                <span>{`${stats.range[0]}-${stats.range[1]}`}</span>
              </div>

              {stats.average && (
                <div className="flex items-center">
                  <BarChart2 className="text-blue-500 mr-2 h-4 w-4" />
                  <span>{stats.average.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(story.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-4"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      )}
    </Draggable>
  );
}