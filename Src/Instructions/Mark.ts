namespace Mark {
    export type MarkDetail = {
        type: string;
        label: string;
        images: Array<string>;
        id: string;
        time: string;
        expand: boolean;
        current: number;
        fileType: string;
    };
}

export { Mark };
