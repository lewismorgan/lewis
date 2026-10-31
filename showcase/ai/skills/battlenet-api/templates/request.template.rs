use std::borrow::Cow;

/// Endpoint: `/<path>`
pub struct <EndpointName>Request {
    pub param_one: String,
    pub param_two: String,
}

impl <EndpointName>Request {
    #[must_use]
    pub fn new(param_one: &str, param_two: &str) -> Self {
        Self {
            param_one: param_one.to_ascii_lowercase(),
            param_two: param_two.to_ascii_lowercase(),
        }
    }
}

impl crate::endpoint::EndpointRequest for <EndpointName>Request {
    fn path(&self) -> Cow<'static, str> {
        Cow::Owned(format!("<path>/{}", self.param_one))
    }

    fn namespace(&self) -> crate::NamespaceType {
        crate::NamespaceType::Profile
    }
}
