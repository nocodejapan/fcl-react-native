import qs from 'qs';
import { EmitterSubscription } from 'react-native';
export type QueryParams = qs.ParsedQs;
export type ParsedURL = {
    scheme: string | null;
    hostname: string | null;
    /**
     * The path into the app specified by the URL.
     */
    path: string | null;
    /**
     * The set of query parameters specified by the query string of the url used to open the app.
     */
    queryParams: URLSearchParams | null;
};
export type CreateURLOptions = {
    /**
     * URI protocol `<scheme>://` that must be built into your native app.
     */
    scheme?: string;
    /**
     * An object of parameters that will be converted into a query string.
     */
    queryParams?: QueryParams;
    /**
     * Should the URI be triple slashed `scheme:///path` or double slashed `scheme://path`.
     */
    isTripleSlashed?: boolean;
};
export type EventType = {
    url: string;
    nativeEvent?: MessageEvent;
};
export type URLListener = (event: EventType) => void;
export type NativeURLListener = (nativeEvent: MessageEvent) => void;
export type SendIntentExtras = {
    key: string;
    value: string | number | boolean;
};
/**
 * Helper method for constructing a deep link into your app, given an optional path and set of query
 * parameters. Creates a URI scheme with two slashes by default.
 *
 * The scheme in bare and standalone must be defined in the Expo config (`app.config.js` or `app.json`)
 * under `expo.scheme`.
 *
 * # Examples
 * - Bare: `<scheme>://path` - uses provided scheme or scheme from Expo config `scheme`.
 * - Standalone, Custom: `yourscheme://path`
 * - Web (dev): `https://localhost:19006/path`
 * - Web (prod): `https://myapp.com/path`
 * - Expo Client (dev): `exp://128.0.0.1:19000/--/path`
 * - Expo Client (prod): `exp://exp.host/@yourname/your-app/--/path`
 *
 * @param path Addition path components to append to the base URL.
 * @param namedParameters Additional options object.
 * @return A URL string which points to your app with the given deep link information.
 */
export declare function createURL(path: string, { scheme, queryParams, isTripleSlashed }?: CreateURLOptions): string;
/**
 * Helper method for parsing out deep link information from a URL.
 * @param url A URL that points to the currently running experience (e.g. an output of `Linking.createURL()`).
 * @return A `ParsedURL` object.
 */
export declare function parse(url: string): ParsedURL;
/**
 * Add a handler to `Linking` changes by listening to the `url` event type and providing the handler.
 * It is recommended to use the [`useURL()`](#useurl) hook instead.
 * @param type The only valid type is `'url'`.
 * @param handler An [`URLListener`](#urllistener) function that takes an `event` object of the type
 * [`EventType`](#eventype).
 * @return An EmitterSubscription that has the remove method from EventSubscription
 * @see [React Native Docs Linking page](https://reactnative.dev/docs/linking#addeventlistener).
 */
export declare function addEventListener(type: 'url', handler: URLListener): EmitterSubscription;
/**
 * Attempt to open the given URL with an installed app. See the [Linking guide](/guides/linking)
 * for more information.
 * @param url A URL for the operating system to open, eg: `tel:5555555`, `exp://`.
 * @return A `Promise` that is fulfilled with `true` if the link is opened operating system
 * automatically or the user confirms the prompt to open the link. The `Promise` rejects if there
 * are no applications registered for the URL or the user cancels the dialog.
 */
export declare function openURL(url: string): Promise<true>;
