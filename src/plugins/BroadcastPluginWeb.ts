import { WebPlugin } from '@capacitor/core';
import type { BroadcastPlugin } from './BroadcastPlugin';

export class BroadcastPluginWeb extends WebPlugin implements BroadcastPlugin {
  async sendBroadcast(options: { action: string }): Promise<{ success: boolean }> {
    console.log('BroadcastPlugin Web: Cannot send broadcast intent from web platform', options);
    return { success: false };
  }
}