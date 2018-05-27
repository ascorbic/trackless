export interface Options {
    /**
     * The text prompting the user to opt out.
     * Default is "Don't track me"
     */
    optOutText: string;
    /**
     * The text prompting the user to opt in.
     * Default is "Enable tracking"
     */
    optInText: string;
    /**
     * Your Google tracking ID
     */
    trackingID: string;
    /**
     * Initial opt-out value if no preference is stored. Default is false (not opted-out).
     */
    initialOptOut: boolean;
    /**
     * Override opt-out value. If true, sets the stored preference to the `initialOptOut` value.
     * Use this if, for example, you have a logged-in user and want to sync the preference between devices.
     * Default is false, meaning saved value.
     */
    overrideOptOut?: boolean;
    /**
     * Called when opt-out value is changed. Passed the new opt-out value.
     */
    callback?: (optOut: boolean) => void;
    /**
     * Invert the behaviour of checkboxes. By default, a checkbox is checked if the user is not opted-out.
     * Set this to true so that it is checked if the user is opted-out.
     */
    invertCheckbox?: boolean;
}
export declare type TracklassTask = (tl: typeof Trackless) => void;
export declare class Trackless {
    /**
     * Used by the async loader to process the command queue
     */
    static processQueue: (queue?: TracklassTask[] | undefined) => void;
    /**
     * Whether this user has opted-out
     */
    optedOut: boolean;
    private options;
    private boundElements;
    constructor(options?: Partial<Options>);
    /**
     * Pass a selector suitable for querySelectorAll. Default is ".trackless".
     */
    bindElements: (selectors?: string) => void;
    /**
     * Unbinds all elements.
     */
    unBindAllElements: () => void;
    setPreference: (optOut: boolean) => void;
    private setText;
    private bindElement;
    private getPreferenceFromStorage;
    private updateLabels;
    private setGAFlag;
    private togglePreference;
    private onClick;
}
export default Trackless;
