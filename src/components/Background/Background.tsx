import {FC, PropsWithChildren} from "react";
import "./Background.scss";

export const Background: FC<PropsWithChildren> = ({children}) => <div className="aksa-background">{children}</div>;

