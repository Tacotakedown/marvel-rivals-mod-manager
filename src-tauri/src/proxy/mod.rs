use std::env;

use dotenv::dotenv;
use reqwest::header::{HeaderMap, HeaderValue, USER_AGENT};
use serde::{Deserialize, Serialize};

const DISCORD_API_BASE: &str = "https://discord.com/api/v10";

#[derive(Debug, Serialize, Deserialize)]
struct DiscordUser {
    id: String,
    username: String,
    avatar: String,
}

#[tauri::command]
pub async fn fetch_discord_user(user_id: String) -> Result<String, String> {
    dotenv().ok().ok_or("Failed to load .env file")?;

    let bot_token =
        env::var("DISCORD_BOT_TOKEN").map_err(|_| "DISCORD_BOT_TOKEN not found in environment")?;
    let client = reqwest::Client::new();

    let mut headers = HeaderMap::new();
    headers.insert(
        USER_AGENT,
        HeaderValue::from_static("DiscordBot (https://tacotakedown.github.io, 1.0.0)"),
    );
    headers.insert(
        "Authorization",
        HeaderValue::from_str(&format!("Bot {}", bot_token)).map_err(|e| e.to_string())?,
    );

    let response = client
        .get(&format!("{}/users/{}", DISCORD_API_BASE, user_id))
        .headers(headers)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let text = response.text().await.map_err(|e| e.to_string())?;
    Ok(text)
}
