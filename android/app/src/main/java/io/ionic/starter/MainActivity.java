
package io.ionic.starter;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register the BroadcastPlugin
        registerPlugin(BroadcastPlugin.class);
    }
}
