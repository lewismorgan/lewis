use async_trait::async_trait;

use crate::client::ApiResult;

#[async_trait]
impl<T: crate::client::BattleNetClient + ?Sized> super::traits::<EndpointName>Ext for T {
    async fn get_<endpoint_name>(
        &self,
        param_one: &str,
        param_two: &str,
    ) -> ApiResult<crate::<context>::<EndpointName>Response> {
        let request = crate::<context>::<EndpointName>Request::new(param_one, param_two);
        self.request(&request).await
    }
}
