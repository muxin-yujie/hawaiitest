// ========== 夏威夷行程数据 ==========
// 固定行程数据（不再使用 AI 生成）

const ITINERARY_DATA = {
    primaryLocations: [
        { 
            name: "威基基区域", 
            emoji: "", 
            description: "这里是世界著名的夏威夷度假区，拥有美丽的海滩、繁华的购物街和丰富的文化景点。" 
        },
        { name: "钻石头山", emoji: "🌋", description: "夏威夷的标志性地标，可俯瞰全景" },
        { 
            name: "波利尼西亚文化中心", 
            emoji: "🌺", 
            description: "体验波利尼西亚传统文化，欣赏草裙舞和火刀舞表演" 
        },
        { 
            name: "古兰尼牧场", 
            emoji: "", 
            description: "好莱坞电影取景地，探索侏罗纪公园等电影的拍摄地" 
        }
    ],
    hotel: { 
        name: "威基基海滩酒店", 
        description: "位于海滩边的豪华酒店，提供优质的服务和舒适的住宿体验", 
        npc: "前台接待员" 
    },
    secondaryLocationsPerPrimary: [
        // 威基基区域的 2 个二级地点
        // 索引 0: 酒店（办理入住、卢奥晚宴邀约）
        // 索引 1: 威基基海滩（二级地点，有 3 个三级地点）
        [
            { 
                name: "威基基海滩酒店", 
                emoji: "🏨",
                npc: "前台接待员",
                description: "豪华海滨酒店，提供传统夏威夷款待"
            },
            { 
                name: "威基基海滩", 
                emoji: "🏖️",
                npc: "游客",
                description: "世界著名的海滩，冲浪和日光浴的天堂",
                tertiaryLocations: [
                    {
                        name: "冲浪店",
                        emoji: "🏄‍♀️",
                        npc: "Maya",
                        npcTitle: "Surf Shop Assistant",
                        description: "充满活力的冲浪用品店",
                        hasStory: true  // 有完整剧情线（Maya → Medal → Koa）
                    },
                    {
                        name: "彩虹刨冰店",
                        emoji: "🍧",
                        npc: "Tutu",
                        npcTitle: "Grandma Tutu",
                        description: "传统夏威夷刨冰店，色彩缤纷的彩虹刨冰是招牌",
                        hasStory: false
                    },
                    {
                        name: "阿罗哈烤虾车",
                        emoji: "🍤",
                        npc: "Uncle Kimo",
                        npcTitle: "Uncle Kimo",
                        description: "路边特色餐车，蒜香黄油烤虾香气四溢",
                        hasStory: false
                    },
                    {
                        name: "热带花环编织店",
                        emoji: "🌺",
                        npc: "Halia",
                        npcTitle: "Lei Artist",
                        description: "充满花香的小店，可以学习制作传统的夏威夷花环",
                        hasStory: false
                    },
                    {
                        name: "尤克里里音乐教室",
                        emoji: "🎵",
                        npc: "Nalu",
                        npcTitle: "Music Teacher",
                        description: "温馨的音乐小屋，墙上挂满了各式各样的尤克里里",
                        hasStory: false
                    }
                ]
            }
        ],
        // 钻石头山的 3 个二级地点
        [
            { name: "观景台", emoji: "📸", npc: "游客中心工作人员", description: "俯瞰火山口和太平洋的绝佳位置" }, 
            { name: "登山步道", emoji: "🥾", npc: "导游", description: "通往火山顶的风景优美的步道" }, 
            { name: "纪念品店", emoji: "🎁", npc: "店员", description: "出售夏威夷特色纪念品和手工艺品" }
        ]
    ]
};

// 暴露到全局作用域，供 game.js 使用
window.ITINERARY_DATA = ITINERARY_DATA;

console.log("行程数据已加载 ✓");
