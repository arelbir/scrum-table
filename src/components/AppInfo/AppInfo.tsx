import {FC} from "react";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import "./AppInfo.scss";

export interface AppInfoProps {
  className?: string;
}

export const AppInfo: FC<AppInfoProps> = ({className}) => {
  const {t} = useTranslation();

  return (
    <span aria-label={t("AppInfo.version")} className={classNames("app-info", className)}>
      <span>{process.env.REACT_APP_VERSION}</span>
    </span>
  );
};
