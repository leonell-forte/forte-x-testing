import Download from "@/assets/images/icons/download.svg?react";
import InfoTooltip from "@/components/ui/info-tooltip";

type Props = {
  title: string;
  tooltip?: string;
  onDownload?: () => void;
  icon?: React.ReactNode;
};

const TileHeader = ({ title, tooltip, onDownload, icon }: Props) => {
  return (
    <div className="tile-header flex items-center justify-between truncate text-ellipsis">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-[18px]">
          {icon && <div className="tile-icon">{icon}</div>}
          <span className="text-[24px] font-[450]">{title}</span>
        </div>
        {onDownload && (
          <button onClick={onDownload}>
            <Download stroke="white" opacity={0.5} />
          </button>
        )}
      </div>

      {tooltip && <InfoTooltip tooltip={tooltip} size="lg" />}
    </div>
  );
};

export default TileHeader;
