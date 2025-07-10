
import { useSignalState } from './useSignalState';
import { useAntidelayManager } from './useAntidelayManager';
import { useSaveTsManager } from './useSaveTsManager';

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
          // Use Capacitor's native Android functionality to send broadcast intent
          const { Capacitor } = (window as any);
          
          // Method 1: Try using Capacitor's native bridge to send intent
          if (Capacitor.Plugins && Capacitor.Plugins.Device) {
            console.log(`${buttonName} Attempting to send broadcast via Capacitor native bridge`);
            
            // Create a custom intent using Capacitor's native bridge
            try {
              await Capacitor.Plugins.Device.sendIntent({
                action: intentAction,
                type: 'broadcast'
              });
              console.log(`${buttonName} ✅ Broadcast intent sent successfully via native bridge: ${intentAction}`);
              return true;
            } catch (bridgeError) {
              console.log(`${buttonName} ❌ Native bridge method failed:`, bridgeError);
            }
          }

          // Method 2: Fallback to using Android WebView interface
          try {
            if ((window as any).Android && (window as any).Android.sendBroadcast) {
              console.log(`${buttonName} Attempting to send broadcast via Android WebView interface`);
              (window as any).Android.sendBroadcast(intentAction);
              console.log(`${buttonName} ✅ Broadcast intent sent successfully via WebView interface: ${intentAction}`);
              return true;
            }
          } catch (webViewError) {
            console.log(`${buttonName} ❌ WebView interface method failed:`, webViewError);
          }

          // Method 3: Use eval to execute native Android code
          try {
            console.log(`${buttonName} Attempting to send broadcast via eval method`);
            const androidCode = `
              try {
                var intent = new android.content.Intent();
                intent.setAction("${intentAction}");
                var context = com.getcapacitor.BridgeActivity.this || activity;
                context.sendBroadcast(intent);
                console.log("${buttonName} ✅ Broadcast sent via eval: ${intentAction}");
              } catch (e) {
                console.log("${buttonName} ❌ Eval method failed: " + e.toString());
              }
            `;
            eval(androidCode);
            return true;
          } catch (evalError) {
            console.log(`${buttonName} ❌ Eval method failed:`, evalError);
          }

          // Method 4: Try using Capacitor's CapacitorHttp or similar plugins
          try {
            console.log(`${buttonName} Attempting to trigger intent via local HTTP call`);
            // This is a fallback that could work if we had a local service
            const response = await fetch(`http://localhost:8080/broadcast?action=${encodeURIComponent(intentAction)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: intentAction })
            });
            if (response.ok) {
              console.log(`${buttonName} ✅ Broadcast sent via local HTTP service: ${intentAction}`);
              return true;
            }
          } catch (httpError) {
            console.log(`${buttonName} ❌ Local HTTP method failed:`, httpError);
          }

          // Method 5: Final fallback - URL scheme (existing method)
          console.log(`${buttonName} Falling back to URL scheme method`);
          const urlScheme = intentAction.replace('com.tasker.', 'tasker://').toLowerCase();
          window.location.href = urlScheme;
          console.log(`${buttonName} 📱 URL scheme sent as fallback: ${urlScheme}`);
          
          console.log(`${buttonName} ⚠️ All native broadcast methods failed. Configure Tasker manually to listen for: ${intentAction}`);
          return false;
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
