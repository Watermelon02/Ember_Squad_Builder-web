import React from 'react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ListPanelMobileProps {
  // 搜索和排序相关
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortOrder: 'score_desc' | 'score_asc';
  setSortOrder: (value: 'score_desc' | 'score_asc') => void;

  // 额外选项
  containPD: boolean;
  setContainPD: (value: boolean) => void;
  showHoverImg: boolean;
  onSetShowHoverImg: (value: boolean) => void;
  mobileOrTablet: boolean;

  // 多语言
  translations: any;

  // 内部内容（不固定，比如 PartList / PilotList）
  children: React.ReactNode;
  showKeyword?: boolean;
  onSetShowKeyword?: (show: boolean) => void;
}

const ListPanelMobile: React.FC<ListPanelMobileProps> = ({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  containPD,
  setContainPD,
  showHoverImg,
  onSetShowHoverImg,
  mobileOrTablet,
  translations,
  children,
  showKeyword,
  onSetShowKeyword
}) => {
  return (
    <div className="min-h-0 flex flex-col" style={{ height: '100%' }}>
      <div className="space-y-4" style={{
        paddingTop: "1vh",
        paddingLeft: "3vw", paddingRight: "2vw", position: 'sticky', top: 0, zIndex: 10,
        backgroundColor: "rgb(0,0,0,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundSize: "150% auto",
        backgroundPosition: "center center"
      }}>

        {/* 排序 / 筛选栏 */}
        <div
          className="flex items-center justify-between space-x-4 "
          style={{ paddingBottom: '1vh' }}
        >
          {/* 排序选择 */}
          <div className="flex items-center space-x-2" >
            <Label>{translations.t36}</Label>
            <Select
              value={sortOrder}
              onValueChange={(value: 'score_desc' | 'score_asc') =>
                setSortOrder(value)
              }
            >
              <SelectTrigger style={{ height: "4vh",backgroundColor: "rgb(255,255,255,1)",}}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score_desc">{translations.t58}</SelectItem>
                <SelectItem value="score_asc">{translations.t59}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center" style={{ gap: "1vw" }}>
            {!mobileOrTablet && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-hover-img"
                  checked={showHoverImg}
                  onChange={(e) => onSetShowHoverImg(e.target.checked)}
                  className="h-4 w-4"
                  style={{ accentColor: '#ffffff' }}
                />
                <label htmlFor="show-hover-img" className="text-sm">
                  {translations.t92}
                </label>
              </div>
            )}


            {showKeyword !== undefined && <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-keyword"
                checked={showKeyword}
                className="h-4 w-4"
                onChange={(e) => { if (onSetShowKeyword !== undefined) onSetShowKeyword(e.target.checked) }}
                style={{ accentColor: "#ffffff" }} // 灰色勾选
              />
              <label htmlFor="show-keyword" className="text-sm">
                {translations.t104}
              </label>
            </div>}

            {/* 星环过滤 */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="contain-pd"
                checked={containPD}
                onChange={(e) => setContainPD(e.target.checked)}
                className="h-4 w-4"
                style={{ accentColor: '#ffffff' }}
              />
              <label htmlFor="contain-pd" className="text-sm">
                {translations.t67}
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* 内部列表内容区域（灵活） */}
      <div className="flex-1 min-h-0 " style={{
        backgroundColor: "rgba(0,0,0,0.05)",

      }}>{children}</div>
    </div>
  );
};

export default ListPanelMobile;
