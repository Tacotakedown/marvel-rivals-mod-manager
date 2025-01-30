// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_init;
mod config;
mod errors;
mod proxy;

use crate::app_init::init_mod_manager;
use crate::config::{get_config, set_discord_id, toggle_mod, update_game_path, ConfigManager};
use crate::proxy::fetch_discord_user;

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            ConfigManager::setup(app.handle())?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            init_mod_manager,
            toggle_mod,
            update_game_path,
            get_config,
            fetch_discord_user,
            set_discord_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run()
}
