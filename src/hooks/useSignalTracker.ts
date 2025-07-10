
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


  const handleRingOff = async () => {
    console.log('🔴 Ring Off button clicked - Starting function');
    
    try {
      console.log('🔴 Checking Capacitor availability...');
      console.log('🔴 Window.Capacitor exists:', !!(window as any).Capacitor);
      console.log('🔴 Is native platform:', (window as any).Capacitor?.isNativePlatform?.());
      console.log('🔴 Platform:', (window as any).Capacitor?.getPlatform?.());
      
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        if ((window as any).Capacitor.getPlatform() === 'android') {
          console.log('🔴 Android platform detected - attempting to send URL scheme');
          console.log('🔴 URL scheme being sent: tasker://ringoff');
          
          // Try URL scheme approach for Tasker
          window.location.href = 'tasker://ringoff';
          console.log('🔴 URL scheme sent successfully');
          
          // Also log the broadcast intent name for Tasker configuration
          console.log('🔴 Alternative: Configure Tasker to listen for broadcast intent: com.tasker.RING_OFF');
        } else {
          console.log('🔴 Not Android platform');
        }
      } else {
        console.log('🔴 Web environment - Not on mobile device');
        console.log('🔴 For Tasker: Use broadcast intent com.tasker.RING_OFF');
      }
    } catch (error) {
      console.error('🔴 Error in Ring Off handler:', error);
    }
    
    console.log('🔴 Ring Off function completed');
  };

  const handleScreenOff = async () => {
    console.log('📱 Screen Off button clicked - Starting function');
    
    try {
      console.log('📱 Checking Capacitor availability...');
      console.log('📱 Window.Capacitor exists:', !!(window as any).Capacitor);
      console.log('📱 Is native platform:', (window as any).Capacitor?.isNativePlatform?.());
      console.log('📱 Platform:', (window as any).Capacitor?.getPlatform?.());
      
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        if ((window as any).Capacitor.getPlatform() === 'android') {
          console.log('📱 Android platform detected - attempting to send URL scheme');
          console.log('📱 URL scheme being sent: tasker://screenoff');
          
          // Try URL scheme approach for Tasker
          window.location.href = 'tasker://screenoff';
          console.log('📱 URL scheme sent successfully');
          
          // Also log the broadcast intent name for Tasker configuration
          console.log('📱 Alternative: Configure Tasker to listen for broadcast intent: com.tasker.SCREEN_OFF');
        } else {
          console.log('📱 Not Android platform');
        }
      } else {
        console.log('📱 Web environment - Not on mobile device');
        console.log('📱 For Tasker: Use broadcast intent com.tasker.SCREEN_OFF');
      }
    } catch (error) {
      console.error('📱 Error in Screen Off handler:', error);
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

