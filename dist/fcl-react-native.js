'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fclCore = require('@onflow/fcl-core');
var config = require('@onflow/config');
var react = require('react');
var reactNative = require('react-native');
var AsyncStorage = require('@react-native-async-storage/async-storage');
var WebBrowser = require('@toruslabs/react-native-web-browser');
var qs = require('qs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var AsyncStorage__default = /*#__PURE__*/_interopDefaultLegacy(AsyncStorage);
var WebBrowser__default = /*#__PURE__*/_interopDefaultLegacy(WebBrowser);
var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);

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
const DefaultLoadingComponent = () => react.createElement(reactNative.Text, null, "Loading...");

/**
 * Default empty component that renders the "No Wallets Found" text.
 *
 * @returns {JSX.Element} - The empty component.
 */
const DefaultEmptyComponent = () => react.createElement(reactNative.Text, null, "No Wallets Found");

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
  return react.createElement(reactNative.TouchableOpacity, {
    onPress
  }, react.createElement(reactNative.Text, null, service?.provider?.name));
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
  return react.createElement(reactNative.View, {
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
  const [services, setServices] = react.useState([]);
  const [isLoading, setIsLoading] = react.useState(false);
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
  react.useEffect(() => {
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
  return react.createElement(Wrapper, null, isLoading && react.createElement(Loading), !isLoading && services.length === 0 && react.createElement(Empty), !isLoading && services.map((service, index) => {
    return react.createElement(ServiceCard, {
      key: service?.provider?.address ?? index,
      service,
      onPress: () => {
        authenticateService(service);
      }
    });
  }));
};
const styles = reactNative.StyleSheet.create({
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
      get: async key => JSON.parse(await AsyncStorage__default["default"].getItem(key)),
      put: async (key, value) => await AsyncStorage__default["default"].setItem(key, JSON.stringify(value))
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
  if (reactNative.Platform.OS === 'web') {
    // if (!Platform.isDOMAvailable) return '';

    const origin = ensureTrailingSlash(window.location.origin, false);
    let queryString = qs__default["default"].stringify(queryParams);
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
      const parsedParams = qs__default["default"].parse(queryString);
      if (typeof parsedParams === 'object') {
        paramsFromHostUri = parsedParams;
      }
    } catch {}
    queryParams = {
      ...queryParams,
      ...paramsFromHostUri
    };
  }
  queryString = qs__default["default"].stringify(queryParams);
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
  return reactNative.Linking.addEventListener(type, handler);
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
  return await reactNative.Linking.openURL(url);
}

/**
 *
 * @param {URL} src
 * @param {object} opts
 * @returns {[object, () => void]}
 */
function renderBrowser(src) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const redirectUrl = createURL("$$fcl_auth_callback$$", {
    queryParams: {}
  });
  const url = new fclCore.URL(src.toString());
  url.searchParams.append(fclCore.FCL_REDIRECT_URL_PARAM_NAME, redirectUrl);
  const webbrowser = WebBrowser__default["default"].openAuthSessionAsync(url.toString());
  const unmount = () => {
    try {
      WebBrowser__default["default"].dismissAuthSession();
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
  const url = new fclCore.URL(src.toString());

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
  reactNative.AppState.addEventListener("change", onAppStateChange);
  const unmount = () => {
    reactNative.AppState.removeEventListener("change", onAppStateChange);
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
  const url = new fclCore.URL(service.endpoint);
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
  const handler = fclCore.buildMessageHandler({
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
    const eventDataRaw = queryParams[fclCore.FCL_RESPONSE_PARAM_NAME];
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
          const resp = fclCore.normalizePollingResponse(e.data);
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
  [fclCore.CORE_STRATEGIES["HTTP/RPC"]]: fclCore.getExecHttpPost(execLocal),
  [fclCore.CORE_STRATEGIES["HTTP/POST"]]: fclCore.getExecHttpPost(execLocal),
  [fclCore.CORE_STRATEGIES["DEEPLINK/RPC"]]: execDeeplinkRPC
};

const mutate = fclCore.getMutate({
  platform: "react-native"
});
const currentUser = fclCore.getCurrentUser({
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
config.config(getDefaultConfig());

// Set chain id default on access node change
fclCore.initServiceRegistry({
  coreStrategies
});

// Set isReactNative flag
fclCore.setIsReactNative(true);

Object.defineProperty(exports, 'AppUtils', {
  enumerable: true,
  get: function () { return fclCore.AppUtils; }
});
Object.defineProperty(exports, 'InteractionTemplateUtils', {
  enumerable: true,
  get: function () { return fclCore.InteractionTemplateUtils; }
});
Object.defineProperty(exports, 'TestUtils', {
  enumerable: true,
  get: function () { return fclCore.TestUtils; }
});
Object.defineProperty(exports, 'VERSION', {
  enumerable: true,
  get: function () { return fclCore.VERSION; }
});
Object.defineProperty(exports, 'WalletUtils', {
  enumerable: true,
  get: function () { return fclCore.WalletUtils; }
});
Object.defineProperty(exports, 'account', {
  enumerable: true,
  get: function () { return fclCore.account; }
});
Object.defineProperty(exports, 'arg', {
  enumerable: true,
  get: function () { return fclCore.arg; }
});
Object.defineProperty(exports, 'args', {
  enumerable: true,
  get: function () { return fclCore.args; }
});
Object.defineProperty(exports, 'atBlockHeight', {
  enumerable: true,
  get: function () { return fclCore.atBlockHeight; }
});
Object.defineProperty(exports, 'atBlockId', {
  enumerable: true,
  get: function () { return fclCore.atBlockId; }
});
Object.defineProperty(exports, 'authorization', {
  enumerable: true,
  get: function () { return fclCore.authorization; }
});
Object.defineProperty(exports, 'authorizations', {
  enumerable: true,
  get: function () { return fclCore.authorizations; }
});
Object.defineProperty(exports, 'block', {
  enumerable: true,
  get: function () { return fclCore.block; }
});
Object.defineProperty(exports, 'build', {
  enumerable: true,
  get: function () { return fclCore.build; }
});
Object.defineProperty(exports, 'cadence', {
  enumerable: true,
  get: function () { return fclCore.cadence; }
});
Object.defineProperty(exports, 'cdc', {
  enumerable: true,
  get: function () { return fclCore.cdc; }
});
Object.defineProperty(exports, 'config', {
  enumerable: true,
  get: function () { return fclCore.config; }
});
Object.defineProperty(exports, 'createSignableVoucher', {
  enumerable: true,
  get: function () { return fclCore.createSignableVoucher; }
});
Object.defineProperty(exports, 'decode', {
  enumerable: true,
  get: function () { return fclCore.decode; }
});
Object.defineProperty(exports, 'discovery', {
  enumerable: true,
  get: function () { return fclCore.discovery; }
});
Object.defineProperty(exports, 'display', {
  enumerable: true,
  get: function () { return fclCore.display; }
});
Object.defineProperty(exports, 'events', {
  enumerable: true,
  get: function () { return fclCore.events; }
});
Object.defineProperty(exports, 'getAccount', {
  enumerable: true,
  get: function () { return fclCore.getAccount; }
});
Object.defineProperty(exports, 'getBlock', {
  enumerable: true,
  get: function () { return fclCore.getBlock; }
});
Object.defineProperty(exports, 'getBlockHeader', {
  enumerable: true,
  get: function () { return fclCore.getBlockHeader; }
});
Object.defineProperty(exports, 'getChainId', {
  enumerable: true,
  get: function () { return fclCore.getChainId; }
});
Object.defineProperty(exports, 'getCollection', {
  enumerable: true,
  get: function () { return fclCore.getCollection; }
});
Object.defineProperty(exports, 'getEvents', {
  enumerable: true,
  get: function () { return fclCore.getEvents; }
});
Object.defineProperty(exports, 'getEventsAtBlockHeightRange', {
  enumerable: true,
  get: function () { return fclCore.getEventsAtBlockHeightRange; }
});
Object.defineProperty(exports, 'getEventsAtBlockIds', {
  enumerable: true,
  get: function () { return fclCore.getEventsAtBlockIds; }
});
Object.defineProperty(exports, 'getNetworkParameters', {
  enumerable: true,
  get: function () { return fclCore.getNetworkParameters; }
});
Object.defineProperty(exports, 'getNodeVersionInfo', {
  enumerable: true,
  get: function () { return fclCore.getNodeVersionInfo; }
});
Object.defineProperty(exports, 'getTransaction', {
  enumerable: true,
  get: function () { return fclCore.getTransaction; }
});
Object.defineProperty(exports, 'getTransactionStatus', {
  enumerable: true,
  get: function () { return fclCore.getTransactionStatus; }
});
Object.defineProperty(exports, 'invariant', {
  enumerable: true,
  get: function () { return fclCore.invariant; }
});
Object.defineProperty(exports, 'isBad', {
  enumerable: true,
  get: function () { return fclCore.isBad; }
});
Object.defineProperty(exports, 'isOk', {
  enumerable: true,
  get: function () { return fclCore.isOk; }
});
Object.defineProperty(exports, 'limit', {
  enumerable: true,
  get: function () { return fclCore.limit; }
});
Object.defineProperty(exports, 'nodeVersionInfo', {
  enumerable: true,
  get: function () { return fclCore.nodeVersionInfo; }
});
Object.defineProperty(exports, 'param', {
  enumerable: true,
  get: function () { return fclCore.param; }
});
Object.defineProperty(exports, 'params', {
  enumerable: true,
  get: function () { return fclCore.params; }
});
Object.defineProperty(exports, 'payer', {
  enumerable: true,
  get: function () { return fclCore.payer; }
});
Object.defineProperty(exports, 'ping', {
  enumerable: true,
  get: function () { return fclCore.ping; }
});
Object.defineProperty(exports, 'pipe', {
  enumerable: true,
  get: function () { return fclCore.pipe; }
});
Object.defineProperty(exports, 'pluginRegistry', {
  enumerable: true,
  get: function () { return fclCore.pluginRegistry; }
});
Object.defineProperty(exports, 'proposer', {
  enumerable: true,
  get: function () { return fclCore.proposer; }
});
Object.defineProperty(exports, 'query', {
  enumerable: true,
  get: function () { return fclCore.query; }
});
Object.defineProperty(exports, 'ref', {
  enumerable: true,
  get: function () { return fclCore.ref; }
});
Object.defineProperty(exports, 'sansPrefix', {
  enumerable: true,
  get: function () { return fclCore.sansPrefix; }
});
Object.defineProperty(exports, 'script', {
  enumerable: true,
  get: function () { return fclCore.script; }
});
Object.defineProperty(exports, 'send', {
  enumerable: true,
  get: function () { return fclCore.send; }
});
Object.defineProperty(exports, 'serialize', {
  enumerable: true,
  get: function () { return fclCore.serialize; }
});
Object.defineProperty(exports, 'subscribeEvents', {
  enumerable: true,
  get: function () { return fclCore.subscribeEvents; }
});
Object.defineProperty(exports, 't', {
  enumerable: true,
  get: function () { return fclCore.t; }
});
Object.defineProperty(exports, 'transaction', {
  enumerable: true,
  get: function () { return fclCore.transaction; }
});
Object.defineProperty(exports, 'tx', {
  enumerable: true,
  get: function () { return fclCore.tx; }
});
Object.defineProperty(exports, 'validator', {
  enumerable: true,
  get: function () { return fclCore.validator; }
});
Object.defineProperty(exports, 'verifyUserSignatures', {
  enumerable: true,
  get: function () { return fclCore.verifyUserSignatures; }
});
Object.defineProperty(exports, 'voucherIntercept', {
  enumerable: true,
  get: function () { return fclCore.voucherIntercept; }
});
Object.defineProperty(exports, 'voucherToTxId', {
  enumerable: true,
  get: function () { return fclCore.voucherToTxId; }
});
Object.defineProperty(exports, 'why', {
  enumerable: true,
  get: function () { return fclCore.why; }
});
Object.defineProperty(exports, 'withPrefix', {
  enumerable: true,
  get: function () { return fclCore.withPrefix; }
});
exports.ServiceDiscovery = ServiceDiscovery;
exports.authenticate = authenticate;
exports.authz = authz;
exports.currentUser = currentUser;
exports.logIn = logIn;
exports.mutate = mutate;
exports.reauthenticate = reauthenticate;
exports.signUp = signUp;
exports.unauthenticate = unauthenticate;
exports.useServiceDiscovery = useServiceDiscovery;
//# sourceMappingURL=fcl-react-native.js.map
