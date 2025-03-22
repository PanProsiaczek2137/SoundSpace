// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Import wymaganych rzeczy
#[cfg(not(target_os = "android"))]
use tauri_plugin_autostart::{init as autostart_init, MacosLauncher};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Zmienna builder musi być mutowalna
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet]);

    #[cfg(not(target_os = "android"))]
    {
        builder = builder.plugin(autostart_init(
            MacosLauncher::LaunchAgent, // Dla macOS (LaunchAgent lub LaunchDaemon)
            Some(vec!["--hidden"]),     // Opcjonalne argumenty (np. start w ukryciu)
        ));
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
