# 环境音效文件说明

## 需要的音效文件

### 1. ocean-ambient.mp3 🌊
- **用途**: 海滩/海洋场景背景音
- **使用场景**: 威基基海滩、海边餐厅、冲浪店
- **音量**: 12%（代码已设置）
- **时长**: 30 秒 -2 分钟循环

### 2. airport-ambient.mp3 ✈️
- **用途**: 机场场景背景音
- **使用场景**: 檀香山国际机场、海关、到达大厅
- **音效内容**: 
  - 轻柔的机场广播声（听不清内容的那种）
  - 人群走动声
  - 行李箱轮子声
  - 登机口提示音
- **音量**: 10%（代码已设置）
- **时长**: 1-3 分钟循环

### 3. hotel-ambient.mp3 🏨
- **用途**: 酒店场景背景音
- **使用场景**: 酒店大堂、房间、前台
- **音效内容**:
  - 轻柔的空调/通风声
  - 远处的人声（很模糊）
  - 电梯提示音（偶尔）
  - 安静的背景音乐（非常淡）
- **音量**: 8%（代码已设置，最轻）
- **时长**: 2-5 分钟循环

### 4. nature-ambient.mp3 🌴
- **用途**: 自然/山区场景背景音
- **使用场景**: 钻石头山、古兰尼牧场、瀑布
- **音效内容**:
  - 鸟鸣声
  - 风吹树叶声
  - 远处溪流声
  - 昆虫叫声（轻微）
- **音量**: 10%（代码已设置）
- **时长**: 1-3 分钟循环

## 免费音效资源

### 推荐网站（免版税，可商用）

#### 1. Freesound.org
- 链接：https://freesound.org/
- 许可：选择 Creative Commons 0 (CC0)

**机场音效搜索关键词**:
- `airport terminal`
- `airport ambience`
- `airport crowd`
- `airport lounge`

**酒店音效搜索关键词**:
- `hotel lobby`
- `hotel room`
- `hotel reception`
- `indoor ambience`

**自然音效搜索关键词**:
- `forest ambience`
- `birds chirping`
- `nature sounds`
- `jungle atmosphere`

#### 2. Pixabay Sound Effects
- 链接：https://pixabay.com/sound-effects/
- 许可：免费可商用

#### 3. Mixkit
- 链接：https://mixkit.co/free-sound-effects/
- 许可：免费可商用

#### 4. ZapSplat
- 链接：https://www.zapsplat.com/
- 许可：免费（需要署名）或付费免署名

## 具体推荐音效

### 机场音效 ✈️
1. **Freesound**: "Airport Terminal Ambience" by InspectorJ
   - 链接：https://freesound.org/people/InspectorJ/sounds/348863/
   - 许可：CC0
   - 特点：自然的机场环境音，有广播和人声

2. **Freesound**: "Airport Crowd Atmosphere"
   - 链接：https://freesound.org/search/?q=airport+crowd
   - 特点：人群嘈杂声

### 酒店音效 🏨
1. **Freesound**: "Hotel Lobby Ambience"
   - 链接：https://freesound.org/search/?q=hotel+lobby
   - 特点：安静的酒店大堂

2. **Pixabay**: "Hotel Room Tone"
   - 链接：https://pixabay.com/sound-effects/search/hotel/
   - 特点：安静的室内环境音

### 自然音效 🌴
1. **Freesound**: "Forest Birds Chirping"
   - 链接：https://freesound.org/people/InspectorJ/sounds/346942/
   - 许可：CC0

2. **Pixabay**: "Nature Sounds"
   - 链接：https://pixabay.com/sound-effects/search/nature/
   - 特点：鸟鸣 + 风吹树叶

## 音效制作建议

### 机场音效 DIY 方案
如果找不到合适的机场音效，可以自己制作：
1. 录制或下载人群嘈杂声（底层）
2. 添加模糊的广播声（中层，音量低）
3. 添加行李箱轮子声（偶尔，上层）
4. 混合后总音量控制在 -30dB 到 -40dB

### 酒店音效 DIY 方案
1. 安静的房间底噪（空调/通风）
2. 非常模糊的远处人声
3. 偶尔的电梯"叮"声
4. 总音量控制在 -35dB 到 -45dB

### 自然音效 DIY 方案
1. 鸟鸣声（主要）
2. 风吹树叶声（底层）
3. 远处溪流声（可选）
4. 总音量控制在 -30dB 到 -35dB

## 如何使用

1. 下载选定的音效文件
2. 重命名为对应的文件名：
   - `ocean-ambient.mp3`
   - `airport-ambient.mp3`
   - `hotel-ambient.mp3`
   - `nature-ambient.mp3`
3. 放入此 `music/` 文件夹
4. 刷新页面即可

## 场景切换代码示例

```javascript
// 机场场景
setAmbientScene('airport');

// 海滩场景
setAmbientScene('ocean');

// 酒店场景
setAmbientScene('hotel');

// 自然场景（山区/牧场）
setAmbientScene('nature');
```

## 音量调整

在 `js/ambient-sound.js` 中修改配置：

```javascript
const ambientScenes = {
    ocean: {
        id: 'ambientOcean',
        volume: 0.12,  // 海洋：12%
        name: '海洋'
    },
    airport: {
        id: 'ambientAirport',
        volume: 0.10,  // 机场：10%
        name: '机场'
    },
    hotel: {
        id: 'ambientHotel',
        volume: 0.08,  // 酒店：8%（最轻）
        name: '酒店'
    },
    nature: {
        id: 'ambientNature',
        volume: 0.10,  // 自然：10%
        name: '自然'
    }
};
```

## 游戏内场景应用建议

### 第一阶段：机场（游戏开始）
```javascript
// 海关场景
setAmbientScene('airport');
```

### 第二阶段：威基基海滩
```javascript
// 海滩、冲浪店、海边餐厅
setAmbientScene('ocean');
```

### 第三阶段：酒店
```javascript
// 酒店大堂、房间、前台
setAmbientScene('hotel');
```

### 第四阶段：钻石头山/古兰尼牧场
```javascript
// 山区、自然景观
setAmbientScene('nature');
```

## 注意事项

⚠️ **版权提示**: 确保使用的音效具有合适的许可证

⚠️ **文件大小**: 每个文件建议控制在 1-5MB

⚠️ **格式兼容**: MP3 格式兼容性最好

⚠️ **音量平衡**: 所有音效的音量应该相近，避免切换时音量突变

⚠️ **循环平滑**: 确保音效可以无缝循环，没有明显的循环点

## 进阶功能（可选）

### 1. 动态音量调节
根据时间段调整音量：
- 白天：正常音量
- 夜晚：降低 20%

### 2. 天气效果
- 雨天：添加雨声层
- 大风：增加风声

### 3. 时间过渡
场景切换时使用 2 秒淡出 +2 秒淡入，避免突兀
