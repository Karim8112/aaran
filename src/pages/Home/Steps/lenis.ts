type LenisOptions = {
  /**
   * The element that will be used as the scroll container
   * @default window
   */
  wrapper?: Window | HTMLElement | Element;
  /**
   * The element that contains the content that will be scrolled, usually `wrapper`'s direct child
   * @default document.documentElement
   */
  content?: HTMLElement | Element;
  /**
   * The element that will listen to `wheel` and `touch` events
   * @default window
   */
  eventsTarget?: Window | HTMLElement | Element;
  /**
   * Smooth the scroll initiated by `wheel` events
   * @default true
   */
  smoothWheel?: boolean;
  /**
   * Mimic touch device scroll while allowing scroll sync
   * @default false
   */
  syncTouch?: boolean;
  /**
   * Linear interpolation (lerp) intensity (between 0 and 1)
   * @default 0.075
   */
  syncTouchLerp?: number;
  /**
   * Manage the the strength of `syncTouch` inertia
   * @default 1.7
   */
  touchInertiaExponent?: number;
  /**
   * Scroll duration in seconds
   */
  duration?: number;
  /**
   * Scroll easing function
   * @default (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
   */
  easing?: EasingFunction;
  /**
   * Linear interpolation (lerp) intensity (between 0 and 1)
   * @default 0.1
   */
  lerp?: number;
  /**
   * Enable infinite scrolling
   * @default false
   */
  infinite?: boolean;
  /**
   * The orientation of the scrolling. Can be `vertical` or `horizontal`
   * @default vertical
   */
  orientation?: Orientation;
  /**
   * The orientation of the gestures. Can be `vertical`, `horizontal` or `both`
   * @default vertical
   */
  gestureOrientation?: GestureOrientation;
  /**
   * The multiplier to use for touch events
   * @default 1
   */
  touchMultiplier?: number;
  /**
   * The multiplier to use for mouse wheel events
   * @default 1
   */
  wheelMultiplier?: number;
  /**
   * Resize instance automatically
   * @default true
   */
  autoResize?: boolean;
  /**
   * Manually prevent scroll to be smoothed based on elements traversed by events
   */
  prevent?: (node: HTMLElement) => boolean;
  /**
   * Manually modify the events before they get consumed
   */
  virtualScroll?: (data: VirtualScrollData) => boolean;
  /**
   * Wether or not to enable overscroll on a nested Lenis instance, similar to CSS overscroll-behavior (https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
   * @default true
   */
  overscroll?: boolean;
  /**
   * If `true`, Lenis will automatically run `requestAnimationFrame` loop
   * @default false
   */
  autoRaf?: boolean;
  /**
   * If `true`, Lenis will handle anchor links automatically
   * @default false
   */
  anchors?: boolean | ScrollToOptions;
  /**
   * If `true`, Lenis will automatically start/stop based on wrapper's overflow property
   * @default false
   */
  autoToggle?: boolean;
  /**
   * If `true`, Lenis will allow nested scroll
   * @default false
   */
  allowNestedScroll?: boolean;
  /**
   * @deprecated use `naiveDimensions` instead
   */
  __experimental__naiveDimensions?: boolean;
  /**
   * If `true`, Lenis will use naive dimensions calculation, be careful this has a performance impact
   * @default false
   */
  naiveDimensions?: boolean;
  /**
   * If `true`, Lenis will stop inertia when an internal link is clicked
   * @default false
   */
  stopInertiaOnNavigate?: boolean;
  /**
   * If `true`, Lenis will honor the user's `prefers-reduced-motion` setting: smoothing is disabled (`lerp` forced to `1` so scroll tracks the input device 1:1) and programmatic scrolls become instant, while scroll keeps running on the main thread
   * @default true
   */
  respectReducedMotion?: boolean;
};
