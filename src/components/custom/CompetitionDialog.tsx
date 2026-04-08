import React from 'react';
import { Dialog, DialogContent } from '../radix-ui/dialog';


interface CompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bannerSrc: string;
}

export const CompetitionDialog: React.FC<CompetitionDialogProps> = ({
  open,
  onOpenChange,
  bannerSrc,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{
        maxWidth: '58vw',
        width: '58vw',
        maxHeight: '88vh',
        height: 'auto',
        padding: 0,
        overflow: 'hidden',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* 横幅图片 */}
        <div style={{ width: '100%', height: '30vh', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img
            src={bannerSrc}
            alt="比赛横幅"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' ,
            }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
            background: 'linear-gradient(to bottom, transparent, var(--color-background-primary))',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '1rem', left: '1.5rem',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(0,0,0,0.45)',
            border: '0.5px solid rgba(255,200,50,0.5)',
            borderRadius: '999px', padding: '3px 10px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'green' }} />
            <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: 500 }}>进行中</span>
          </div>
        </div>

        {/* 可滚动内容区 */}
        <div style={{ overflowY: 'auto', padding: '0 2rem 2rem', background: 'var(--color-background-primary)', flex: 1 }}>

          {/* 标题 */}
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
            黑曜协议第一次官方线上比赛“马蒂尼杯”来啦！
          </h2>

          {/* 亮点卡：差旅报销 */}
          <div style={{
            background: '#FAEEDA',
            border: '0.5px solid #EF9F27',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
          }}>
            <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>🏆</span>
            <p style={{ margin: 0, fontSize: '13px', color: '#633806', lineHeight: 1.6 }}>
              前两名可前往 <strong>8月DC展线下比赛</strong>，且雀替会报销差旅费！
            </p>
          </div>

          {/* 报名方式 */}
          <div style={{
            background: 'var(--color-background-secondary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
          }}>
            <p style={{ margin: '0 0 0.6rem', fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
              报名方式
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>
              向 QQ <strong style={{ color: 'var(--color-text-primary)', fontSize: '14px' }}>3975811496</strong> 的负责人提交两张参赛军表的导出图片
            </p>
          </div>

          {/* 线上对战教程 */}
          <div style={{
            background: 'var(--color-background-secondary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}>
            <div>
              <p style={{ margin: '0 0 0.25rem', fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                线上对战方式教程
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>点击右侧前往 Bilibili 观看</p>
            </div>
            <a
              href="https://www.bilibili.com/video/BV1kBMPzHELa"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                background: '#aaaaaa',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              ▶观看tts使用教程
            </a>
          </div>

          {/* 比赛赛制 */}
          <div style={{
            background: 'var(--color-background-secondary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
          }}>
            <p style={{ margin: '0 0 0.6rem', fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
              比赛赛制
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.8 }}>
              赛制详情。
            </p>
          </div>

          {/* 底部按钮 */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                padding: '0.45rem 1.2rem',
                borderRadius: '8px',
                border: '0.5px solid var(--color-border-secondary)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              关闭
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText('3975811496');
              }}
              style={{
                padding: '0.45rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                background: '#aaaaaa',
                color: '#1a1a00',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#ffffff',
              }}
            >
              复制QQ号报名
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};