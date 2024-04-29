import { URL as URL$1, FCL_REDIRECT_URL_PARAM_NAME, buildMessageHandler, FCL_RESPONSE_PARAM_NAME, normalizePollingResponse, CORE_STRATEGIES, getExecHttpPost, getMutate, getCurrentUser, initServiceRegistry, setIsReactNative } from '@onflow/fcl-core';
export { AppUtils, InteractionTemplateUtils, TestUtils, VERSION, WalletUtils, account, arg, args, atBlockHeight, atBlockId, authorization, authorizations, block, build, cadence, cdc, config, createSignableVoucher, decode, discovery, display, events, getAccount, getBlock, getBlockHeader, getChainId, getCollection, getEvents, getEventsAtBlockHeightRange, getEventsAtBlockIds, getNetworkParameters, getNodeVersionInfo, getTransaction, getTransactionStatus, invariant, isBad, isOk, limit, nodeVersionInfo, param, params, payer, ping, pipe, pluginRegistry, proposer, query, ref, sansPrefix, script, send, serialize, subscribeEvents, t, transaction, tx, validator, verifyUserSignatures, voucherIntercept, voucherToTxId, why, withPrefix } from '@onflow/fcl-core';
import { config } from '@onflow/config';
import { useState, useEffect, createElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking, Platform, NativeModules, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebBrowser from '@toruslabs/react-native-web-browser';
import qs from 'qs';

/**
 * @typedef {import("@onflow/typedefs").Service} Service
 */

/**
 * Fetches data from a URL using the POST method and returns the parsed JSON response.
 *
 * @param {string} url - The URL to fetch.
 * @param {object} opts - Additional options for the fetch request.
 * @returns {Promise<object>} - A promise that resolves to the parsed JSON response.
 */
const fetcher = (url, opts) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(opts)
  }).then(d => d.json());
};

/**
 * Default loading component that renders the "Loading..." text.
 *
 * @returns {JSX.Element} - The loading component.
 */
const DefaultLoadingComponent = () => createElement(Text, null, "Loading...");

/**
 * Default empty component that renders the "No Wallets Found" text.
 *
 * @returns {JSX.Element} - The empty component.
 */
const DefaultEmptyComponent = () => createElement(Text, null, "No Wallets Found");

/**
 * Default service card component that renders a TouchableOpacity with the service provider's name as text.
 *
 * @param {object} props - The component props.
 * @param {Service} props.service - The service object.
 * @param {Function} props.onPress - The onPress event handler.
 * @returns {JSX.Element} - The service card component.
 */
const DefaultServiceCard = _ref => {
  let {
    service,
    onPress
  } = _ref;
  return createElement(TouchableOpacity, {
    onPress
  }, createElement(Text, null, service?.provider?.name));
};

/**
 * Default wrapper component that renders a View with the specified style and children components.
 *
 * @param {object} props - The component props.
 * @param {JSX.Element[]} props.children - The children components.
 * @returns {JSX.Element} - The wrapper component.
 */
const DefaultWrapper = _ref2 => {
  let {
    children
  } = _ref2;
  return createElement(View, {
    style: styles.container
  }, ...children);
};

/**
 * Custom hook for service discovery.
 *
 * @param {object} params - The hook parameters.
 * @param {object} params.fcl - The fcl instance.
 * @returns {object} - The service discovery result object.
 * @property {object[]} services - The discovered services.
 * @property {boolean} isLoading - A flag indicating whether the services are being loaded.
 * @property {Function} authenticateService - A function to authenticate a service.
 */
const useServiceDiscovery = _ref3 => {
  let {
    fcl
  } = _ref3;
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getServices = async () => {
    setIsLoading(true);
    const endpoint = await fcl.config.get("discovery.authn.endpoint");
    try {
      const response = await fetcher(endpoint, {
        fclVersion: fcl.VERSION,
        userAgent: 'ReactNative',
        supportedStrategies: ['HTTP/POST']
      });
      setServices(response);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getServices();
  }, []);

  /**
   * Authenticates the provided service using the fcl instance.
   *
   * @param {object} service - The service object to authenticate.
   */
  const authenticateService = service => {
    if (services.includes(service)) {
      fcl.authenticate({
        service
      });
    }
  };
  return {
    services,
    isLoading,
    authenticateService
  };
};

/**
 * Component for service discovery.
 *
 * @param {object} props - The component props.
 * @param {object} props.fcl - The fcl instance.
 * @param {Function} [props.Loading=DefaultLoadingComponent] - The loading component.
 * @param {Function} [props.Empty=DefaultEmptyComponent] - The empty component.
 * @param {Function} [props.ServiceCard=DefaultServiceCard] - The service card component.
 * @param {Function} [props.Wrapper=DefaultWrapper] - The wrapper component.
 * @returns {JSX.Element} - The service discovery component.
 */
