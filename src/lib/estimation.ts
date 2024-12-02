import { UserStory, EstimationStats } from '@/types/estimation';

export function calculateEstimationStats(story: UserStory): EstimationStats | undefined {
  if (!story.estimations || Object.keys(story.estimations).length === 0) {
    return undefined;
  }

  const values = Object.values(story.estimations);
  if (values.length === 0) return undefined;
  
  // Calculate mode
  const frequency: Record<string | number, number> = {};
  let maxFreq = 0;
  let mode: string | number = values[0];

  values.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
      mode = value;
    }
  });

  // Calculate range
  const numericValues = values
    .map(v => typeof v === 'string' ? convertToNumeric(v) : v)
    .filter((v): v is number => typeof v === 'number');

  const range: [string | number, string | number] = [
    values[0],
    values[0]
  ];

  if (numericValues.length > 0) {
    range[0] = Math.min(...numericValues);
    range[1] = Math.max(...numericValues);
  } else {
    const sortedValues = [...values].sort();
    range[0] = sortedValues[0];
    range[1] = sortedValues[sortedValues.length - 1];
  }

  // Calculate average for numeric values
  const average = numericValues.length > 0
    ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length
    : undefined;

  return {
    mode,
    range,
    average,
    consensus: maxFreq / values.length
  };
}

function convertToNumeric(value: string): number | undefined {
  const sizeMap: Record<string, number> = {
    'XS': 1,
    'S': 2,
    'M': 3,
    'L': 5,
    'XL': 8,
    'XXL': 13,
    'Mouse': 1,
    'Cat': 2,
    'Dog': 3,
    'Elephant': 5,
    'Whale': 8
  };

  return sizeMap[value];
}