import classNames from "classnames";
import "./AksaLogo.scss";

interface AksaLogoProps {
  className?: string;
}

const AKSA_LOGO_SRC = "/aksa-logo-2.svg";

export const AksaLogo = ({className}: AksaLogoProps) => {
  return (
    <>
      <img src={AKSA_LOGO_SRC} alt="Aksa" className={classNames("aksa-logo", "aksa-logo--desktop", className)} />
      <img src={AKSA_LOGO_SRC} alt="Aksa" className={classNames("aksa-logo", "aksa-logo--mobile", className)} />
    </>
  );
};

