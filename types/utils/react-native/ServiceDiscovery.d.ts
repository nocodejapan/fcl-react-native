export function useServiceDiscovery({ fcl }: {
    fcl: object;
}): object;
export function ServiceDiscovery({ fcl, Loading, Empty, ServiceCard, Wrapper }: {
    fcl: object;
    Loading?: Function | undefined;
    Empty?: Function | undefined;
    ServiceCard?: Function | undefined;
    Wrapper?: Function | undefined;
}): JSX.Element;
export type Service = import("@onflow/typedefs").Service;
