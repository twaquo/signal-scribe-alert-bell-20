
import { registerPlugin } from '@capacitor/core';

export interface BroadcastPlugin {
  sendBroadcast(options: { action: string }): Promise<{ success: boolean }>;
}

const BroadcastPlugin = registerPlugin<BroadcastPlugin>('BroadcastPlugin', {
  web: {
    async sendBroadcast(options: { action: string }): Promise<{ success: boolean }> {
      console.log('Web implementation - cannot send broadcast:', options.action);
      return { success: false };
    }
  }
});

export default BroadcastPlugin;
