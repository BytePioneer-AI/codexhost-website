export interface AgentItem {
  id: string;
  name: string;
  icon: string;
  invertInDark?: boolean;
}

export const FLAGSHIP_AGENTS: AgentItem[] = [
  { id: 'codex', name: 'Codex', icon: '/icons/codex.svg' },
  { id: 'claude-code', name: 'Claude Code', icon: '/icons/claude-code.svg' },
  { id: 'pi', name: 'Pi', icon: '/icons/pi.svg', invertInDark: true },
  { id: 'antigravity', name: 'Antigravity', icon: '/icons/antigravity.svg' },
  { id: 'grok', name: 'Grok', icon: '/icons/grok.png' },
  { id: 'cursor', name: 'Cursor CLI', icon: '/icons/cursor.svg' },
  { id: 'copilot', name: 'GitHub Copilot', icon: '/icons/copilot.png', invertInDark: true },
  { id: 'opencode', name: 'OpenCode', icon: '/icons/opencode.png' },
  { id: 'kimi', name: 'Kimi Code', icon: '/icons/kimi.svg' },
  { id: 'deepseek', name: 'DeepSeek', icon: '/icons/deepseek.svg' },
  { id: 'qwen', name: 'Qwen Code', icon: '/icons/qwen.svg' },
  { id: 'devin', name: 'Devin', icon: '/icons/devin.svg' },
];
