import { registerPlugin } from '@capacitor/core';

export interface BroadcastPlugin {
  sendBroadcast(options: { action: string }): Promise<{ success: boolean }>;
}

const BroadcastPlugin = registerPlugin<BroadcastPlugin>('BroadcastPlugin', {
  web: () => import('./BroadcastPluginWeb').then(m => new m.BroadcastPluginWeb()),
});

export default BroadcastPlugin;