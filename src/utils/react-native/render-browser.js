import WebBrowser from '@toruslabs/react-native-web-browser';
import { FCL_REDIRECT_URL_PARAM_NAME, URL } from "@onflow/fcl-core"
import * as Linking from '@/linking'
import DeviceInfo from 'react-native-device-info';

/**
 *
 * @param {URL} src
 * @param {object} opts
 * @returns {[object, () => void]}
 */
export function renderBrowser(src, opts = {}) {
  console.log("===fcl-react-native renderBrowser opts", JSON.stringify(opts));
  const bundleId = DeviceInfo.getBundleId();
  console.log("===fcl-react-native renderBrowser bundleId", bundleId);
  const redirectUrl = Linking.createURL("$$fcl_auth_callback$$", {
    scheme: bundleId,
    queryParams: {},
  })
  console.log("===fcl-react-native renderBrowser redirectUrl", redirectUrl);
  const url = new URL(src.toString())
  url.searchParams.append(FCL_REDIRECT_URL_PARAM_NAME, redirectUrl)
  console.log("===fcl-react-native renderBrowser open url", url.toString());
  const webbrowser = WebBrowser.openAuthSessionAsync(url.toString())

  const unmount = () => {
    try {
      WebBrowser.dismissAuthSession()
    } catch (error) {
      console.log(error)
    }
  }

  // Call onClose when the webbrowser is closed
  webbrowser.then(() => {
    if (opts?.onClose) {
      opts.onClose()
    }
  })

  return [webbrowser, unmount]
}
