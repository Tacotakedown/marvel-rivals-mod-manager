use serde::ser::StdError;
use serde::{Deserialize, Serialize};
use std::cmp::PartialEq;
use std::fmt::{Display, Formatter};

#[derive(Debug, Serialize, Deserialize)]
pub enum ErrorType {
    Fatal,
    NonFatal,
    Warning,
    Info,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ModManagerError {
    pub message: String,
    pub error_type: ErrorType,
}

impl PartialEq for ErrorType {
    fn eq(&self, other: &Self) -> bool {
        matches!(
            (self, other),
            (Self::Fatal, Self::Fatal)
                | (Self::NonFatal, Self::NonFatal)
                | (Self::Warning, Self::Warning)
                | (Self::Info, Self::Info)
        )
    }
}

impl ModManagerError {
    pub fn new(message: String, error_type: ErrorType) -> Self {
        Self {
            message,
            error_type,
        }
    }

    pub fn fatal(message: String) -> Self {
        Self::new(message, ErrorType::Fatal)
    }

    pub fn non_fatal(message: String) -> Self {
        Self::new(message, ErrorType::NonFatal)
    }

    pub fn warning(message: String) -> Self {
        Self::new(message, ErrorType::Warning)
    }

    pub fn info(message: String) -> Self {
        Self::new(message, ErrorType::Info)
    }

    pub fn is_fatal(&self) -> bool {
        self.error_type == ErrorType::Fatal
    }

    pub fn is_non_fatal(&self) -> bool {
        self.error_type == ErrorType::NonFatal
    }

    pub fn is_warning(&self) -> bool {
        self.error_type == ErrorType::Warning
    }

    pub fn is_info(&self) -> bool {
        self.error_type == ErrorType::Info
    }

    pub fn is_error(&self) -> bool {
        self.is_fatal() || self.is_non_fatal()
    }

    pub fn is_warning_or_info(&self) -> bool {
        self.is_warning() || self.is_info()
    }
}

impl Display for ModManagerError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl StdError for ModManagerError {
    fn description(&self) -> &str {
        &self.message
    }
}
