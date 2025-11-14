import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ListPanelProps {
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
}

const ListPanel: React.FC<ListPanelProps> = ({
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
}) => {
  return (
    <div className="min-h-0 flex flex-col">
      <div className="space-y-4" style={{ paddingBottom: '1vh' }}>
        {/* 搜索框 */}
        <Input
          placeholder={translations.t35}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* 排序 / 筛选栏 */}
        <div
          className="flex items-center justify-between space-x-4 border-b border-border"
          style={{ paddingBottom: '1vh' }}
        >
          {/* 排序选择 */}
          <div className="flex items-center space-x-2">
            <Label>{translations.t36}</Label>
            <Select
              value={sortOrder}
              onValueChange={(value: 'score_desc' | 'score_asc') =>
                setSortOrder(value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score_desc">{translations.t58}</SelectItem>
                <SelectItem value="score_asc">{translations.t59}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 是否显示卡片预览（桌面端才有） */}
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

      {/* 内部列表内容区域（灵活） */}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
};

export default ListPanel;
