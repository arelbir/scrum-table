import {AksaLogo} from "components/AksaLogo";
import "./Homepage.scss";
import {Trans, useTranslation, withTranslation} from "react-i18next";
import {ArrowRight, Logout} from "components/Icon";
import {useHref} from "react-router";
import {AppInfo} from "components/AppInfo";
import {HeroIllustration} from "components/HeroIllustration";
import {LegacyButton} from "components/Button";
import {useAppDispatch, useAppSelector} from "store";
import {Toast} from "utils/Toast";
import {useEffect} from "react";
import {signOut} from "store/features";
import {KazanciAnchor} from "./KazanciAnchor";

export const Homepage = withTranslation()(() => {
  const {t, i18n} = useTranslation();
  const newHref = useHref("/new");
  const {user} = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const currentYear = new Date().getFullYear();

  
  const onLogout = () => {
    dispatch(signOut());
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const boardDeleted = searchParams.get("boardDeleted");

    if (boardDeleted) {
      Toast.info({
        title: i18n.t("Error.boardDeleted"),
      });

      queueMicrotask(() => {
        searchParams.delete("boardDeleted");
        const newSearch = searchParams.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "");
        window.history.replaceState({}, document.title, newUrl);
      });
    }
  }, [i18n]);

  return (
    <div className="homepage">
      <div className="homepage__hero">
        <div className="homepage__background">
          <div className="homepage__orb homepage__orb--blue" />
          <div className="homepage__orb homepage__orb--green" />
          <div className="homepage__mesh" />
          <div className="homepage__scanlines" />
        </div>

        <header className="homepage__header">
          <div className="homepage__brand">
            <AksaLogo className="homepage__logo" />
            <span className="homepage__brand-text">Kazancı Holding</span>
          </div>

          <ul className="homepage__settings">
            {!!user && (
              <li>
                <LegacyButton variant="text-link" onClick={onLogout} leftIcon={<Logout className="homepage__logout-button-icon" />} className="homepage__logout-button">
                  {t("SettingsDialog.Logout")}
                </LegacyButton>
              </li>
            )}
          </ul>
        </header>

        <div className="homepage__hero-content-wrapper">
          <div className="homepage__hero-content">
            <main className="homepage__main">
              <div className="homepage__eyebrow">Kurumsal retrospektif alanı</div>
              <h1 className="homepage__hero-title">
                <Trans
                  i18nKey="Homepage.teaserTitle"
                  components={{team: <span className="homepage__hero-title-team" />, retrospective: <span className="homepage__hero-title-retrospective" />}}
                />
              </h1>
              <p className="homepage__hero-text">
                <Trans i18nKey="Homepage.teaserText" />
              </p>

              <div className="homepage__cta-row">
                <LegacyButton href={newHref} color="primary" className="homepage__start-button" rightIcon={<ArrowRight className="homepage__proceed-icon" />}>
                  <Trans i18nKey="Homepage.startButton" />
                </LegacyButton>
                <span className="homepage__cta-note">Aksa ekipleri için güvenli, hızlı ve sade.</span>
              </div>

              <div className="homepage__chips">
                <span className="homepage__chip">Şablonlu başlangıç</span>
                <span className="homepage__chip">Oylama + Zamanlayıcı</span>
                <span className="homepage__chip">PDF / CSV / JSON dışa aktarım</span>
              </div>
            </main>

            <div className="homepage__visual">
              <HeroIllustration className="homepage__illustration" />
              <div className="homepage__accent-card">
                <div className="homepage__accent-title">Aksa Standartları</div>
                <div className="homepage__accent-text">Kurumsal renkler, tutarlı deneyim, tek dil.</div>
                <div className="homepage__accent-bar">
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="homepage__footer">
        <AppInfo className="homepage__app-info" />

        <div className="homepage__footer-developers">
          <span>
            <Trans
              i18nKey="Homepage.developers"
              components={{
                kazanci: <KazanciAnchor />,
              }}
              values={{currentYear}}
            />
          </span>
        </div>
      </footer>
    </div>
  );
});












