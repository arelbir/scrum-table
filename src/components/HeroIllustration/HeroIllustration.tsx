import Panel01 from "assets/hero/aksa-lp-01.svg";
import Panel02 from "assets/hero/aksa-lp-02.svg";
import Panel03 from "assets/hero/aksa-lp-03.svg";
import Panel04 from "assets/hero/aksa-lp-04.svg";
import Panel05 from "assets/hero/aksa-lp-05.svg";
import Panel06 from "assets/hero/aksa-lp-06.svg";
import Panel07 from "assets/hero/aksa-lp-07.svg";
import Panel08 from "assets/hero/aksa-lp-08.svg";
import Panel09 from "assets/hero/aksa-lp-09.svg";
import Panel10 from "assets/hero/aksa-lp-10.svg";
import Panel11 from "assets/hero/aksa-lp-11.svg";
import Panel12 from "assets/hero/aksa-lp-12.svg";
import ActionbarUser from "assets/hero/aksa_actionbar_user.svg";
import ActionbarModerator from "assets/hero/aksa_actionbar_mod.svg";
import {FC} from "react";
import classNames from "classnames";
import "./HeroIllustration.scss";

export interface HeroIllustrationProps {
  className?: string;
}

/**
 * @deprecated to be removed with the landing page redesign
 */
export const HeroIllustration: FC<HeroIllustrationProps> = ({className}) => (
  <aside className={classNames("hero-illustration", className)} aria-hidden>
    <div className="hero-illustration__position-anchor">
      <div className="hero-illustration__grid">
        <img src={ActionbarUser} className="hero-illustration__actionbar-user" alt="" />
        <img src={ActionbarModerator} className="hero-illustration__actionbar-moderator" alt="" />

        <div className="hero-illustration__tile">
          <img src={Panel01} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel02} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel03} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel04} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel05} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel06} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel07} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel08} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel09} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel10} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel11} className="hero-illustration__tile-image" alt="" />
        </div>
        <div className="hero-illustration__tile">
          <img src={Panel12} className="hero-illustration__tile-image" alt="" />
        </div>
      </div>
    </div>
  </aside>
);

