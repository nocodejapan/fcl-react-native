export const coreStrategies: {
    [x: string]: ({ service, body, config, opts }: {
        service: any;
        body: any;
        config: any;
        opts: any;
    }) => Promise<any>;
};
