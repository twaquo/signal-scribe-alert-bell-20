package io.ionic.starter;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register our custom broadcast plugin
        registerPlugin(BroadcastPlugin.class);
    }
}