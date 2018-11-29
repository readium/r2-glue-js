// This class was purely created for the demo page.
class DemoMenu {
    constructor() {
        this.testMenu = document.getElementById('test-menu');
        this.testPicker = document.getElementById('testPicker');
        this.testFrame = document.getElementById("page");
        this._injectGlue();
        this._updateSrc(this.testPicker.value);

        this.testFrame.addEventListener('load', () => {
            if (this.keyGlue && this.keyGlue.destroy) this.keyGlue.destroy();
            if (this.eventGlue && this.eventGlue.destroy) this.eventGlue.destroy();
            if (this.linkGlue && this.linkGlue.destroy) this.linkGlue.destroy();
            if (this.selGlue && this.selGlue.destroy) this.selGlue.destroy();

            this.keyGlue = new window.ReadiumGlue.KeyHandling(this.testFrame.contentWindow);
            this.eventGlue = new window.ReadiumGlue.EventHandling(this.testFrame.contentWindow);
            this.selGlue = new window.ReadiumGlue.SelectionHandling(this.testFrame.contentWindow);
            this.highlighting = new window.ReadiumGlue.Highlighting(this.testFrame.contentWindow);
            this.regiGlue = new window.ReadiumGlue.RegionHandling(this.testFrame.contentWindow);
        });

        this.testPicker.onchange = () => {
            this._updateSrc(this.testPicker.value);
        };
    }

    testChanged() {
        let el = this.testPicker;
        let testIndex = el && el.selectedIndex;
        this._clearMenu();

        switch (testIndex) {
            case 0: // Sample content
                this._addPageNavigation();
                this._addSelectionHandling();
                // this._addRegionHandling();
                break;
            case 1: // Form elements
                this._addAlert('input:nth-child(6)', 'Reset was clicked!' );
                this._addAlert('input:nth-child(7)', 'Submit was clicked!' );
                break;
            case 4: // Audio controls with div
                this._addAudioNavigation();
                break;
            case 5: // Audio controls with buttons
                this._addAudioNavigation();
                break;
            case 6: // Links
                this._addPageNavigation();
                this._addLinkHandling();
                break;
            case 7: // Layout change
                this._addPageNavigation();
                break;
            case 8: // Details element
                this._addPageNavigation();
                break;
            default:
                break;
        }
    }

    setTest(id) {
        const picker = this.testPicker;
        picker.options.selectedIndex = id;
        this._updateSrc(picker.value);
    }

    flipPages(num) {
        let frame = this.testFrame;
        let gap = parseInt(window.getComputedStyle(frame.contentWindow.document.documentElement).getPropertyValue("column-gap"));
        frame.contentWindow.scrollTo(frame.contentWindow.scrollX + (frame.contentWindow.innerWidth - gap) * num, 0);
    }

    nextPage() {
        this.flipPages(1);
    }

    previousPage() {
        this.flipPages(-1);
    }

    pausePlayback() {
        this.togglePlayback(false);
    }

    startPlayback() {
        this.togglePlayback(true);
    }

    stopPlayback() {
        this.togglePlayback(false, 0);
    }

    jumpPlayback(time) {
        this.togglePlayback(undefined, time, true);
    }

    togglePlayback(state, timePos, shouldAddTime) {
        const win = this.testFrame.contentWindow;
        const track = win.document.getElementById('track');
        state = (state === undefined && !shouldAddTime) ? track.paused : !track.paused;

        if (state) {
            track.play();
        } else {
            track.pause();
        }

        if (timePos !== undefined) {
            track.currentTime = shouldAddTime ? track.currentTime + timePos : timePos;
        }
    }

    // private
    async _addAlert(tagName, message) {
        let tag = tagName.split(':')[0];
        this.eventGlue.addEventListener(tag, 'click', ['target'], (info) => {
            if (info[0].target === tagName) {
                window.alert(message);
            }
        });
    }

    async _addAudioNavigation() {
        // Toggle
        this.keyGlue.addKeyEventListener('document', 'keyup', [' '], () => {
            this.togglePlayback();
        });

        // Go back in playback
        this.keyGlue.addKeyEventListener('document', 'keyup', ['ArrowRight'], () => {
            this.jumpPlayback(10);
        });

        // Go forward in playback
        this.keyGlue.addKeyEventListener('document', 'keyup', ['ArrowLeft'], () => {
            this.jumpPlayback(-10);
        });

        // Stop playback
        this.keyGlue.addKeyEventListener('document', 'keyup', ['Backspace'], () => {
            this.stopPlayback();
        });
    }

    async _addPageNavigation() {
        // Previous page button
        let button = document.createElement('button');
        button.textContent = 'Previous Page';
        this.testMenu.appendChild(button);
        button.addEventListener('click', () => {
            this.previousPage();
        });

        // Next page button
        button = document.createElement('button');
        button.textContent = 'Next Page';
        this.testMenu.appendChild(button);
        button.addEventListener('click', () => {
            this.nextPage();
        });

        // Change page on key press
        this.keyGlue.addKeyEventListener('document', 'keyup', ['ArrowRight'], () => {
            this.nextPage();
        });

        this.keyGlue.addKeyEventListener('document', 'keyup', ['ArrowLeft'], () => {
            this.previousPage();
        });

        // Change page on click
        // const testBody = this.testFrame.contentWindow;
        // testBody.addEventListener('click', (event) => {
        //     const width = testBody.innerWidth;
        //     const x = event.clientX;
        //     if (x > width/2) {
        //         this.nextPage();
        //     } else {
        //         this.previousPage();
        //     }
        // });
    }

    async _addLinkHandling() {
        this.linkGlue.addEventListener('body', 'click', ['target'], (opts) => {
            const href = opts[0].href;

            const arr1 = href.split('#');
            const hash = arr1[1];
            const arr2 = arr1[0].split('/');
            const testPage = arr2[arr2.length-1];

            if (!hash) {
                // Get the number of the test, and use it to change tests
                const index = testPage.indexOf('test-');
                const num = Number.parseInt(testPage.slice(index+5, index+8));
                this.setTest(num);
            }
        });
    }

    async _addSelectionHandling() {
        this.selGlue.addEventListener('body', (opts) => {
            const rangeData = opts[0].rangeData;
            console.log(rangeData);
            this.highlighting.createHighlight(rangeData);
        });
    }

    async _addRegionHandling() {
        let region = {
            left: 0,
            top: 0,
            width: 500,
            height: 500,
            scope: 'viewport',
        };
        this.regiGlue.addEventListener('mouseenter', region, () => {
            console.log('mouse in!');
        }).then((id) => {
            console.log(id);
        });

        this.regiGlue.addEventListener('mouseout', region, () => {
            console.log('mouse out!');
        });
    }

    _clearMenu() {
        let menu = this.testMenu;
        while (menu.hasChildNodes()) {
            menu.removeChild(menu.lastChild);
        }
    }

    _updateSrc(url) {
        const prefix = "src/";
        const frame = this.testFrame;
        frame.src = prefix + url;
    }

    _injectGlue() {
        const frame = this.testFrame;
        frame.addEventListener('load', () => {
            let script = frame.contentDocument.createElement("script");
            script.setAttribute("src", "/dist/ReadiumGlue-payload.js");
            frame.contentDocument.head.appendChild(script);

            script.addEventListener('load', () => {
                this.testChanged();
            });
        });
    }
}