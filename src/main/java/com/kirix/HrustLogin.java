import org.bukkit.plugin.java.JavaPlugin;
import fi.iki.elonen.nanohttpd.NanoHTTPD;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.plugin.PluginManager;

public class HrustLogin extends JavaPlugin {
    private HttpServer httpServer;

    @Override
    public void onEnable() {
        getLogger().info("Плагин HrustLogin автор kirix запущен");
        httpServer = new HttpServer(55568);
        try {
            httpServer.start();
            getLogger().info("HTTP сервер запущен на порту 55568");
        } catch (IOException e) {
            getLogger().severe("Не удалось запустить HTTP сервер: " + e.getMessage());
        }
    }

    @Override
    public void onDisable() {
        httpServer.stop();
        getLogger().info("HTTP сервер остановлен");
    }

    private class HttpServer extends NanoHTTPD {
        public HttpServer(int port) {
            super(port);
        }

        @Override
        public Response serve(IHTTPSession session) {
            String username = session.getParms().get("username");
            if (username != null) {
                Player player = Bukkit.getPlayer(username);
                if (player != null) {
                    return newFixedLengthResponse(Response.Status.OK, "application/json", "{\"status\": \"registered\", \"username\": \"" + username + "\"}");
                } else {
                    return newFixedLengthResponse(Response.Status.NOT_FOUND, "application/json", "{\"status\": \"not_found\"}");
                }
            }
            return newFixedLengthResponse(Response.Status.BAD_REQUEST, "application/json", "{\"status\": \"bad_request\"}");
        }
    }
} 