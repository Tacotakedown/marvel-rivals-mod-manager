use crate::config::ConfigManager;
use crate::errors::{ErrorType, ModManagerError};
use tauri::{AppHandle, Runtime};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};
#[tauri::command]
pub fn init_mod_manager<R: Runtime>(app: AppHandle<R>) -> Result<(), ModManagerError> {
    let app_clone = app.clone();
    app.dialog()
        .message("Please select the location of your Marvel Rivals installation.")
        .title("Welcome to the Marvel Rivals Mod Manager!")
        .buttons(MessageDialogButtons::OkCancelCustom(
            "Continue".to_string(),
            "Cancel".to_string(),
        ))
        .show(move |result| match result {
            true => {
                game_select_dialog(&app_clone).unwrap();
            }
            false => println!("User Selected Cancel"),
        });

    Ok(())
}

fn game_select_dialog<R: Runtime>(app: &AppHandle<R>) -> Result<(), ModManagerError> {
    let app_clone = app.clone();

    app.dialog().file().pick_folder(move |file_path| {
        if let Some(file_path) = file_path {
            match ConfigManager::new(&app_clone) {
                Ok(mut config_manager) => {
                    if let Err(e) = config_manager.set_game_path(&app_clone, file_path.to_string())
                    {
                        eprintln!("Failed to set game path: {}", e);
                    }
                }
                Err(e) => eprintln!("Error creating ConfigManager: {}", e),
            }
        }
    });
    Ok(())
}
