import { Box, Text } from "ink";
import { useMemo } from "react";

import { currentTheme } from "../themes";

const LOADING_MESSAGES = [
  "Working on it...",
  "Acting...",
  "Thinking...",
  "Processing...",
  "Working hard...",
  "Waaaaaait...",
  "Almost there...",
];

export function StreamingIndicator({ streaming, nextTodo }: { streaming: boolean; nextTodo?: string }) {
  if (!streaming) return null;

  const loadingMessage = useMemo(() => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)], []);

  return (
    <Box flexDirection="column">
      <Box gap={1}>
        <Text color={currentTheme.colors.primary}>●</Text>
        <Text color={currentTheme.colors.primary}>{loadingMessage}</Text>
      </Box>
      {nextTodo && <Text color={currentTheme.colors.dimText}>Next: {nextTodo}</Text>}
    </Box>
  );
}
