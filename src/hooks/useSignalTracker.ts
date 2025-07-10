
import { useSignalState } from './useSignalState';
import { useAntidelayManager } from './useAntidelayManager';
import { useSaveTsManager } from './useSaveTsManager';
import { Capacitor } from '@capacitor/core';
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
    
    try {
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        const platform = (window as any).Capacitor.getPlatform();
        console.log(`${buttonName} Platform detected: ${platform}`);
        
        if (platform === 'android') {
          try {
            console.log(`${buttonName} Using BroadcastPlugin to send broadcast intent`);
            const result = await BroadcastPlugin.sendBroadcast({
              action: intentAction
            });
            
            if (result.success) {
              console.log(`${buttonName} ✅ Broadcast intent sent successfully: ${intentAction}`);
              return true;
            } else {
              console.log(`${buttonName} ❌ BroadcastPlugin failed to send intent`);
              throw new Error('Plugin failed to send broadcast');
            }
          } catch (pluginError) {
            console.log(`${buttonName} ❌ BroadcastPlugin failed:`, pluginError);
            
            // Fallback to URL scheme
            console.log(`${buttonName} Falling back to URL scheme method`);
            const urlScheme = intentAction.replace('com.tasker.', 'tasker://').toLowerCase();
            window.location.href = urlScheme;
            console.log(`${buttonName} 📱 URL scheme sent as fallback: ${urlScheme}`);
            return false;
          }
        } else {
          console.log(`${buttonName} ❌ Not on Android platform, cannot send broadcast intent`);
          return false;
        }
      } else {
        console.log(`${buttonName} ❌ Not on native platform, cannot send broadcast intent`);
        return false;
      }
    } catch (error) {
      console.error(`${buttonName} ❌ Error sending broadcast intent:`, error);
      return false;
    }
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
