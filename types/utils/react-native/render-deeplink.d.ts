/**
 * Renders a deeplink view (i.e. deep links to a wallet app)
 *
 * @param {URL} src
 * @param {object} opts
 * @param {() => void} [opts.onClose]
 * @returns {[null, () => void]}
 */
export function renderDeeplink(src: URL, opts?: {
    onClose?: (() => void) | undefined;
}): [null, () => void];
import { URL } from "@onflow/fcl-core";
