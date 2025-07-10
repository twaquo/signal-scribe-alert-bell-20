
package io.ionic.starter;

import android.content.Intent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "BroadcastPlugin")
public class BroadcastPlugin extends Plugin {

    @PluginMethod
    public void sendBroadcast(PluginCall call) {
        String action = call.getString("action");
        
        if (action == null) {
            call.reject("Action is required");
            return;
        }

        try {
            Intent intent = new Intent();
            intent.setAction(action);
            intent.addFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
            getContext().sendBroadcast(intent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            call.reject("Failed to send broadcast", e);
        }
    }
}
