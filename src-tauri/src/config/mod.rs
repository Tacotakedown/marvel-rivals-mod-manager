use crate::errors::{ErrorType, ModManagerError};
use rmp_serde::{Deserializer, Serializer};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Emitter, Manager, Runtime};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ModManagerConfig {
    pub game_path: String,
    pub mods_enabled: Vec<String>,
    pub discord_id: String,
}

impl Default for ModManagerConfig {
    fn default() -> Self {
        Self {
            game_path: String::new(),
            mods_enabled: Vec::new(),
            discord_id: String::new(),
        }
    }
}

pub struct ConfigManager {
    config_path: PathBuf,
    config: ModManagerConfig,
}

impl ConfigManager {
    pub fn new<R: Runtime>(app_handle: &AppHandle<R>) -> Result<Self, ModManagerError> {
        let config_path = app_handle
            .path()
            .app_config_dir()
            .map_err(|e| {
                ModManagerError::fatal(format!("Failed to get app config directory: {}", e))
            })?
            .join("config.mrmm");

        if let Some(config_dir) = config_path.parent() {
            fs::create_dir_all(config_dir).map_err(|e| {
                ModManagerError::fatal(format!("Failed to create config directory: {}", e))
            })?;
        }

        let config = if config_path.exists() {
            let data = fs::read(&config_path).map_err(|e| {
                ModManagerError::fatal(format!("Failed to read config file: {}", e))
            })?;
            rmp_serde::from_slice(&data).unwrap_or_default()
        } else {
            ModManagerConfig::default()
        };

        Ok(Self {
            config_path,
            config,
        })
    }

    pub fn save<R: Runtime>(&self, app_handle: &AppHandle<R>) -> Result<(), ModManagerError> {
        let mut buf = Vec::new();
        self.config
            .serialize(&mut Serializer::new(&mut buf))
            .map_err(|e| ModManagerError::fatal(format!("Failed to serialize config: {}", e)))?;

        fs::write(&self.config_path, buf)
            .map_err(|e| ModManagerError::fatal(format!("Failed to write config file: {}", e)))?;

        app_handle
            .emit("config_updated", Some(self.config.clone()))
            .map_err(|e| {
                ModManagerError::fatal(format!("Failed to emit config_updated event: {}", e))
            })?;

        Ok(())
    }

    pub fn setup<R: Runtime>(app_handle: &AppHandle<R>) -> Result<(), ModManagerError> {
        let config_path = app_handle
            .path()
            .app_config_dir()
            .map_err(|e| {
                ModManagerError::fatal(format!("Failed to get app config directory: {}", e))
            })?
            .join("config.mrmm");

        if let Some(config_dir) = config_path.parent() {
            if !config_dir.exists() {
                fs::create_dir_all(config_dir).map_err(|e| {
                    ModManagerError::fatal(format!("Failed to create config directory: {}", e))
                })?;
            }
        }

        if !config_path.exists() {
            let default_config = ModManagerConfig::default();
            let mut buf = Vec::new();
            default_config
                .serialize(&mut Serializer::new(&mut buf))
                .map_err(|e| {
                    ModManagerError::fatal(format!("Failed to serialize default config: {}", e))
                })?;

            fs::write(&config_path, buf).map_err(|e| {
                ModManagerError::fatal(format!("Failed to write initial config file: {}", e))
            })?;
        }

        Ok(())
    }

    pub fn get_config(&self) -> &ModManagerConfig {
        &self.config
    }

    pub fn set_game_path<R: Runtime>(
        &mut self,
        app_handle: &AppHandle<R>,
        game_path: String,
    ) -> Result<(), ModManagerError> {
        self.config.game_path = game_path;
        self.save(app_handle)
    }

    pub fn set_discord_id<R: Runtime>(
        &mut self,
        app_handle: &AppHandle<R>,
        discord_id: String,
    ) -> Result<(), ModManagerError> {
        self.config.discord_id = discord_id;
        self.save(app_handle)
    }

    pub fn add_enabled_mod<R: Runtime>(
        &mut self,
        app_handle: &AppHandle<R>,
        mod_id: String,
    ) -> Result<(), ModManagerError> {
        if !self.config.mods_enabled.contains(&mod_id) {
            self.config.mods_enabled.push(mod_id);
            self.save(app_handle)?;
        }
        Ok(())
    }

    pub fn remove_enabled_mod<R: Runtime>(
        &mut self,
        app_handle: &AppHandle<R>,
        mod_id: &str,
    ) -> Result<(), ModManagerError> {
        self.config.mods_enabled.retain(|m| m != mod_id);
        self.save(app_handle)
    }
}

#[tauri::command]
pub async fn get_config<R: Runtime>(
    app_handle: AppHandle<R>,
) -> Result<ModManagerConfig, ModManagerError> {
    let config_manager = ConfigManager::new(&app_handle)?;
    Ok(config_manager.get_config().clone())
}

#[tauri::command]
pub async fn update_game_path<R: Runtime>(
    app_handle: AppHandle<R>,
    path: String,
) -> Result<(), ModManagerError> {
    let mut config_manager = ConfigManager::new(&app_handle)?;
    Ok(config_manager.set_game_path(&app_handle, path)?)
}

#[tauri::command]
pub async fn toggle_mod<R: Runtime>(
    app_handle: AppHandle<R>,
    mod_id: String,
    enabled: bool,
) -> Result<(), ModManagerError> {
    let mut config_manager = ConfigManager::new(&app_handle)?;
    if enabled {
        config_manager.add_enabled_mod(&app_handle, mod_id)
    } else {
        config_manager.remove_enabled_mod(&app_handle, &mod_id)
    }
}

#[tauri::command]
pub async fn set_discord_id<R: Runtime>(
    app_handle: AppHandle<R>,
    discord_id: String,
) -> Result<(), ModManagerError> {
    let mut config_manager = ConfigManager::new(&app_handle)?;
    Ok(config_manager.set_discord_id(&app_handle, discord_id)?)
}
