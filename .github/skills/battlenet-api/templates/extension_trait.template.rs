use async_trait::async_trait;

use crate::{
    client::{ApiResult, BattleNetClient},
    <context>::<EndpointName>Response,
};

#[async_trait]
pub trait <EndpointName>Ext: BattleNetClient {
    async fn get_<endpoint_name>(
        &self,
        param_one: &str,
        param_two: &str,
    ) -> ApiResult<<EndpointName>Response>;
}
