declare module "@lottiefiles/react-lottie-player" {
    import { CSSProperties, Ref } from "react";

    interface PlayerProps {
        autoplay?: boolean;
        loop?: boolean;
        controls?: boolean;
        src: string;
        style?: CSSProperties;
        speed?: number;
        direction?: number;
        renderer?: "svg" | "canvas" | "html";
    }

    export const Player: React.FC<PlayerProps & { ref?: Ref<HTMLDivElement> }>;

    export default Player;
}
