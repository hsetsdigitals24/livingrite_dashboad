declare module "react-star-ratings" {
  import { ComponentType, CSSProperties } from "react";

  interface ReactStarsProps {
    count?: number;
    onChange?: (newRating: number) => void;
    onFinish?: (newRating: number) => void;
    size?: number;
    activeColor?: string;
    color?: string;
    classNames?: string;
    starDimension?: string;
    starSpacing?: string;
    rating?: number;
    editing?: boolean;
    isHalf?: boolean;
    emptyIcon?: any;
    fullIcon?: any;
    halfIcon?: any;
    filledIcon?: any;
    animate?: boolean;
    style?: CSSProperties;
  }

  const ReactStars: ComponentType<ReactStarsProps>;

  export default ReactStars;
}
