import {useTranslation} from "react-i18next";
import {AksaLogo} from "components/AksaLogo/AksaLogo";
import {UserPill} from "components/UserPill/UserPill";
import "./HeaderBar.scss";

type HeaderBarProps = {
  renderTitle: () => string;
  locationPrefix?: string;
  loginBoard?: boolean;
};

export const HeaderBar = (props: HeaderBarProps) => {
  const {t} = useTranslation();
  const {loginBoard = false} = props;

  return (
    <div className="header-bar">
      <div className="header-bar__top-row">
        {/* logo - - - profile */}
        <div className="header-bar__aksa-logo-container">
          {/* this still needs fixing bc that uses other styles */}
          <a className="new-board__aksa-logo-href" href="/" aria-label={t("BoardHeader.returnToHomepage")}>
            <AksaLogo className="new-board__aksa-logo" />
          </a>
        </div>

        {/* - - title - - */}
        <div className="header-bar__title">{props.renderTitle()}</div>

        <UserPill className="header-bar__user-pill" locationPrefix={props.locationPrefix} disabled={loginBoard} />
      </div>
    </div>
  );
};

