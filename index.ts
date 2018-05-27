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

const DEFAULT_OPTIONS: Options = {
    optOutText: "Don't track me",
    optInText: "Enable tracking",
    initialOptOut: false,
    trackingID: ""
};

function isInput(element: HTMLElement): element is HTMLInputElement {
    return element.tagName.toUpperCase() === "INPUT";
}
export type TracklassTask = (tl: typeof Trackless) => void;
export class Trackless {
    /**
     * Used by the async loader to process the command queue
     */
    public static processQueue = (queue?: TracklassTask[]) => {
        if (queue && Array.isArray(queue)) {
            queue.map(c => c(Trackless));
        }
    };

    /**
     * Whether this user has opted-out
     */
    public optedOut = false;

    private options: Options;
    private boundElements: HTMLElement[] = [];

    constructor(options: Partial<Options> = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        if (!this.options.trackingID) {
            console.error("Please set Google tracking id");
        }
        if (this.options.overrideOptOut) {
            this.setPreference(this.options.initialOptOut);
        } else {
            this.getPreferenceFromStorage();
            this.setGAFlag();
        }
    }

    /**
     * Pass a selector suitable for querySelectorAll. Default is ".trackless".
     */
    public bindElements = (selectors = ".trackless") => {
        Array.prototype.forEach.call(
            document.querySelectorAll(selectors),
            this.bindElement
        );
        this.updateLabels();
    };

    /**
     * Unbinds all elements.
     */
    public unBindAllElements = () => {
        this.boundElements.forEach(element =>
            element.removeEventListener("click", this.onClick)
        );

        this.boundElements = [];
    };

    public setPreference = (optOut: boolean) => {
        this.optedOut = optOut;
        window.localStorage.setItem("trackless", optOut ? "true" : "false");
        this.setGAFlag();
        this.updateLabels();
        if (this.options.callback) {
            this.options.callback(optOut);
        }
    };

    private setText = (element: HTMLElement) => {
        const label = this.optedOut
            ? this.options.optInText
            : this.options.optOutText;

        if (isInput(element)) {
            if (element.getAttribute("type") === "checkbox") {
                element.checked = this.options.invertCheckbox
                    ? this.optedOut
                    : !this.optedOut;
            } else {
                element.value = label;
            }
        } else {
            element.innerText = label;
        }
    };

    private bindElement = (element: HTMLElement) => {
        element.addEventListener("click", this.onClick);
        this.setText(element);
        this.boundElements.push(element);
    };

    private getPreferenceFromStorage = () => {
        switch (window.localStorage.getItem("trackless")) {
            case "true":
                this.optedOut = true;
                break;

            case "false":
                this.optedOut = false;
                break;

            default:
                this.optedOut = this.options.initialOptOut;
        }

        return this.optedOut;
    };

    private updateLabels = () => {
        this.boundElements.forEach(this.setText);
    };

    private setGAFlag = () => {
        (window as any)[
            `ga-disable-${this.options.trackingID}`
        ] = this.optedOut;
    };

    private togglePreference = () => this.setPreference(!this.optedOut);

    private onClick = (event: Event) => {
        if (
            event.currentTarget &&
            (event.currentTarget as HTMLElement).getAttribute("type") !==
                "checkbox"
        ) {
            event.preventDefault();
        }
        this.togglePreference();
    };
}

export default Trackless;
