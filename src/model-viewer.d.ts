import 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    src?: string;
                    alt?: string;
                    ar?: boolean;
                    'ar-modes'?: string;
                    'auto-rotate'?: boolean;
                    'auto-rotate-delay'?: string;
                    'rotation-per-second'?: string;
                    'camera-controls'?: boolean;
                    'camera-orbit'?: string;
                    'environment-image'?: string;
                    'shadow-intensity'?: string;
                    'shadow-softness'?: string;
                    'exposure'?: string;
                    'tone-mapping'?: string;
                    'touch-action'?: string;
                    'interaction-prompt'?: string;
                    loading?: string;
                    poster?: string;
                    orientation?: string;
                    scale?: string;
                    reveal?: string;
                },
                HTMLElement
            >;
        }
    }
}