const ServiceDiscovery = _ref4 => {
  let {
    fcl,
    Loading = DefaultLoadingComponent,
    Empty = DefaultEmptyComponent,
    ServiceCard = DefaultServiceCard,
    Wrapper = DefaultWrapper
  } = _ref4;
  const {
    services,
    isLoading,
    authenticateService
  } = useServiceDiscovery({
    fcl
  });
  return createElement(Wrapper, null, isLoading && createElement(Loading), !isLoading && services.length === 0 && createElement(Empty), !isLoading && services.map((service, index) => {
    return createElement(ServiceCard, {
      key: service?.provider?.address ?? index,
      service,
      onPress: () => {
        authenticateService(service);
      }
    });
  }));
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const getAsyncStorage = () => {
  try {
    const ASYNC_STORAGE = {
      can: true,
      get: async key => JSON.parse(await AsyncStorage.getItem(key)),
      put: async (key, value) => await AsyncStorage.setItem(key, JSON.stringify(value))
    };
    return ASYNC_STORAGE;
  } catch (error) {
    return null;
  }
};
const getDefaultConfig = () => {
  return {
    "discovery.wallet.method.default": "DEEPLINK/RPC",
    "fcl.storage.default": getAsyncStorage()
  };
};

// @docsMissing

// @needsAudit @docsMissing

// @needsAudit

// @docsMissing

// @docsMissing

// @docsMissing

// @docsMissing

function validateURL(url) {
  if (typeof url !== 'string') {
    throw new Error('Invalid URL: should be a string. Was: ' + url);
  }
  if (!url) {
    throw new Error('Invalid URL: cannot be empty');
  }
}
function ensureTrailingSlash(input, shouldAppend) {
  const hasSlash = input.endsWith('/');
  if (hasSlash && !shouldAppend) {
    return input.substring(0, input.length - 1);
  } else if (!hasSlash && shouldAppend) {
    return `${input}/`;
  }
  return input;
}
function ensureLeadingSlash(input, shouldAppend) {
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
function createURL(path) {
  let {
    scheme,
    queryParams = {},
    isTripleSlashed = false
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
  let hostUri = '';

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
      ...paramsFromHostUri
    };
  }
  queryString = qs.stringify(queryParams);
  if (queryString) {
    queryString = `?${queryString}`;
  }
  hostUri = ensureLeadingSlash(hostUri, !isTripleSlashed);
  return encodeURI(`${scheme}:${isTripleSlashed ? '/' : ''}/${hostUri}${path}${queryString}`);
}

// @needsAudit
/**
 * Helper method for parsing out deep link information from a URL.
 * @param url A URL that points to the currently running experience (e.g. an output of `Linking.createURL()`).
 * @return A `ParsedURL` object.
 */
function parse(url) {
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
    scheme
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
function addEventListener(type, handler) {
  return Linking.addEventListener(type, handler);
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
async function openURL(url) {
  validateURL(url);
  return await Linking.openURL(url);
}

/**
 *
 * @param {URL} src
 * @param {object} opts
 * @returns {[object, () => void]}
 */
function renderBrowser(src) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    SCHEME_DEEP_LINK_APP
  } = NativeModules?.ReactNativeConfigModule || {};
  const redirectUrl = createURL("$$fcl_auth_callback$$", {
    scheme: SCHEME_DEEP_LINK_APP,
    queryParams: {}
  });
  const url = new URL$1(src.toString());
  url.searchParams.append(FCL_REDIRECT_URL_PARAM_NAME, redirectUrl);
  const webbrowser = WebBrowser.openAuthSessionAsync(url.toString());
  const unmount = () => {
    try {
      WebBrowser.dismissAuthSession();
    } catch (error) {
      console.log(error);
    }
  };

  // Call onClose when the webbrowser is closed
  webbrowser.then(() => {
    if (opts?.onClose) {
      opts.onClose();
    }
  });
  return [webbrowser, unmount];
}

/**
 * Renders a deeplink view (i.e. deep links to a wallet app)
 *
 * @param {URL} src
 * @param {object} opts
 * @param {() => void} [opts.onClose]
 * @returns {[null, () => void]}
 */
function renderDeeplink(src) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const url = new URL$1(src.toString());

  // Custom schemes (i.e mywallet://) are not supported for
  // security reasons. These schemes can be hijacked by malicious
  // apps and impersonate the wallet.
  //
  // Wallet developers should register a universal link instead.
  // (i.e https://mywallet.com/ or https://link.mywallet.com/)
  //
  // Additionally this allows the wallet to redirect to the app
  // store/show custom web content if the wallet is not installed.
  if (url.protocol !== "https:") {
    throw new Error("Deeplink must be https scheme.  Custom schemes are not supported, please use a universal link/app link instead.");
  }

  // Link to the target url
  openURL(url.toString());
  const onClose = opts.onClose || (() => {});
  const onAppStateChange = state => {
    if (state === "active") {
      unmount();
      onClose();
    }
  };
  AppState.addEventListener("change", onAppStateChange);
  const unmount = () => {
    AppState.removeEventListener("change", onAppStateChange);
  };
  return [null, unmount];
}

