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
       {/* 搜索框 + 排序：独立一行，搜索框弹性填满，排序固定宽度 */}
<div className="grid gap-2" style={{ gridTemplateColumns: '1fr auto' }}>
  <input
    type="text"
    placeholder={translations.t35}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={{
      height: 34,
      padding: '0 10px',
      borderRadius: 8,
      border: '0.5px solid rgba(0,0,0,0.15)',
      backgroundColor: 'rgba(0,0,0,0.04)',
      fontSize: 13,
      color: 'inherit',
    }}
  />
  <Select value={sortOrder} onValueChange={setSortOrder as (value: string) => void}>
    <SelectTrigger
      style={{ width: 110, height: 34, borderRadius: 8,
               border: '0.5px solid rgba(0,0,0,0.15)',
               backgroundColor: 'rgba(0,0,0,0.04)', fontSize: 13 }}>
      <SelectValue placeholder={translations.t42} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="score_desc">{translations.t37}</SelectItem>
      <SelectItem value="score_asc">{translations.t38}</SelectItem>
    </SelectContent>
  </Select>
</div>

{/* 筛选项：三列均匀网格，每项带背景框 */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 6,
  }}
>
  {[
    { id: 'show-hover-img', checked: showHoverImg, onChange: onSetShowHoverImg, label: translations.t92 },
    ...(showKeyword !== undefined
      ? [{ id: 'show-keyword', checked: showKeyword, onChange: onSetShowKeyword, label: translations.t104 }]
      : []),
    { id: 'contain-pd', checked: containPD, onChange: setContainPD, label: translations.t121 },
  ].map(({ id, checked, onChange, label }) => (
    <label
      key={id}
      htmlFor={id}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(0,0,0,0.04)',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ width: 14, height: 14, flexShrink: 0, accentColor: '#718096' }}
      />
      <span style={{ fontSize: 12, color: '#4a5568', overflow: 'hidden',
                     textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </label>
  ))}
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