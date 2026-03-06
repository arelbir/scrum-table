import {createElement, useEffect} from "react";
import {Helmet, HelmetProps} from "react-helmet";
import {useAppSelector} from "store";
import {useAutoTheme} from "utils/hooks/useAutoTheme";

const HelmetWorkaround = ({...rest}: HelmetProps) => createElement(Helmet as unknown as React.ElementType, rest);

export const Html = () => {
  const lang = useAppSelector((state) => state.view.language);
  let title = useAppSelector((state) => state.board.data?.name);
  if (title) title = `Aksa - ${title}`;

  const theme = useAppSelector((state) => state.view.theme);
  const autoTheme = useAutoTheme(theme);

  // set the theme as an attribute, which can then be used inside stylesheets, e.g. [theme="dark"] {...}
  useEffect(() => {
    document.documentElement.setAttribute("theme", autoTheme.toString());
  }, [autoTheme]);

  return <HelmetWorkaround title={title} htmlAttributes={{lang, theme: autoTheme.toString()}} />;
};
