customElements.define(
    "glider-element",
    class Glider extends HTMLElement {
        static style = `
            :host {
                margin: 0 auto;
                position: relative;
                overflow-y: hidden;
                transform: translateZ(0);
                scrollbar-width: none;
            }
            :host::-webkit-scrollbar {
                display: none;
            }
            .track {
                transform: translateZ(0);
                width: 100%;
                margin: 0;
                padding: 0;
                display: flex;
                z-index: 1;
            }
            .slide {
                user-select: none;
                align-self: center;
                width: 100%;
            }
            .slide img {
                max-width: 100%;
            }
        `;
        #root = null;
        #containerWidth = 0;

        connectedCallback() {
            this.#root = this.attachShadow({ mode: "open" });
            const style = Object.assign(document.createElement("style"), { textContent: Glider.style });
            this.#root.append(style);

            const track = document.createElement("div");
            track.classList.add("track");
            this.#root.append(track);

            setTimeout(() => {
                const children = [...this.children];
                for (const [index, child] of children.entries()) {
                    const slide = document.createElement("div");
                    slide.classList.add("slide");
                    slide.dataset.gslide = index;
                    slide.append(child);
                    track.append(slide);
                }

				this.#containerWidth = this.getBoundingClientRect().width;

				if (!this.hasAttribute('slides-to-show')) {
    				const slideCount = this.#containerWidth / this.getAttribute("item-width");
    				console.log(slideCount);
				}

                console.log(this.#containerWidth);
            });
        }

        disconnectedCallback() {}

        static get observeredAttributes() {
            return [
                "slides-to-show",
                "slides-to-scroll",
                "arrows",
                "dots",
                "item-width",
                "exactWidth",
                "scroll-lock",
                "scroll-lock-delay",
                "resize-lock",
                "responsive",
                "rewind",
                "scroll-propagate",
                "draggable",
                "drag-velocity",
                "duration",
                "event-propagate",
                "skip-track",
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {}
    }
);
