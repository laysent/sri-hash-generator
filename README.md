# Subresource Integrity (SRI) Generator

Progressive Web Application (PWA) that will generate `integrity` based on given resource. Either
enter the link of resource or drop a local file to calculate it's hash value that can be used as
`integrity` attribute.

Works offline.

Notice: if online link is provided, fetching resource should not be blocked due to cross-domain,
otherwise `integrity` hash cannot be generated correctly.

## Links

Following links might be helpful understanding `SRI`:

+ [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
+ [Demo Page](https://laysent.github.io/subresource-integrity-demo/index.html)
