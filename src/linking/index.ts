import qs from 'qs';
import { EmitterSubscription, Linking as NativeLinking, Platform } from 'react-native';

// @docsMissing
export type QueryParams = qs.ParsedQs;

// @needsAudit @docsMissing
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

// @needsAudit
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

// @docsMissing
export type EventType = {
  url: string;
  nativeEvent?: MessageEvent;
};

// @docsMissing
export type URLListener = (event: EventType) => void;

// @docsMissing
export type NativeURLListener = (nativeEvent: MessageEvent) => void;

// @docsMissing
export type SendIntentExtras = { key: string; value: string | number | boolean };


function validateURL(url: string): void {
  if(typeof url !== 'string'){
    throw new Error('Invalid URL: should be a string. Was: ' + url)
  }
  if(!url){
    throw new Error('Invalid URL: cannot be empty')
  }
}

function getHostUri(): string | null {
  // if (Constants.expoConfig?.hostUri) {
  //   return Constants.expoConfig.hostUri;
  // } else if (!hasCustomScheme()) {
  //   // we're probably not using up-to-date xdl, so just fake it for now
  //   // we have to remove the /--/ on the end since this will be inserted again later
  //   return removeScheme(Constants.linkingUri).replace(/\/--($|\/.*$)/, '');
  // } else {
  //   return null;
  // }
  // TODO
  return ""
}

function removeScheme(url: string): string {
  return url.replace(/^[a-zA-Z0-9+.-]+:\/\//, '');
}

function removePort(url: string): string {
  return url.replace(/(?=([a-zA-Z0-9+.-]+:\/\/)?[^/]):\d+/, '');
}

function removeLeadingSlash(url: string): string {
  return url.replace(/^\//, '');
}

function removeTrailingSlashAndQueryString(url: string): string {
  return url.replace(/\/?\?.*$/, '');
}

function ensureTrailingSlash(input: string, shouldAppend: boolean): string {
  const hasSlash = input.endsWith('/');
  if (hasSlash && !shouldAppend) {
    return input.substring(0, input.length - 1);
  } else if (!hasSlash && shouldAppend) {
    return `${input}/`;
  }
  return input;
}

function ensureLeadingSlash(input: string, shouldAppend: boolean): string {
  const hasSlash = input.startsWith('/');
  if (hasSlash && !shouldAppend) {
    return input.substring(1);
  } else if (!hasSlash && shouldAppend) {
    return `/${input}`;
  }
  return input;
}

// @needsAudit
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
export function createURL(
  path: string,
  { scheme, queryParams = {}, isTripleSlashed = false }: CreateURLOptions = {}
): string {
  if (Platform.OS === 'web') {
    // if (!Platform.isDOMAvailable) return '';

    const origin = ensureTrailingSlash(window.location.origin, false);
    let queryString = qs.stringify(queryParams);
    if (queryString) {
      queryString = `?${queryString}`;
    }

    let outputPath = path;
    if (outputPath) outputPath = ensureLeadingSlash(path, true);

    return encodeURI(`${origin}${outputPath}${queryString}`);
  }

  // const resolvedScheme = resolveScheme({ scheme });
  const resolvedScheme = ''

  let hostUri = getHostUri() || '/';

  // if (hasCustomScheme() && isExpoHosted()) {
  //   hostUri = '';
  // }

  // if (path) {
  //   if (isExpoHosted() && hostUri) {
  //     path = `/--/${removeLeadingSlash(path)}`;
  //   }
  //   if (isTripleSlashed && !path.startsWith('/')) {
  //     path = `/${path}`;
  //   }
  // } else {
  //   path = '';
  // }

  // merge user-provided query params with any that were already in the hostUri
  // e.g. release-channel
  let queryString = '';
  const queryStringMatchResult = hostUri.match(/(.*)\?(.+)/);
  if (queryStringMatchResult) {
    hostUri = queryStringMatchResult[1];
    queryString = queryStringMatchResult[2];
    let paramsFromHostUri = {};
    try {
      const parsedParams = qs.parse(queryString);
      if (typeof parsedParams === 'object') {
        paramsFromHostUri = parsedParams;
      }
    } catch {}
    queryParams = {
      ...queryParams,
      ...paramsFromHostUri,
    };
  }
  queryString = qs.stringify(queryParams);
  if (queryString) {
    queryString = `?${queryString}`;
  }

  hostUri = ensureLeadingSlash(hostUri, !isTripleSlashed);

  return encodeURI(
    `${scheme}:${isTripleSlashed ? '/' : ''}/${hostUri}${path}${queryString}`
  );
}

// @needsAudit
/**
 * Helper method for parsing out deep link information from a URL.
 * @param url A URL that points to the currently running experience (e.g. an output of `Linking.createURL()`).
 * @return A `ParsedURL` object.
 */
export function parse(url: string): ParsedURL {
  validateURL(url);

  const parsed = new URL(url);

  // for (const param in parsed.searchParams) {
  //   parsed.query[param] = decodeURIComponent(parsed.query[param]!);
  // }
  const queryParams = parsed.searchParams;

  // const hostUri = getHostUri() || '';
  // const hostUriStripped = removePort(removeTrailingSlashAndQueryString(hostUri));

  let path = parsed.pathname || null;
  let hostname = parsed.hostname || null;
  let scheme = parsed.protocol || null;

  if (scheme) {
    // Remove colon at end
    scheme = scheme.substring(0, scheme.length - 1);
  }

  // if (path) {
  //   path = removeLeadingSlash(path);

  //   let expoPrefix: string | null = null;
  //   if (hostUriStripped) {
  //     const parts = hostUriStripped.split('/');
  //     expoPrefix = parts.slice(1).concat(['--/']).join('/');
  //   }

  //   if (isExpoHosted() && !hasCustomScheme() && expoPrefix && path.startsWith(expoPrefix)) {
  //     path = path.substring(expoPrefix.length);
  //     hostname = null;
  //   } else if (path.indexOf('+') > -1) {
  //     path = path.substring(path.indexOf('+') + 1);
  //   }
  // }

  return {
    hostname,
    path,
    queryParams,
    scheme,
  };
}

// @needsAudit
/**
 * Add a handler to `Linking` changes by listening to the `url` event type and providing the handler.
 * It is recommended to use the [`useURL()`](#useurl) hook instead.
 * @param type The only valid type is `'url'`.
 * @param handler An [`URLListener`](#urllistener) function that takes an `event` object of the type
 * [`EventType`](#eventype).
 * @return An EmitterSubscription that has the remove method from EventSubscription
 * @see [React Native Docs Linking page](https://reactnative.dev/docs/linking#addeventlistener).
 */
export function addEventListener(type: 'url', handler: URLListener): EmitterSubscription {
  return NativeLinking.addEventListener(type, handler);
}

// @needsAudit
/**
 * Attempt to open the given URL with an installed app. See the [Linking guide](/guides/linking)
 * for more information.
 * @param url A URL for the operating system to open, eg: `tel:5555555`, `exp://`.
 * @return A `Promise` that is fulfilled with `true` if the link is opened operating system
 * automatically or the user confirms the prompt to open the link. The `Promise` rejects if there
 * are no applications registered for the URL or the user cancels the dialog.
 */
export async function openURL(url: string): Promise<true> {
  validateURL(url);
  return await NativeLinking.openURL(url);
}