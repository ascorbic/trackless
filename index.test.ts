import { Trackless } from "./index";

describe("Trackless", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("creates an object with standard options", () => {
        const trackless = new Trackless({
            trackingID: "test",
        });
        expect(trackless.optedOut).toBeFalsy();
    });

    it("gets the preference from localStorage", () => {
        window.localStorage.setItem("trackless", "true");
        const trackless = new Trackless({
            trackingID: "test",
        });
        expect(window.localStorage.getItem).toBeCalledWith("trackless");
        expect(trackless.optedOut).toBeTruthy();
    });

    it("saves the preference to localStorage", () => {
        const trackless = new Trackless({
            trackingID: "test",
        });

        trackless.setPreference(true);

        expect(window.localStorage.setItem).toBeCalledWith("trackless", "true");
    });

    it("sets the GA flag", () => {
        window.localStorage.setItem("trackless", "true");
        const trackless = new Trackless({
            trackingID: "test",
        });
        expect((window as any)["ga-disable-test"]).toBeTruthy();
    });

    it("sets the default values of bound elements", () => {
        document.body.innerHTML = `<p class='trackless'></p>`;

        const trackless = new Trackless({
            trackingID: "test",
        });
        trackless.bindElements();

        expect(document.querySelector("p")!.innerText).toBe("Don't track me");
    });

    it("sets the alternate values of bound elements", () => {
        document.body.innerHTML = `<p class='trackless'></p>`;

        const trackless = new Trackless({
            trackingID: "test",
            initialOptOut: true,
        });
        trackless.bindElements();

        expect(document.querySelector("p")!.innerText).toBe("Enable tracking");
    });

    it("sets the custom values of bound elements", () => {
        document.body.innerHTML = `<p class='trackless'></p>`;

        const trackless = new Trackless({
            trackingID: "test",
            optOutText: "OPTOUT",
            optInText: "OPTIN",
        });
        trackless.bindElements();

        expect(document.querySelector("p")!.innerText).toBe("OPTOUT");

        trackless.setPreference(true);

        expect(document.querySelector("p")!.innerText).toBe("OPTIN");
    });

    it("changes the value on click", () => {
        document.body.innerHTML = `<p class='trackless'></p>`;

        const trackless = new Trackless({
            trackingID: "test",
        });
        trackless.bindElements();

        expect(trackless.optedOut).toBeFalsy();
        expect((window as any)["ga-disable-test"]).toBeFalsy();

        document.querySelector("p")!.click();

        expect(trackless.optedOut).toBeTruthy();
        expect((window as any)["ga-disable-test"]).toBeTruthy();
    });

    it("sets the value of an input", () => {
        document.body.innerHTML = `<input class='trackless' type='button' />`;

        const trackless = new Trackless({
            trackingID: "test",
            initialOptOut: true,
        });
        trackless.bindElements();

        const input = document.querySelector("input");

        expect(input!.value).toBe("Enable tracking");

        trackless.setPreference(false);

        expect(input!.value).toBe("Don't track me");
    });

    it("sets the value of a checkbox", () => {
        document.body.innerHTML = `<input class='trackless' type='checkbox' checked>`;

        const trackless = new Trackless({
            trackingID: "test",
            initialOptOut: true,
        });
        trackless.bindElements();

        const input = document.querySelector("input");

        expect(input!.checked).toBeFalsy();

        trackless.setPreference(false);

        expect(input!.checked).toBeTruthy();
    });

    it("sets the inverted value of a checkbox", () => {
        document.body.innerHTML = `<input class='trackless' type='checkbox' checked>`;

        const trackless = new Trackless({
            trackingID: "test",
            initialOptOut: true,
            invertCheckbox: true,
        });
        trackless.bindElements();

        const input = document.querySelector("input");

        expect(input!.checked).toBeTruthy();

        trackless.setPreference(false);

        expect(input!.checked).toBeFalsy();
    });

    it("invokes a callback when the value changes", () => {
        document.body.innerHTML = `<p class='trackless'></p>`;

        const callback = jest.fn();

        const trackless = new Trackless({
            trackingID: "test",
            callback,
        });

        trackless.setPreference(true);
        expect(callback).toBeCalledWith(true);

        trackless.setPreference(false);
        expect(callback).toBeCalledWith(false);
    });
});
