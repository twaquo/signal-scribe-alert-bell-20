import { useSignalState } from './useSignalState';
import { useAntidelayManager } from './useAntidelayManager';
import { useSaveTsManager } from './useSaveTsManager';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import BroadcastPlugin from '../plugins/BroadcastPlugin';

export const useSignalTracker = () => {
  const {
    signalsText,
    setSignalsText,
    savedSignals,
    antidelaySeconds,
    setAntidelaySeconds,
    saveButtonPressed,
    handleSaveSignals,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    handleClear
  } = useSignalState();

  const {
    showAntidelayDialog,
    antidelayInput,
    setAntidelayInput,
    handleAntidelaySubmit,
    handleAntidelayCancel
  } = useAntidelayManager(savedSignals, antidelaySeconds, setAntidelaySeconds);

  const {
    showSaveTsDialog,
    antidelayInput: saveTsAntidelayInput,
    setAntidelayInput: setSaveTsAntidelayInput,
    saveTsButtonPressed,
    handleSaveTsMouseDown,
    handleSaveTsMouseUp,
    handleSaveTsMouseLeave,
    handleSaveTsSubmit: originalHandleSaveTsSubmit,
    handleSaveTsCancel
  } = useSaveTsManager();

  // Wrapper functions to pass signalsText to handlers
  const handleSaveTsMouseDownWithSignals = (e: React.MouseEvent | React.TouchEvent) => {
    handleSaveTsMouseDown(e);
  };

  const handleSaveTsMouseUpWithSignals = (e: React.MouseEvent | React.TouchEvent) => {
    handleSaveTsMouseUp(e, signalsText);
  };

  // Helper function to send Android broadcast intent
  const sendBroadcastIntent = async (intentAction: string, buttonName: string) => {
    console.log(`${buttonName} Attempting to send broadcast intent: ${intentAction}`);
    
    if (!Capacitor.isNativePlatform()) {
      console.log(`${buttonName} ❌ Not on native platform, cannot send broadcast intent`);
      return false;
    }

    const platform = Capacitor.getPlatform();
    console.log(`${buttonName} Platform detected: ${platform}`);
    
    if (platform !== 'android') {
      console.log(`${buttonName} ❌ Not on Android platform, cannot send broadcast intent`);
      return false;
    }

    // Method 1: Try using custom Capacitor BroadcastPlugin
    try {
      console.log(`${buttonName} Attempting to send broadcast via Capacitor BroadcastPlugin`);
      const result = await BroadcastPlugin.sendBroadcast({ action: intentAction });
      if (result.success) {
        console.log(`${buttonName} ✅ Broadcast intent sent successfully via BroadcastPlugin: ${intentAction}`);
        return true;
      }
    } catch (pluginError) {
      console.log(`${buttonName} ❌ BroadcastPlugin method failed:`, pluginError);
    }

    // Method 2: Try using Capacitor App plugin to open external app
    try {
      console.log(`${buttonName} Attempting to send broadcast via Capacitor App plugin`);
      const urlScheme = `intent://${intentAction}#Intent;scheme=broadcast;end`;
      await App.openUrl({ url: urlScheme });
      console.log(`${buttonName} ✅ Broadcast intent sent via App plugin: ${intentAction}`);
      return true;
    } catch (appError) {
      console.log(`${buttonName} ❌ App plugin method failed:`, appError);
    }

    // Method 3: Try using direct intent URL scheme
    try {
      console.log(`${buttonName} Attempting to send broadcast via intent URL scheme`);
      const intentUrl = `intent://broadcast/${intentAction}#Intent;scheme=broadcast;action=${intentAction};end`;
      window.location.href = intentUrl;
      console.log(`${buttonName} ✅ Broadcast intent sent via intent URL: ${intentAction}`);
      return true;
    } catch (intentError) {
      console.log(`${buttonName} ❌ Intent URL method failed:`, intentError);
    }

    // Method 4: Fallback to Tasker-specific URL scheme
    try {
      console.log(`${buttonName} Attempting Tasker-specific URL scheme`);
      const taskerUrl = intentAction.replace('com.tasker.', 'tasker://').toLowerCase();
      window.location.href = taskerUrl;
      console.log(`${buttonName} ✅ Tasker URL scheme sent: ${taskerUrl}`);
      return true;
    } catch (taskerError) {
      console.log(`${buttonName} ❌ Tasker URL scheme failed:`, taskerError);
    }

    console.log(`${buttonName} ⚠️ All broadcast methods failed. Configure Tasker manually to listen for: ${intentAction}`);
    return false;
  };

  const handleRingOff = async () => {
    console.log('🔴 Ring Off button clicked - Starting function');
    const success = await sendBroadcastIntent('com.tasker.RING_OFF', '🔴');
    
    if (!success) {
      console.log('🔴 ⚠️ IMPORTANT: Configure Tasker to listen for broadcast intent: com.tasker.RING_OFF');
      console.log('🔴 📋 Tasker Setup Instructions:');
      console.log('🔴 1. Create new Profile in Tasker');
      console.log('🔴 2. Add Context: Event -> System -> Intent Received');
      console.log('🔴 3. Set Action to: com.tasker.RING_OFF');
      console.log('🔴 4. Add your desired task (e.g., turn off ringer)');
    }
    
    console.log('🔴 Ring Off function completed');
  };

  const handleScreenOff = async () => {
    console.log('📱 Screen Off button clicked - Starting function');
    const success = await sendBroadcastIntent('com.tasker.SCREEN_OFF', '📱');
    
    if (!success) {
      console.log('📱 ⚠️ IMPORTANT: Configure Tasker to listen for broadcast intent: com.tasker.SCREEN_OFF');
      console.log('📱 📋 Tasker Setup Instructions:');
      console.log('📱 1. Create new Profile in Tasker');
      console.log('📱 2. Add Context: Event -> System -> Intent Received');
      console.log('📱 3. Set Action to: com.tasker.SCREEN_OFF');
      console.log('📱 4. Add your desired task (e.g., turn off screen)');
    }
    
    console.log('📱 Screen Off function completed');
  };

  return {
    signalsText,
    setSignalsText,
    saveButtonPressed,
    saveTsButtonPressed,
    showAntidelayDialog,
    antidelayInput,
    setAntidelayInput,
    antidelaySeconds,
    showSaveTsDialog,
    saveTsAntidelayInput,
    setSaveTsAntidelayInput,
    handleSaveSignals,
    handleSaveTsMouseDown: handleSaveTsMouseDownWithSignals,
    handleSaveTsMouseUp: handleSaveTsMouseUpWithSignals,
    handleSaveTsMouseLeave,
    handleSaveTsSubmit: originalHandleSaveTsSubmit,
    handleSaveTsCancel,
    handleAntidelaySubmit,
    handleAntidelayCancel,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    handleClear,
    handleRingOff,
    handleScreenOff
  };
};
