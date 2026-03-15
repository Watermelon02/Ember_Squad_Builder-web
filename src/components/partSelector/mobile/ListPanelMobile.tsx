import React from 'react';
import { Label } from '../../radix-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../radix-ui/select';

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
  onSetShowKeyword,
}) => {
  return (
    <div className="min-h-0 flex flex-col" style={{ height: '100%' }}>
      {/* 头部：搜索、排序和过滤选项 - 应用 Glassmorphism 样式 */}
      <div
        className="space-y-4 flex-shrink-0"
        style={{
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // 浅色边框
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 更明显的阴影
          borderRadius: '0 0 16px 16px', // 底部圆角
          margin: '0 -1px', // 避免边框被裁剪
          position: 'sticky', // 粘性定位
          top: 0,
          zIndex: 10,
        }}
      >
        {/* 搜索框和排序下拉框 */}
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            placeholder={translations.t41}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 255, 255)',
              color: 'black',
            }}
          />

          <Select value={sortOrder} onValueChange={setSortOrder as (value: string) => void}>
            <SelectTrigger
              className="w-[100px] flex-shrink-0"
              style={{
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255)',
              }}
            >
              <SelectValue placeholder={translations.t42} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score_desc">{translations.t37}</SelectItem>
              <SelectItem value="score_asc">{translations.t38}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 额外过滤选项 */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-700">

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-hover-img"
              checked={showHoverImg}
              className="h-4 w-4"
              onChange={(e) => onSetShowHoverImg(e.target.checked)}
              style={{ accentColor: '#718096' }}
            />
            <label htmlFor="show-hover-img" className="text-sm font-medium">
              {translations.t92}
            </label>
          </div>


          {showKeyword !== undefined && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-keyword"
                checked={showKeyword}
                className="h-4 w-4"
                onChange={(e) => {
                  if (onSetShowKeyword !== undefined) onSetShowKeyword(e.target.checked);
                }}
                style={{ accentColor: '#718096' }}
              />
              <label htmlFor="show-keyword" className="text-sm font-medium">
                {translations.t104}
              </label>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="contain-pd"
              checked={containPD}
              onChange={(e) => setContainPD(e.target.checked)}
              className="h-4 w-4"
              style={{ accentColor: '#718096' }}
            />
            <label htmlFor="contain-pd" className="text-sm font-medium">
              {translations.t67}
            </label>
          </div>
        </div>
      </div>

      {/* 内部列表内容区域（灵活）*/}
      <div
        className="flex-1 min-h-0"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ListPanelMobile;