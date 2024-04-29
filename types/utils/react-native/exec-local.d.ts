export function execLocal(service: any, opts?: {
    serviceEndpoint: () => void;
    onClose: () => void;
}): Promise<any>;
