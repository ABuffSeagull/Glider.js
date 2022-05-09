// This is just for syntax highlighting and formatting
const html = ([string]) => string;

customElements.define(
	'glider-element',
	class Glider extends HTMLElement {
		static template = html`
			<style>
				:host {
					margin: 0 auto;
					position: relative;
					overflow-y: hidden;
					overflow-x: hidden;
					-webkit-overflow-scrolling: touch;
					-ms-overflow-style: none;
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
					justify-content: center;
					align-items: center;
					/* z-index: 1;*/
				}
				.track::slotted(*) {
					user-select: none;
					height: auto;
					width: var(--item-width, 100%);
				}
				.track::slotted(img) {
					user-select: none;
					pointer-events: none;
				}
			</style>
			<slot name="prev"></slot> <slot class="track"></slot> <slot name="next"></slot>
		`;
		static defaults = {
			slidesToScroll: 1,
			slidesToShow: 1,
			resizeLock: true,
			duration: 0.5,
		};

		#root = null;
		#options = {};

		connectedCallback() {
			this.#root = this.attachShadow({mode: 'open'});

			this.#options = new Proxy(
				{},
				{
					get: (target, property) => {
						if (property in target) return target[property];

						const kebabProperty = toKebabCase(property);
						if (this.hasAttribute(kebabProperty)) {
							return this.getAttribute(kebabProperty) ?? true;
						}

						return Glider.defaults[property];
					},
				},
			);

			const template = document.createElement('template');
			template.innerHTML = Glider.template;
			this.#root.append(template.content.cloneNode(true));
			const track = this.#root.querySelector('.track');

			const {width: containerWidth} = this.getBoundingClientRect();

			let slideCount;
			if (this.#options.slidesToShow == 'auto' || this.#options.autoSlide) {
				slideCount = containerWidth / this.#options.itemWidth;

				const count = this.#options.exactWidth ? slideCount : Math.max(1, Math.floor(slideCount));
				this.#options.autoSlide = count;
				this.#options.slidesToShow = count;
			}

			if (this.#options.slidesToScroll == 'auto') {
				this.#options.slidesToScroll = Math.floor(this.#options.slidesToShow);
			}

			const itemWidth = this.#options.exactWidth
				? this.#options.itemWidth
				: containerWidth / this.#options.slidesToShow;

			track.style.setProperty('--item-width', `${itemWidth}px`);

			const trackWidth = itemWidth * track.assignedElements().length;
			track.style.width = `${trackWidth}px`;

			const height = track.assignedElements().reduce((maxHeight, el) => Math.max(maxHeight, el.offsetHeight), 0);
			console.log(height);

			for (const el of this.#root.querySelectorAll('slot[name]')) {
				el.addEventListener(
					'click',
					event => {
						event.preventDefault();
						event.stopImmediatePropagation();
						const {name} = event.currentTarget;
						console.log(name);
					},
					{capture: true, passive: false},
				);
			}
		}

		disconnectedCallback() {}

		static get observeredAttributes() {
			return [
				'slides-to-show',
				'slides-to-scroll',
				'arrows',
				'dots',
				'item-width',
				'exact-width',
				'scroll-lock',
				'scroll-lock-delay',
				'resize-lock',
				'responsive',
				'rewind',
				'scroll-propagate',
				'draggable',
				'drag-velocity',
				'duration',
				'event-propagate',
				'skip-track',
			];
		}

		attributeChangedCallback(name, oldValue, newValue) {
			console.log('changed', name, oldValue, newValue);
		}

		scrollTo(target, duration = this.#options.duration) {
			return new Promise(resolve => {
  			const animate = (now) =>{
					this.scrollLeft +=
						(target - this.scrollLeft) * easing(0, now, 0, 1, duration ?? this.#options.duration);
					if (now < duration) {
  					requestAnimationFrame(animate);
					} else {
  					this.scrollLeft = target;
  					resolve();
					}
				};
				requestAnimationFrame(animate);
			});
		}
	},
);

function toKebabCase(string) {
	return string.replaceAll(/[A-Z]/g, char => '-' + char.toLowerCase());
}
