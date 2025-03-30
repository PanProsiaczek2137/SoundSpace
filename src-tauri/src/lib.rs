// Import wymaganych rzeczy
#[cfg(not(target_os = "android"))]
use tauri_plugin_autostart::{init as autostart_init, MacosLauncher};
//use std::fs::File;
//use std::io::Read;
//use std::path::Path;
//use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_keep_screen_on::init())
        .invoke_handler(tauri::generate_handler![greet]);
        //.invoke_handler(tauri::generate_handler![add_song_to_player]);

    // BLEC tylko na Androidzie
    #[cfg(target_os = "android")]
    {
        builder = builder.plugin(tauri_plugin_blec::init());
    }

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

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/* 
// Komenda dla frontendu, która dodaje plik do odtwarzacza
#[tauri::command]
fn add_song_to_player(filePath: String) -> String {
    println!("Próba dodania pliku: {}", filePath);
    if !Path::new(&filePath).exists() {
        return format!("Błąd: Plik nie istnieje - {}", filePath);
    }

    match File::open(&filePath) {
        Ok(mut file) => {
            let mut contents = Vec::new();
            if let Err(e) = file.read_to_end(&mut contents) {
                return format!("Błąd podczas odczytu pliku: {}", e);
            }
            format!("Plik dodany do odtwarzacza: {}", filePath)
        }
        Err(e) => format!("Błąd podczas otwierania pliku: {}", e),
    }
}
*/