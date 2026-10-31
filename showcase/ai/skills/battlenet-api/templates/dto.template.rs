use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct <EntityDto> {
    pub id: u64,
    pub name: String,

    #[serde(rename = "json_field_name")]
    pub rust_field_name: String,
}
