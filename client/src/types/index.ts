// client/src/types/index.ts

// 导出其他类型
export * from './common';

/**
 * 案例数据模型
 */
export interface ICase {
  id: string;
  title: string;
  category: 'website' | 'social' | 'finance' | 'automation';
  description: string;
  steps: ICaseStep[];
  resources?: ICaseResource[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 案例步骤
 */
export interface ICaseStep {
  title: string;
  agent: string;
  description: string;
}

/**
 * 案例资源
 */
export interface ICaseResource {
  title: string;
  type: string;
  content: string;
}

/**
 * 更新日志
 */
export interface IUpdateLog {
  id: string;
  version: string;
  title: string;
  description: string;
  date: string;
  type: 'case' | 'doc' | 'demo';
}

/**
 * 试验模板
 */
export interface ITemplate {
  id: string;
  title: string;
  type: 'prompt' | 'config' | 'data';
  content: string;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Agent 配置
 */
export interface IAgentConfig {
  name: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  model: string;
}
