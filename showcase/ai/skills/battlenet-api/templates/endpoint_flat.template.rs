use serde::{Deserialize, Serialize};

use crate::dto::<context>::<DtoType>;

/// Endpoint: `/<path>`
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct <EndpointName>Response {
    #[serde(flatten)]
    pub data: <DtoType>,
}