const NOT_IMPLEMENTED = strategy => () => {
  throw new Error(`${strategy} Strategy util has not been implemented on this platform`);
};
const VIEWS = {
  "VIEW/IFRAME": NOT_IMPLEMENTED("VIEW/IFRAME"),
  "VIEW/POP": NOT_IMPLEMENTED("VIEW/IFRAME"),
  "VIEW/TAB": NOT_IMPLEMENTED("VIEW/TAB"),
  "VIEW/MOBILE_BROWSER": renderBrowser,
  "VIEW/DEEPLINK": renderDeeplink
};
async function execLocal(service) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    serviceEndpoint: () => {},
    onClose: () => {}
  };
  const {
    serviceEndpoint
  } = opts;
  try {
    return VIEWS[service.method](serviceEndpoint(service), opts);
  } catch (error) {
    console.error("execLocal({service, opts = {}})", error, {
      service,
      opts
    });
    throw error;
  }
}

const isBodyEmpty = body => {
  return !body || body?.data !== undefined && Object.keys(body).filter(key => key !== 'data').length === 0;
};
function serviceEndpoint(service, config, body) {
  const url = new URL$1(service.endpoint);
  if (!isBodyEmpty(body)) {
    url.searchParams.append('fclMessageJson', JSON.stringify({
      ...body,
      config
    }));
  } else {
    url.searchParams.append('fclMessageJson', JSON.stringify({
      config
    }));
  }
  if (service.params != null) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value);
    }
  }
  return url;
}

const noop = () => {};
function browser(service, config, body) {
  let opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (service == null) return {
    send: noop,
    close: noop
  };
  const onClose = opts.onClose || noop;
  const onMessage = noop;
  const onReady = noop;
  const onResponse = opts.onResponse || noop;
  const handler = buildMessageHandler({
    close,
    send: noop,
    onReady,
    onResponse,
    onMessage
  });
  const parseDeeplink = _ref => {
    let {
      url
    } = _ref;
    const {
      queryParams
    } = parse(url);
    const eventDataRaw = queryParams[FCL_RESPONSE_PARAM_NAME];
    const eventData = JSON.parse(eventDataRaw);
    handler({
      data: eventData
    });
  };
  const [browser, unmount] = renderBrowser(serviceEndpoint(service, config, body));
  // Android deeplink parsing
  addEventListener("url", parseDeeplink);
  // iOS deeplink parsing
  browser.then(parseDeeplink);
  return {
    send: noop,
    close
  };
  function close() {
    try {
      unmount();
      onClose();
    } catch (error) {
      console.error("Frame Close Error", error);
    }
  }
}

function execDeeplinkRPC(_ref) {
  let {
    service,
    config,
    body
  } = _ref;
  return new Promise((resolve, reject) => {
    browser(service, config, body, {
      onResponse: (e, _ref2) => {
        let {
          close
        } = _ref2;
        try {
          if (typeof e.data !== "object") return;
          const resp = normalizePollingResponse(e.data);
          switch (resp.status) {
            case "APPROVED":
              resolve(resp.data);
              close();
              break;
            case "DECLINED":
              reject(`Declined: ${resp.reason || "No reason supplied"}`);
              close();
              break;
            case "REDIRECT":
              resolve(resp);
              close();
              break;
            default:
              reject(`Declined: No reason supplied`);
              close();
              break;
          }
        } catch (error) {
          console.error("execExtRPC onResponse error", error);
          throw error;
        }
      },
      onClose: () => {
        reject(`Declined: Externally Halted`);
      }
    });
  });
}

const coreStrategies = {
  [CORE_STRATEGIES["HTTP/RPC"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["HTTP/POST"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["DEEPLINK/RPC"]]: execDeeplinkRPC
};

const mutate = getMutate({
  platform: "react-native"
});
const currentUser = getCurrentUser({
  platform: "react-native"
});
const authenticate = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return currentUser().authenticate(opts);
};
const unauthenticate = () => currentUser().unauthenticate();
const reauthenticate = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  currentUser().unauthenticate();
  return currentUser().authenticate(opts);
};
const signUp = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return currentUser().authenticate(opts);
};
const logIn = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return currentUser().authenticate(opts);
};
const authz = currentUser().authorization;
config(getDefaultConfig());

// Set chain id default on access node change
initServiceRegistry({
  coreStrategies
});

// Set isReactNative flag
setIsReactNative(true);

export { ServiceDiscovery, authenticate, authz, currentUser, logIn, mutate, reauthenticate, signUp, unauthenticate, useServiceDiscovery };
//# sourceMappingURL=fcl-react-native.module.js.map
