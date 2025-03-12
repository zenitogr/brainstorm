#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use tauri::State;

#[tauri::command]
fn get_api_key(provider: &str) -> Result<String, String> {
    match provider {
        "gemini" => env::var("GEMINI_API_KEY")
            .map_err(|_| "GEMINI_API_KEY not found".to_string()),
        "groq" => env::var("GROQ_API_KEY")
            .map_err(|_| "GROQ_API_KEY not found".to_string()),
        _ => Err("Invalid provider".to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_api_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
