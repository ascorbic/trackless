# Trackless

## Let your users opt-out of Google Analytics

Google Analytics is super-useful, but lots of people don't like being tracked.
The GDPR says that users should be able to choose whether they share personal
information. This script lets you easily give your site visitors a way of
opting-out of Google Analytics tracking. This preference is stored in the
browser's localStorage.

Tracking is disabled by setting `window['ga-disable-GA_TRACKING_ID'] = true;`,
as documented
[here](https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out).
This needs to be done before the Google Analytics call is made, so the script
should be loaded before the Google Analytics script.

### How to use

The script can either be loaded as a module if you are using a bundler, or
directly from a script tag. Make sure you load it before the `ga()` call.

```js
import { Trackless } from "trackless";

new Trackless({ trackingID: "MY_TRACKING_ID" }).bindElements();
```

...or

```html
<input class='trackless' type='button'>
<script src="//unpkg.com/trackless"></script>
<script>
    new Trackless({ trackingID: "MY_TRACKING_ID" }).bindElements();
</script>
```
