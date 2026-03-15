import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../radix-ui/dialog';
import { Button } from '../radix-ui/button';
import { Users, Copy, Check } from 'lucide-react'; // 引入图标
import { motion } from 'framer-motion';
const QQ_GROUP_STORAGE_VERSION = 'has_clicked_qq_btn_2';

// 定义QQ群数据
const QQ_GROUPS = [
    { name: "四川", id: "957942659" },
    { name: "湖南", id: "542981741" },
    { name: "江苏", id: "602408963" },
    { name: "上海", id: "1087268491" },
    { name: "大连", id: "700473050" },
    { name: "广州", id: "1084868523" },
    {name:"网络对战群",id:"1061138517"}
];

interface QQGroupButtonProps {
    lang: string;
}

export const QQGroupButton: React.FC<QQGroupButtonProps> = ({ lang }) => {
    // 1. 如果语言不是中文，直接不渲染
    if (lang !== 'zh') return null;

    const [hasClicked, setHasClicked] = useState(true); // 默认为 true 防止闪烁
    const [isOpen, setIsOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // 2. 初始化时检查 LocalStorage
    useEffect(() => {
        const record = localStorage.getItem(QQ_GROUP_STORAGE_VERSION);
        // 如果没有记录，说明是第一次，设置 hasClicked 为 false
        if (!record) {
            setHasClicked(false);
        }
    }, []);

    const handleClick = () => {
        setIsOpen(true);
        // 点击后记录状态，取消高亮
        if (!hasClicked) {
            setHasClicked(true);
            localStorage.setItem(QQ_GROUP_STORAGE_VERSION, 'true');
        }
    };

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <motion.div
                    onClick={handleClick}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "0.375rem",
                        // 基础样式与原按钮保持一致
                        border: !hasClicked ? "1px solid rgba(255, 215, 0, 0.6)" : "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        marginLeft: 0, // 因为是 flex-row-reverse，这里的 margin 可能需要调整，或者依靠 gap
                        position: 'relative'
                    }}
                    // 3. 高亮动画：如果没点击过，显示呼吸灯效果
                    animate={!hasClicked ? {
                        boxShadow: [
                            "0 0 0 0 rgba(234, 179, 8, 0)",
                            "0 0 0 4px rgba(234, 179, 8, 0.4)",
                            "0 0 0 0 rgba(234, 179, 8, 0)"
                        ],
                    } : {}}
                    transition={!hasClicked ? {
                        duration: 2,
                        repeat: Infinity,
                    } : {}}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.35)" }}
                    whileTap={{ scale: 0.95, backgroundColor: "rgba(255,255,255,0.25)" }}
                >
                    <Users className="w-4 h-4" color={!hasClicked ? "#fbbf24" : "currentColor"} />

                    {/* 4. 气泡提示 (可选) */}
                    {!hasClicked && (
                        <div style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#ef4444'
                        }} />
                    )}
                </motion.div>
            </DialogTrigger>

            {/* 5. 弹窗内容 */}
            <DialogContent style={{ maxWidth: 400 }}>
                <DialogHeader>
                    <DialogTitle>各省份qq群</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-2 max-h-[60vh] overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-2">
                        欢迎加入各地区同好群进行交流！
                    </p>
                    <p className="text-sm text-gray-500 mb-2">如果您所在的省份有群或者俱乐部，欢迎提供信息！</p>
                    {QQ_GROUPS.map((group) => (
                        <div
                            key={group.name}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
                        >
                            <div>
                                <div className="font-medium text-sm text-gray-900">{group.name}</div>
                                <div className="text-xs text-gray-500 font-mono select-all">{group.id}</div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCopy(group.id)}
                            >
                                {copiedId === group.id ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Copy className="w-4 h-4 text-gray-400" />
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};