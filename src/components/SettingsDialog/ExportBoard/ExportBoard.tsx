import classNames from "classnames";
import {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {FileCsv, FileJson, Duplicate, Printer, AddImage} from "components/Icon";
import {useAppSelector} from "store";
import {exportAsJSON, exportAsCSV, getMarkdownExport, exportAsPNG, exportAsJPG} from "utils/export";
import {Toast} from "utils/Toast";
import {TOAST_TIMER_SHORT} from "constants/misc";
import {MenuItemConfig} from "constants/settings";
import {useOutletContext} from "react-router";
import {getColorClassName} from "constants/colors";
import ExportHintHiddenContent from "./ExportHintHiddenContent/ExportHintHiddenContent";
import {PrintView} from "./PrintView/PrintView";
import {SettingsButton} from "../Components/SettingsButton";
import "../SettingsDialog.scss";
import "./ExportBoard.scss";

export const ExportBoard = () => {
  const {t} = useTranslation();
  const activeMenuItem: MenuItemConfig = useOutletContext();

  const boardId = useAppSelector((state) => state.board.data!.id);
  const boardName = useAppSelector((state) => state.board.data!.name);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const printViewRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      await exportAsPNG(printViewRef.current!, boardName);
      Toast.success({title: t("ExportBoardOption.exportImageSuccess"), autoClose: TOAST_TIMER_SHORT});
    } catch {
      Toast.error({title: t("ExportBoardOption.exportImageError"), autoClose: TOAST_TIMER_SHORT});
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJPG = async () => {
    setIsExporting(true);
    try {
      await exportAsJPG(printViewRef.current!, boardName);
      Toast.success({title: t("ExportBoardOption.exportImageSuccess"), autoClose: TOAST_TIMER_SHORT});
    } catch {
      Toast.error({title: t("ExportBoardOption.exportImageError"), autoClose: TOAST_TIMER_SHORT});
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div data-testid="export" className={classNames("settings-dialog__container", getColorClassName(activeMenuItem?.color))}>
      <div style={{position: "absolute", left: "-9999px", top: "-9999px"}}>
        <div ref={printViewRef}>
          <PrintView boardId={boardId} boardName={boardName ?? ""} hideControls />
        </div>
      </div>

      <div className="settings-dialog__header">
        <h2 className="settings-dialog__header-text"> {t("ExportBoardOption.title")}</h2>
      </div>

      <div className="settings-dialog__group">
        <SettingsButton
          label={t("ExportBoardOption.exportAsJson")}
          icon={FileJson}
          onClick={() => {
            exportAsJSON(boardId, boardName);
          }}
          data-testid="export-json"
          reverseOrder
        />
        <hr className="settings-dialog__separator" />
        <SettingsButton
          label={t("ExportBoardOption.exportAsCSV")}
          icon={FileCsv}
          onClick={() => {
            exportAsCSV(boardId, boardName);
          }}
          data-testid="export-csv"
          reverseOrder
        />
        <hr className="settings-dialog__separator" />
        <SettingsButton
          label={t("ExportBoardOption.openPrintView")}
          icon={Printer}
          className="export-board__button-print-view"
          onClick={() => {
            window.open(`/board/${boardId}/print`, "_blank");
          }}
          reverseOrder
        />
        <hr className="settings-dialog__separator" />
        <SettingsButton
          label={t("ExportBoardOption.exportToClipboard")}
          icon={Duplicate}
          onClick={() => {
            getMarkdownExport(boardId).then((result) => {
              navigator.clipboard.writeText(result).then(() => {
                Toast.success({title: t("ExportBoardOption.copyToClipboardSuccess"), autoClose: TOAST_TIMER_SHORT});
              });
            });
          }}
          data-testid="export-markdown"
          reverseOrder
        />
        <hr className="settings-dialog__separator" />
        <SettingsButton
          label={t("ExportBoardOption.exportAsPNG")}
          icon={AddImage}
          disabled={isExporting}
          aria-label={isExporting ? t("ExportBoardOption.exportingAriaLabel") : undefined}
          onClick={handleExportPNG}
          data-testid="export-png"
          reverseOrder
        />
        <hr className="settings-dialog__separator" />
        <SettingsButton
          label={t("ExportBoardOption.exportAsJPG")}
          icon={AddImage}
          disabled={isExporting}
          aria-label={isExporting ? t("ExportBoardOption.exportingAriaLabel") : undefined}
          onClick={handleExportJPG}
          data-testid="export-jpg"
          reverseOrder
        />
      </div>

      <ExportHintHiddenContent />
    </div>
  );
};
