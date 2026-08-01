export const SUPPORTED_LOCALES = ['en', 'zh-CN'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'en';
export const LOCALE_STORAGE_KEY = 'solar-explorer-v08-locale';

export const EN_MESSAGES = {
  'language.label': 'Language',
  'language.english': 'English',
  'language.chinese': 'Simplified Chinese',
  'app.name': 'Scientific Animation Generator',
  'app.explorer': 'Solar System Explorer',
  'app.controlCenter': 'Control Center',
  'app.starting': 'Starting scientific runtime…',
  'app.startingStandalone': 'Starting offline Solar System runtime…',
  'app.unableToStart': 'Unable to start Scientific Animation Generator',
  'action.play': 'Play',
  'action.pause': 'Pause',
  'action.reset': 'Reset',
  'action.close': 'Close',
  'action.reload': 'Reload',
  'action.saveNow': 'Save now',
  'status.idle': 'idle',
  'status.savedLocally': 'Saved locally',
  'status.saving': 'Saving…',
  'time.reverse': 'Reverse',
  'time.forward': 'Forward',
  'time.paused': 'Paused',
  'view.controls': 'View controls',
  'view.drag': 'Drag to orbit',
  'view.zoom': 'Scroll to zoom',
  'view.track': 'Tap to track',
  'pilot.title': 'Assisted pilot',
  'pilot.rejoin': 'Rejoin route',
  'quality.auto': 'Auto',
  'quality.low': 'Battery saver',
  'quality.high': 'High detail',
} as const;

export type MessageKey = keyof typeof EN_MESSAGES;

export const ZH_CN_MESSAGES: Record<MessageKey, string> = {
  'language.label': '语言',
  'language.english': 'English',
  'language.chinese': '简体中文',
  'app.name': '科学动画生成器',
  'app.explorer': '太阳系探索器',
  'app.controlCenter': '控制中心',
  'app.starting': '正在启动科学模拟…',
  'app.startingStandalone': '正在启动离线太阳系模拟…',
  'app.unableToStart': '无法启动科学动画生成器',
  'action.play': '播放',
  'action.pause': '暂停',
  'action.reset': '重置',
  'action.close': '关闭',
  'action.reload': '重新加载',
  'action.saveNow': '立即保存',
  'status.idle': '空闲',
  'status.savedLocally': '已保存到本机',
  'status.saving': '正在保存…',
  'time.reverse': '反向',
  'time.forward': '正向',
  'time.paused': '已暂停',
  'view.controls': '视图控制',
  'view.drag': '拖动以环绕观察',
  'view.zoom': '滚动以缩放',
  'view.track': '轻触以跟随',
  'pilot.title': '辅助驾驶',
  'pilot.rejoin': '返回航线',
  'quality.auto': '自动',
  'quality.low': '省电模式',
  'quality.high': '高画质',
};

export const OBJECT_NAMES: Record<string, { en: string; 'zh-CN': string }> = {
  sun: { en: 'Sun', 'zh-CN': '太阳' },
  mercury: { en: 'Mercury', 'zh-CN': '水星' },
  venus: { en: 'Venus', 'zh-CN': '金星' },
  earth: { en: 'Earth', 'zh-CN': '地球' },
  mars: { en: 'Mars', 'zh-CN': '火星' },
  jupiter: { en: 'Jupiter', 'zh-CN': '木星' },
  saturn: { en: 'Saturn', 'zh-CN': '土星' },
  uranus: { en: 'Uranus', 'zh-CN': '天王星' },
  neptune: { en: 'Neptune', 'zh-CN': '海王星' },
  moon: { en: 'Moon', 'zh-CN': '月球' },
};

const PHASE_NAMES: Record<string, string> = {
  'New Moon': '新月',
  'Waxing Crescent': '娥眉月',
  'First Quarter': '上弦月',
  'Waxing Gibbous': '盈凸月',
  'Full Moon': '满月',
  'Waning Gibbous': '亏凸月',
  'Last Quarter': '下弦月',
  'Waning Crescent': '残月',
};

const EXACT_ZH_CN: Record<string, string> = {
  ...Object.fromEntries(Object.values(OBJECT_NAMES).map((value) => [value.en, value['zh-CN']])),
  'Scientific Animation Generator': '科学动画生成器',
  'Solar System Explorer': '太阳系探索器',
  'Scientific Animation Generator · v0.7.0': '科学动画生成器 · v0.7.0',
  'Offline-first': '离线优先',
  'Unified Simulation Clock': '统一模拟时钟',
  'Scenes': '场景',
  'Project status': '项目状态',
  'Inspector': '检查器',
  'Control Center': '控制中心',
  'Copy iframe': '复制 iframe',
  'Full screen': '全屏',
  'Install PWA': '安装 PWA',
  'Export HTML': '导出 HTML',
  'Template library': '模板库',
  'Close side panel': '关闭侧边面板',
  'Close template library': '关闭模板库',
  'Close inspector': '关闭检查器',
  '1 scene': '1 个场景',
  'Explore · Learn · Travel foundation': '探索 · 学习 · 旅行基础',
  'Active': '使用中',
  'Weather Wind Field': '天气风场',
  'Future theme': '未来主题',
  'Planned': '已规划',
  'Current programme': '当前版本',
  'View release notes': '查看发布说明',
  'Quick access': '快速入口',
  'Scientific Accuracy Report': '科学精度报告',
  'Release notes': '发布说明',
  'Texture attribution': '纹理归属',
  'Privacy': '隐私',
  'Starting scientific runtime…': '正在启动科学模拟…',
  'Undo': '撤销',
  'Redo': '重做',
  'Toggle Basic and Advanced complexity': '切换基础与进阶复杂度',
  'Open Control Center': '打开控制中心',
  'Reset simulation': '重置模拟',
  'Solar System simulation workspace': '太阳系模拟工作区',
  'Pause': '暂停',
  'Play': '播放',
  'Reset': '重置',
  'Simulation time (UTC)': '模拟时间（UTC）',
  'Adaptive quality': '自适应画质',
  'Live preview': '实时预览',
  'Live scientific preview': '实时科学预览',
  'View controls': '视图控制',
  'Inspect selected object close up': '近距离检视所选天体',
  'Frame whole system': '显示完整太阳系',
  'Zoom out': '缩小',
  'Zoom in': '放大',
  'Reset camera': '重置相机',
  'Drag to orbit': '拖动以环绕观察',
  'Scroll to zoom': '滚动以缩放',
  'Tap to track': '轻触以跟随',
  'Time scale': '时间倍率',
  'Simulation time scale': '模拟时间倍率',
  'Advanced timeline': '进阶时间轴',
  'Simulation day': '模拟日',
  'Template parameters': '模板参数',
  'Scene parameters': '场景参数',
  'Autosave on': '自动保存已开启',
  'Help': '帮助',
  'Give feedback': '提供反馈',
  'Controls': '控制项',
  'Track': '跟随',
  'Experience mode': '体验模式',
  'Open Solar System controls': '打开太阳系控制项',
  'Complexity mode': '复杂度模式',
  'Basic': '基础',
  'Advanced': '进阶',
  'Close Control Center': '关闭控制中心',
  'Control Center sections': '控制中心分区',
  'Time': '时间',
  'View': '视图',
  'Objects': '天体',
  'Observe': '观测',
  'Quality': '画质',
  'Export': '导出',
  'Guide': '指南',
  'Mission': '任务',
  'Simulation Clock': '模拟时钟',
  'Quick presets': '快速预设',
  'Time advanced per real second': '每个现实秒推进的模拟时间',
  'Fine speed': '精细速度',
  'Fine simulation speed': '精细模拟速度',
  'Jump to time': '跳转时间',
  'Exact date and time': '准确日期和时间',
  'Local date and time': '本地日期和时间',
  'Jump to selected time': '跳转至所选时间',
  'Event jump': '事件跳转',
  'Upcoming astronomical geometry': '即将发生的天文几何事件',
  'Calculated': '已计算',
  'Advanced time': '进阶时间',
  'Direction and precise timeline': '方向与精确时间轴',
  'Forward': '正向',
  'Reverse': '反向',
  'Advanced simulation timeline': '进阶模拟时间轴',
  'Custom preset': '自定义预设',
  'Save your own time step': '保存自己的时间步长',
  'Name': '名称',
  'Value': '数值',
  'Unit per second': '每秒单位',
  'Minute': '分钟',
  'Hour': '小时',
  'Day': '天',
  'Week': '周',
  'Month': '月',
  'Year': '年',
  'Save preset': '保存预设',
  'Presentation': '显示',
  'Scale, orbit and label controls': '比例、轨道与标签控制',
  'Visual scale disclosure': '视觉比例说明',
  'Scientific positions are unchanged. Learning Scale compresses spacing; Real Distance uses linear AU spacing with overlap-safe sizes and locator labels; Real Scale uses physical radius-to-AU ratios.': '科学位置保持不变。学习比例会压缩间距；真实距离使用线性 AU 间距，并采用防重叠尺寸和定位标签；真实比例使用物理半径与 AU 的真实比例。',
  'Learning Scale enhances sizes and compresses spacing. Real Distance uses linear AU spacing with overlap-safe sizes, automatic full-system framing and locator labels. Real Scale uses physical radius-to-AU ratios. The Astronomy Engine state is unchanged.': '学习比例会放大天体并压缩间距。真实距离使用线性 AU 间距、防重叠尺寸、自动全系统取景和定位标签。真实比例使用物理半径与 AU 的真实比例。天文引擎状态保持不变。',
  'Calculation and presentation are separated': '计算与显示相互独立',
  'Objects & Focus': '天体与视图',
  'Select a celestial object': '选择天体',
  'Focus object': '跟随天体',
  'Learn Mode': '学习模式',
  'Guided observation without points or game levels': '不含积分或关卡的引导式观测',
  'Use the same authoritative Simulation Clock and Astronomy Engine as Explore Mode. Explanations change by Basic or Advanced complexity.': '与探索模式共用同一套权威模拟时钟和天文引擎；说明内容会随基础或进阶复杂度切换。',
  'Event catalogue': '事件目录',
  'Jump and observe': '跳转并观测',
  'Rendering': '渲染',
  'Quality and performance': '画质与性能',
  'Main asteroid belt': '主小行星带',
  'Quality-aware scientific enhancement': '适应画质的科学增强',
  'Offline project': '离线项目',
  'Save now': '立即保存',
  'Close': '关闭',
  'Language': '语言',
  'English': 'English',
  'Simplified Chinese': '简体中文',
  'Learning Scale': '学习比例',
  'Real Distance': '真实距离',
  'Real Scale': '真实比例',
  'Planet size': '行星大小',
  'Orbit spacing': '轨道间距',
  'Orbit lines': '轨道线',
  'Planet and Moon labels': '行星与月球标签',
  'Star field': '星空',
  'Render quality': '渲染画质',
  'Auto': '自动',
  'Battery saver': '省电模式',
  'High detail': '高画质',
  'Explore': '探索',
  'Learn': '学习',
  'Travel': '旅行',
  'Learn Mode active': '学习模式已启用',
  'Travel Mode active': '旅行模式已启用',
  'Explore Mode active': '探索模式已启用',
  'Previous': '上一步',
  'Next': '下一步',
  'Live Moon geometry': '实时月球几何',
  'Observer location': '观测地点',
  'Local sky reference': '本地天空参考',
  'Stored locally': '仅存本机',
  'Active location': '当前地点',
  'Use device location': '使用设备位置',
  'Delete saved location': '删除已保存地点',
  'Save location': '保存地点',
  'Manual latitude and longitude': '手动输入经纬度',
  'Latitude': '纬度',
  'Longitude': '经度',
  'Time zone': '时区',
  'Save observer location': '保存观测地点',
  'Presentation only': '仅影响显示',
  'Sky visibility effects': '天空可见性效果',
  'Enhanced Learning': '增强学习',
  'Real Sky': '真实天空',
  'Atmospheric scattering': '大气散射',
  'Changes visibility only.': '仅改变可见性。',
  'Light pollution': '光污染',
  'Dims faint stars, not calculated positions.': '只减弱暗星，不改变计算位置。',
  'Ground Observer View': '地面观测视图',
  'Visible': '可见',
  'Below horizon': '地平线以下',
  'Altitude': '高度角',
  'Azimuth': '方位角',
  'Local time': '当地时间',
  'Coordinates': '坐标',
  'Multi-location comparison': '多地点比较',
  'Same time, different horizon': '同一时刻，不同地平线',
  'Location': '地点',
  'Visibility': '可见性',
  'Sources & Accuracy': '来源与精度',
  'Educational Accuracy': '教学级精度',
  'Outside Verified Range': '超出已验证范围',
  'High Precision': '高精度',
  'Provider version': '提供器版本',
  'Verified release range': '已验证日期范围',
  'Coordinate system': '坐标系',
  'Epoch': '历元',
  'Licence': '许可',
  'Regression': '回归测试',
  'Visual scale': '视觉比例',
  'Known limitations': '已知限制',
  'Simplified heliocentric ecliptic frame; project x/z orbital plane and y ecliptic north': '简化日心黄道坐标系；项目 x/z 为轨道平面，y 指向黄道北',
  'Simulation epoch 2026-01-01T00:00:00.000Z': '模拟历元 2026-01-01T00:00:00.000Z',
  'Project source; factual astronomical constants are not treated as proprietary content': '项目源码；事实性天文常数不视为专有内容',
  'Uses fixed rounded orbital elements rather than time-varying osculating elements.': '使用固定并取整的轨道根数，而非随时间变化的瞬时轨道根数。',
  'Does not include perturbations, precession, nutation, aberration or light-time correction.': '不包含摄动、岁差、章动、光行差或光行时修正。',
  'Moon orbit uses a fixed inclination and simplified circular distance.': '月球轨道使用固定倾角和简化圆形距离。',
  'Eclipse results represent geometric teaching candidates, not authoritative local circumstances.': '食现象结果仅代表几何教学候选事件，并非权威的本地情况。',
  'Download Scientific Accuracy Report': '下载科学精度报告',
  'Assisted pilot': '辅助驾驶',
  'Visual training offset · scientific route unchanged': '视觉训练偏移 · 科学航线不变',
  'Move spacecraft forward, backward, left, and right': '控制飞船前后左右移动',
  'Up': '上升',
  'Down': '下降',
  'Boost': '加速',
  'Brake': '制动',
  'Rejoin route': '返回航线',
  'Follow': '跟随',
  'Pilot': '驾驶',
  'Free': '自由',
  'Near': '近',
  'Standard': '标准',
  'Far': '远',
  'Fly-by': '飞越',
  'Orbiter': '环绕器',
  'Plan route': '规划航线',
  'Start mission': '开始任务',
  'Restart mission': '重新开始任务',
  'Route available': '航线可用',
  'Route rejected': '航线被拒绝',
  'Earth system': '地球系统',
  'Inner planets': '内行星',
  'Outer giants': '外侧巨行星',
  'Deep-space destinations': '深空目的地',
  'Waiting for launch': '等待发射',
  'Departure burn': '出发点火',
  'Interplanetary cruise': '行星际巡航',
  'Course correction': '航向修正',
  'Destination approach': '接近目的地',
  'Orbital insertion burn': '入轨点火',
  'Fly-by complete': '飞越完成',
  'Orbit achieved': '已进入轨道',
  'Invalid mission': '无效任务',
  'Earth Orbit Demonstration': '地球轨道演示',
  'Hohmann Transfer': '霍曼转移',
  'Direct Transfer': '直接转移',
  'Gravity Assist': '引力助推',
  'Mid-course correction': '中途修正',
  'Orbital insertion': '轨道插入',
  'Closest approach': '最近接近',
  'Single-file offline runtime': '单文件离线运行时',
  'Close controls': '关闭控制项',
  'Quick time presets': '快速时间预设',
  'Exact time': '精确时间',
  'Jump to date and time': '跳转到日期和时间',
  'Objects & View': '天体与视图',
  'Track objects and render quality': '跟随天体与渲染画质',
  'Track object': '跟随天体',
  'Track celestial object': '跟随天体',
  'Phases, events and guided observation': '月相、事件与引导式观测',
  'Experience': '体验模式',
  'Upcoming event': '即将发生的事件',
  'Travel Mode': '旅行模式',
  'Earth-origin robotic mission': '从地球出发的机器人任务',
  'Earth-origin robotic mission planner': '从地球出发的机器人任务规划器',
  'Choose a planet, plan the next supported transfer and watch one shared Simulation Clock move the planets and spacecraft together.': '选择行星、规划下一条受支持的转移航线，并观察共享模拟时钟如何让行星与航天器同步运行。',
  'Hohmann transfer is installed. Direct and gravity-assist routes remain unavailable until dedicated Lambert and patched-conic solvers are installed.': '已安装霍曼转移模型；在专用 Lambert 与拼接圆锥求解器加入前，直接转移和引力助推航线仍不可用。',
  'Eight-planet mission catalogue': '八大行星任务目录',
  'Recalculate route': '重新计算航线',
  'Local': '本地',
  'Destination': '目的地',
  'Mission type': '任务类型',
  'Camera': '相机',
  'Follow distance': '跟随距离',
  'Ground Observer': '地面观测',
  'Altitude, azimuth and local visibility': '高度角、方位角与本地可见性',
  'Installed offline astronomy provider': '已安装的离线天文提供器',
  'Starting offline runtime…': '正在启动离线运行时…',
  'Reload': '重新加载',
  'idle': '空闲',
  'Saving…': '正在保存…',
  'Saved locally': '已保存到本机',
  'Probe': '探测器',
  'Preparing standalone data…': '正在准备 standalone 数据…',
  'Compressing source ZIP in background…': '正在后台压缩源代码 ZIP…',
  'Source ZIP ready': '源代码 ZIP 已就绪',
  'Low, Auto and High vary asteroid density and close-up detail. The belt remains visually sparse rather than a solid wall of rocks.': '低、自动和高画质会调整小行星密度与近景细节；小行星带仍保持稀疏视觉效果，而不是一堵实心岩石墙。',
  'Download .scienceproject': '下载 .scienceproject',
  'Import .scienceproject': '导入 .scienceproject',
  'Export source ZIP': '导出源代码 ZIP',
  'Save locally now': '立即保存到本机',
  'Export standalone HTML': '导出 standalone HTML',
  'Exports include the current time, focus, camera, quality and visual enhancement state.': '导出内容包含当前时间、聚焦对象、相机、画质和视觉增强状态。',
  'Interactive 3D solar system preview': '交互式 3D 太阳系预览',
  'Interactive Canvas 2D solar system fallback with Earth Moon': '包含地球与月球的交互式 Canvas 2D 太阳系兼容视图',
  'Assisted pilot controls': '辅助驾驶控制项',
  'Terrestrial planet': '类地行星',
  'Gas giant': '气态巨行星',
  'Ice giant': '冰巨星',
  'Natural satellite': '天然卫星',
  'G-type main-sequence star': 'G 型主序星',
  'The smallest planet and the closest planet to the Sun.': '太阳系中最小且最靠近太阳的行星。',
  'A cloud-covered planet with a dense carbon-dioxide atmosphere and extreme greenhouse heating.': '一颗被云层覆盖、拥有浓厚二氧化碳大气和极端温室效应的行星。',
  'The ocean-rich planet that supports known life and serves as the observer reference for this release.': '一颗拥有丰富海洋并孕育已知生命的行星，也是本版本的观测参考。',
  'A cold desert planet with iron-rich terrain, polar caps and evidence of ancient water activity.': '一颗寒冷的沙漠行星，具有富铁地表、极冠和远古水活动证据。',
  'The largest planet, with powerful storms, rapid rotation and a strong magnetic environment.': '太阳系最大的行星，拥有强烈风暴、快速自转和强磁场环境。',
  'A low-density giant planet surrounded by a broad and complex ring system.': '一颗低密度巨行星，周围环绕着宽广而复杂的环系。',
  'An ice giant rotating on its side, with a subdued atmosphere, rings and an unusual magnetic field.': '一颗近乎侧躺自转的冰巨星，具有平静的大气、行星环和异常磁场。',
  'A distant blue ice giant with fast winds, storms and an active atmosphere.': '一颗遥远的蓝色冰巨星，拥有高速风、风暴和活跃大气。',
  'The central star whose gravity and radiation dominate the Solar System.': '以引力和辐射主导整个太阳系的中心恒星。',
  'Earth’s natural satellite, responsible for familiar phase cycles and a major influence on tides.': '地球的天然卫星，形成我们熟悉的月相周期，并显著影响潮汐。',
  'Moon Phases': '月相',
  'Observe changing illumination geometry': '观测不断变化的照明几何',
  'The Moon does not make its own visible light. Its familiar phases come from the changing Sun–Earth–Moon viewing geometry.': '月球不会自行发出可见光；熟悉的月相来自不断变化的太阳—地球—月球观测几何。',
  'Start at New Moon': '从新月开始',
  'Move to First Quarter': '前往上弦月',
  'Compare Full Moon': '比较满月',
  'Return through Last Quarter': '经下弦月返回',
  'Solar & Lunar Eclipses': '日食与月食',
  'Understand alignment and orbital nodes': '理解天体排列与轨道交点',
  'An eclipse needs both a suitable Moon phase and a close alignment with the Moon’s tilted orbital plane.': '食现象既需要合适的月相，也需要与倾斜的月球轨道面接近对齐。',
  'Why every New Moon is not an eclipse': '为什么每次新月不会都发生日食',
  'Solar eclipse geometry': '日食几何',
  'Lunar eclipse geometry': '月食几何',
  'Compare observer locations': '比较观测地点',
  'Seasons & Axial Tilt': '季节与地轴倾角',
  'Separate tilt from orbital distance': '区分地轴倾角与轨道距离',
  'Earth’s seasons are mainly caused by its 23.44° axial tilt, which changes solar height and day length through the year.': '地球季节主要由 23.44° 地轴倾角造成，它使太阳高度和昼长在一年中发生变化。',
  'Inspect Earth’s tilted axis': '检视地球倾斜的自转轴',
  'Northern summer geometry': '北半球夏季几何',
  'Equinox geometry': '春分与秋分几何',
  'Distance is not the main cause': '距离并非主要原因',
  'No event was found in the current search window.': '当前搜索时间范围内没有找到事件。',
  'New Moon': '新月',
  'First Quarter Moon': '上弦月',
  'Full Moon': '满月',
  'Last Quarter Moon': '下弦月',
  'Solar Eclipse Geometry': '日食几何',
  'Lunar Eclipse Geometry': '月食几何',
  'Eclipse entries are teaching candidates from the installed educational provider, not authoritative local contact predictions.': '食现象条目是由已安装教学提供器生成的教学候选事件，并非权威的本地接触时刻预报。',
  'Classroom slow motion': '课堂慢动作',
  'School observatory': '学校天文台',
  'Ready · Spacecraft Travel': '就绪 · 航天器旅行',
  'Camera reset to system overview': '相机已重置为系统总览',
  '.scienceproject downloaded': '已下载 .scienceproject',
  'iframe embed code copied': '已复制 iframe 嵌入代码',
  'Choose a valid date and time': '请选择有效的日期和时间',
  'Choose a valid date and time.': '请选择有效的日期和时间。',
  'Simulation time updated': '模拟时间已更新',
  'Simulation time updated.': '模拟时间已更新。',
  'Preset value must be greater than zero': '预设值必须大于零',
  'Custom time preset saved': '自定义时间预设已保存',
  'PWA installation accepted': '已接受安装 PWA',
  'PWA installation dismissed': '已取消安装 PWA',
  'Parameter change undone': '已撤销参数修改',
  'Parameter change restored': '已恢复参数修改',
  'Simulation reset to 01 Jan 2026 UTC': '模拟已重置至 2026 年 1 月 1 日 UTC',
  'Embedding real planet maps and v0.5 controls…': '正在嵌入真实行星贴图与控制项…',
  'Standalone HTML exported · No CDN required': '已导出 standalone HTML · 无需 CDN',
  'Source ZIP exported · Includes HTML and project file': '已导出源代码 ZIP · 包含 HTML 与项目文件',
  'Import blocked': '导入被阻止',
  'Project saved to this device': '项目已保存到此设备',
  'Unable to restore local project': '无法恢复本地项目',
  'Mission stopped · route remains available for review': '任务已停止 · 航线仍可供检查',
  'Device location is not supported by this browser': '此浏览器不支持设备定位',
  'Waiting for optional device location permission…': '正在等待可选的设备定位权限…',
  'Device location saved locally': '设备位置已保存到本机',
  'Scientific Accuracy Report downloaded': '科学精度报告已下载',
  'Simulation Worker failed. Reload the project to retry.': '模拟 Worker 运行失败，请重新加载项目后重试。',
  'Simulation Worker slow to start · using main-thread positions': '模拟 Worker 启动较慢 · 暂时使用主线程位置计算',
  'Framed whole solar system': '已显示完整太阳系',
  'Framed whole solar system · Canvas 2D mode': '已显示完整太阳系 · Canvas 2D 模式',
  'Canvas 2D compatibility mode · Moon and asteroid belt enabled': 'Canvas 2D 兼容模式 · 已启用月球与小行星带',
  'Assisted pilot · rejoining the scientific route': '辅助驾驶 · 正在返回科学航线',
  'Location is never requested automatically. Device permission is optional and purpose-specific.': '应用不会自动请求位置；设备定位权限完全可选且仅用于明确用途。',
  'Project Baseline Kepler Provider': '项目基线开普勒提供器',
  'Educational model only. Planet and event output is not suitable for navigation or civil eclipse prediction.': '仅供教学使用。行星与事件输出不适用于导航或民用食现象预测。',
  'Choose a destination and plan a supported route.': '请选择目的地并规划受支持的航线。',
  'Local Earth-orbit systems demonstration before interplanetary departure.': '在行星际出发前进行本地地球轨道系统演示。',
  'Shorter transfer with a comparatively frequent launch opportunity.': '转移时间较短，发射机会相对频繁。',
  'Multi-year robotic mission requiring a larger heliocentric energy change.': '历时多年的机器人任务，需要更大的日心轨道能量变化。',
  'Long-duration deep-space robotic mission with sparse launch opportunities.': '发射机会稀少的长期深空机器人任务。',
  'A deterministic local orbital rehearsal using the shared Simulation Clock.': '使用共享模拟时钟进行确定性的本地轨道演练。',
  'Two-impulse minimum-energy transfer in an idealised heliocentric two-body model.': '理想化日心二体模型中的双脉冲最小能量转移。',
  'Unavailable in the installed offline baseline.': '当前安装的离线基线不支持。',
  'The embedded standalone configuration is missing. Export the animation again.': '缺少嵌入式 standalone 配置，请重新导出动画。',
  'Radius': '半径',
  'Mass': '质量',
  'Surface gravity': '表面重力',
  'Rotation': '自转周期',
  'Orbit': '公转周期',
  'Sun distance now': '当前日距',
  'Illumination': '照明比例',
  'Phase': '月相',
  'Advanced information': '进阶资料',
  'Axial tilt': '自转轴倾角',
  'Atmosphere': '大气层',
  'Perihelion / aphelion': '近日点 / 远日点',
  'Ecliptic lon / lat': '黄经 / 黄纬',
  'RA / Dec': '赤经 / 赤纬',
  'Exploration': '探索记录',
  'Source note': '来源说明',
  'Guided observation': '引导式观测',
  'Lesson progress': '课程进度',
  'Current observation': '当前观测',
  'Moon phase': '月相',
  'Illuminated': '照明比例',
  'Elongation': '伸距',
  'Above horizon': '地平线以上',
  'Status': '状态',
  'Progress': '进度',
  'Remaining': '剩余时间',
  'Path left': '剩余航程',
  'Remaining time': '剩余时间',
  'Remaining path': '剩余航程',
  'Fuel': '燃料',
  'Mission dashboard': '任务仪表板',
  'No mission planned': '尚未规划任务',
  'Mission active': '任务进行中',
  'Route preview': '航线预览',
  'Mission progress': '任务进度',
  'Plan a valid mission first.': '请先规划一项有效任务。',
  'No valid route': '没有有效航线',
  'No valid route.': '没有有效航线。',
  'Earth orbit': '地球轨道',
  'Hohmann transfer': '霍曼转移',
  'Supported': '支持',
  'Unavailable': '不可用',
  'Departure': '出发',
  'Arrival': '抵达',
  'Transfer path': '转移路径',
  'Required Delta-v': '所需 Delta-v',
  'Phase residual': '相位残差',
  'Fuel remaining': '剩余燃料',
  'Route comparison and scientific rejection': '航线比较与科学拒绝原因',
  'Model limitations': '模型限制',
  'Select a destination to calculate a route.': '请选择目的地以计算航线。',
  'Advanced Realism': '进阶真实性设置',
  'Simplified mission constraints': '简化任务约束',
  'Camera & control': '相机与控制',
  'Follow, pilot, or inspect freely': '跟随、驾驶或自由检视',
  'Pilot is a visual training offset. The scientific trajectory, mission progress, fuel and Delta-v remain unchanged.': '驾驶模式只产生视觉训练偏移；科学轨迹、任务进度、燃料和 Delta-v 均保持不变。',
  'The Moon is in nearly the same sky direction as the Sun, so the side facing Earth is mostly dark.': '月球与太阳在天空中的方向几乎相同，因此面向地球的一侧大多处于黑暗中。',
  'Geocentric solar elongation is close to 0°. The illuminated fraction approaches zero in the baseline geometry.': '地心太阳伸距接近 0°；在基线几何模型中，照明比例趋近于零。',
  'About half of the visible lunar disk is illuminated when the Moon is roughly one quarter through its phase cycle.': '当月球运行到月相周期约四分之一处时，可见月面约有一半被照亮。',
  'Solar elongation is close to 90°. The visible illuminated fraction is approximately 50%.': '太阳伸距接近 90°，可见照明比例约为 50%。',
  'The Moon is opposite the Sun in Earth’s sky, so its Earth-facing side appears almost fully illuminated.': '月球在地球天空中与太阳相对，因此面向地球的一侧看起来几乎完全被照亮。',
  'Solar elongation is close to 180°. Exact local rise and set times depend on observer location.': '太阳伸距接近 180°；确切的本地升落时间取决于观测地点。',
  'The illuminated half changes side as the Moon moves toward the next New Moon.': '随着月球趋向下一次新月，被照亮的半边会改变方向。',
  'Solar elongation approaches 270° in the project’s signed phase convention.': '在本项目的带符号月相约定中，太阳伸距趋近 270°。',
  'The Moon’s orbit is tilted, so it usually passes above or below the Sun in our sky.': '月球轨道存在倾角，因此它通常会从天空中的太阳上方或下方经过。',
  'The lunar orbital plane is inclined by about 5.145°. A solar eclipse needs New Moon geometry near an orbital node.': '月球轨道面倾角约为 5.145°；日食需要新月几何发生在轨道交点附近。',
  'The Moon moves between Earth and the Sun and its shadow can cross part of Earth.': '月球运行到地球与太阳之间，其影子可能扫过地球的一部分。',
  'The baseline provider identifies a teaching candidate from low lunar ecliptic latitude at New Moon. It does not calculate an authoritative ground track.': '基线提供器会根据新月时较低的月球黄纬识别教学候选事件，但不计算权威的地面路径。',
  'Earth moves between the Sun and Moon, and the Moon can pass through Earth’s shadow.': '地球运行到太阳与月球之间，月球可能穿过地球的影子。',
  'The event requires Full Moon geometry near an orbital node. Local visibility also requires the Moon to be above the observer’s horizon.': '该事件需要满月几何位于轨道交点附近；本地可见还要求月球处于观测者地平线以上。',
  'The same eclipse may be visible from one place and below the horizon from another.': '同一次食现象可能在一个地点可见，而在另一个地点位于地平线以下。',
  'Use altitude and azimuth at the event time to compare geometric visibility. The educational provider does not model a precise umbral magnitude or contact times.': '使用事件时刻的高度角与方位角比较几何可见性；教学提供器不模拟精确的本影食分或接触时刻。',
  'Earth’s axis stays tilted in nearly the same direction as Earth travels around the Sun.': '地球绕太阳运行时，自转轴大致保持朝向同一方向。',
  'The project renders a fixed 23.44° axial tilt. The baseline model does not yet include long-term precession or nutation.': '项目使用固定的 23.44° 自转轴倾角；基线模型尚未包含长期岁差或章动。',
  'When the Northern Hemisphere tilts toward the Sun, sunlight arrives more directly and days are longer there.': '当北半球朝向太阳倾斜时，阳光入射更直接，白昼也更长。',
  'Positive solar declination raises the Sun’s daily path for northern observers and lowers it for southern observers.': '正太阳赤纬会抬高北半球观测者看到的太阳日周路径，并降低南半球的路径。',
  'Near an equinox, neither hemisphere is strongly tilted toward the Sun.': '在分点附近，两个半球都没有明显朝向太阳倾斜。',
  'Solar declination is near 0°, so the day–night boundary passes close to both geographic poles.': '太阳赤纬接近 0°，因此昼夜分界线接近两个地理极点。',
  'Earth is actually closest to the Sun during part of Northern Hemisphere winter.': '实际上，地球在北半球冬季的一段时间内最接近太阳。',
  'Earth’s orbital eccentricity is modest. Seasonal solar-angle and day-length changes dominate over the small annual distance variation.': '地球轨道偏心率较小；季节性的太阳高度角和昼长变化远比微小的年度距离变化更重要。',
  'Rounded educational constants compiled for the project baseline.': '为项目基线汇编并取整的教学常数。',
  'Extremely thin exosphere, mainly oxygen, sodium, hydrogen, helium and potassium.': '极其稀薄的外逸层，主要含氧、钠、氢、氦和钾。',
  'Mostly carbon dioxide with nitrogen and sulfuric-acid cloud layers.': '以二氧化碳为主，并含氮和硫酸云层。',
  'Mostly nitrogen and oxygen, with water vapour and trace gases.': '以氮和氧为主，并含水汽与微量气体。',
  'Thin atmosphere dominated by carbon dioxide, with nitrogen and argon.': '稀薄大气以二氧化碳为主，并含氮和氩。',
  'Mostly hydrogen and helium with ammonia, methane, water and complex cloud chemistry.': '以氢和氦为主，并含氨、甲烷、水和复杂云层化学成分。',
  'Mostly hydrogen and helium, with ammonia, methane and layered clouds.': '以氢和氦为主，并含氨、甲烷和分层云系。',
  'Hydrogen, helium and methane above water, ammonia and methane-rich interior layers.': '上层含氢、氦和甲烷，内部具有富含水、氨和甲烷的层结构。',
  'Hydrogen, helium and methane with deeper volatile-rich layers.': '含氢、氦和甲烷，深层富含挥发性物质。',
  'Photosphere, chromosphere, transition region and corona above the convective surface layers.': '对流表层之上依次为光球、色球、过渡区和日冕。',
  'Extremely tenuous exosphere.': '极其稀薄的外逸层。',
  '23 h 56 min sidereal day': '23 小时 56 分钟恒星日',
  '24 h 37 min': '24 小时 37 分钟',
  'About 25 days at the equator': '赤道处约 25 天',
  'Solar System reference centre': '太阳系参考中心',
  'Travels with Earth near 1 AU': '随地球在约 1 AU 处运行',
  'Visited by Mariner 10 and MESSENGER; BepiColombo is designed for detailed Mercury science.': '水手 10 号与信使号曾到访；贝皮科伦坡号用于开展详细的水星科学研究。',
  'Studied by Venera landers, Magellan radar mapping and several atmospheric missions.': '曾由金星系列着陆器、麦哲伦号雷达测绘和多项大气任务研究。',
  'Continuously observed by ground networks and Earth-observing spacecraft.': '由地面观测网络和地球观测航天器持续监测。',
  'Explored by orbiters, landers and rovers including long-running surface science missions.': '由轨道器、着陆器和巡视器探索，其中包括长期地表科学任务。',
  'Studied by fly-bys, the Galileo orbiter and the Juno mission.': '由多次飞越任务、伽利略号轨道器和朱诺号任务研究。',
  'Observed by multiple fly-bys and studied in depth by the Cassini orbiter.': '经历多次飞越观测，并由卡西尼号轨道器深入研究。',
  'Visited closely by Voyager 2 and observed remotely by space and ground telescopes.': '旅行者 2 号曾近距离到访，并由太空与地面望远镜持续遥测。',
  'Visited by Voyager 2 and monitored remotely for atmospheric change.': '旅行者 2 号曾到访，之后通过遥测监测其大气变化。',
  'Observed continuously from Earth and by dedicated solar observatories and heliophysics missions.': '由地面观测站、专用太阳观测台和太阳物理任务持续观测。',
  'Visited by robotic orbiters and landers and by human Apollo surface missions.': '曾由机器人轨道器、着陆器以及载人阿波罗地表任务到访。',
};

const PATTERNS_ZH_CN: Array<[RegExp, (...matches: string[]) => string]> = [
  [/^Day ([\d.-]+)$/, (value) => `第 ${value} 天`],
  [/^([\d.]+) fps$/, (value) => `${value} 帧/秒`],
  [/^([\d.]+)% illuminated$/, (value) => `照明比例 ${value}%`],
  [/^(.+), ([\d.]+)% illuminated$/, (name, value) => `${PHASE_NAMES[name] ?? name}，照明比例 ${value}%`],
  [/^Probe · ([\d.]+)%$/, (value) => `探测器 · ${value}%`],
  [/^Focused on (.+)$/, (name) => `已聚焦${translateObjectEnglishName(name)}`],
  [/^([\d]+) destinations?$/, (value) => `${value} 个目的地`],
  [/^Direction · Forward$/, () => '方向 · 正向'],
  [/^Direction · Reverse$/, () => '方向 · 反向'],
  [/^Tracking (.+)$/, (name) => `正在跟随${translateObjectEnglishName(name)}`],
  [/^Inspecting (.+)$/, (name) => `正在检视${translateObjectEnglishName(name)}`],
  [/^Route planned · Earth to (.+)\.$/, (name) => `航线已规划 · 地球至${translateObjectEnglishName(name)}。`],
  [/^Mission started · (.+)\.$/, (name) => `任务已开始 · ${translateObjectEnglishName(name)}。`],
  [/^Project imported · (.+)$/, (name) => `项目已导入 · ${name}`],
  [/^Restored local project · (.+)$/, (date) => `已恢复本地项目 · ${date}`],
  [/^Solar System v(.+) runtime ready$/, (version) => `太阳系 v${version} 运行时已就绪`],
  [/^Solar System v(.+) ready · Spacecraft Travel$/, (version) => `太阳系 v${version} 已就绪 · 航天器旅行`],
  [/^Adaptive quality · (normal|low|safe)$/, (tier) => `自适应画质 · ${{ normal: '正常', low: '低', safe: '安全' }[tier] ?? tier}`],
  [/^Tracking (.+) with system context$/, (name) => `正在环境中跟随${translateObjectEnglishName(name)}`],
  [/^Tracking (.+) with system context · Canvas 2D mode$/, (name) => `正在环境中跟随${translateObjectEnglishName(name)} · Canvas 2D 模式`],
  [/^Inspecting (.+) close up$/, (name) => `正在近距离检视${translateObjectEnglishName(name)}`],
  [/^Focused on (.+) · Canvas 2D mode$/, (name) => `已聚焦${translateObjectEnglishName(name)} · Canvas 2D 模式`],
  [/^(Follow|Assisted pilot|Free) spacecraft camera active( · Canvas 2D mode)?$/, (mode, canvas) => `${EXACT_ZH_CN[mode] ?? mode}航天器相机已启用${canvas ? ' · Canvas 2D 模式' : ''}`],
  [/^Mission paused · (.+)\.?$/, (label) => `任务已暂停 · ${EXACT_ZH_CN[label] ?? label}。`],
  [/^Learning observation focused on (.+)$/, (name) => `学习观测已聚焦${translateObjectEnglishName(name)}`],
  [/^Jumped to (.+)\.?$/, (event) => `已跳转至${EXACT_ZH_CN[event] ?? event}。`],
  [/^Saved observer location · (.+)$/, (name) => `已保存观测地点 · ${name}`],
  [/^Location was not used · (.+)$/, (reason) => `未使用定位 · ${reason}`],
  [/^([\d.]+) hours$/, (value) => `${value} 小时`],
  [/^([\d.]+) days$/, (value) => `${value} 天`],
  [/^([\d.]+) years$/, (value) => `${value} 年`],
  [/^([\d,.]+) Earth days(, retrograde)?$/, (value, retrograde) => `${value} 个地球日${retrograde ? '，逆行' : ''}`],
  [/^About ([\d.]+) h ([\d.]+) min(, retrograde)?$/, (hours, minutes, retrograde) => `约 ${hours} 小时 ${minutes} 分钟${retrograde ? '，逆行' : ''}`],
  [/^([\d,.]+) days(, tidally locked)?$/, (value, locked) => `${value} 天${locked ? '，潮汐锁定' : ''}`],
  [/^([\d.]+) AU mean orbital distance$/, (value) => `平均轨道距离 ${value} AU`],
  [/^([\d,.]+) km$/, (value) => `${value} km`],
  [/^([\d.]+) AU$/, (value) => `${value} AU`],
  [/^([\d.]+) passed$/, (value) => `${value} 项通过`],
  [/^([\d]+)\/([\d]+) passed$/, (passed, total) => `${passed}/${total} 项通过`],
  [/^(Reverse · )?([\d.]+) min\/s$/, (reverse, value) => `${reverse ? '反向 · ' : ''}${value} 分钟/秒`],
  [/^(Reverse · )?([\d.]+) hours?\/s$/, (reverse, value) => `${reverse ? '反向 · ' : ''}${value} 小时/秒`],
  [/^(Reverse · )?([\d.]+) day\/s$/, (reverse, value) => `${reverse ? '反向 · ' : ''}${value} 天/秒`],
  [/^(Reverse · )?([\d.]+) week\/s$/, (reverse, value) => `${reverse ? '反向 · ' : ''}${value} 周/秒`],
  [/^(Reverse · )?([\d.]+) month\/s$/, (reverse, value) => `${reverse ? '反向 · ' : ''}${value} 月/秒`],
  [/^(Reverse · )?([\d.]+) year\/s$/, (reverse, value) => `${reverse ? '反向 · ' : ''}${value} 年/秒`],
  [/^Focus (Sun|Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|Moon)$/, (name) => `检视${translateObjectEnglishName(name)}`],
  [/^(Sun|Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|Moon) · (.+)$/, (name, kind) => `${translateObjectEnglishName(name)} · ${EXACT_ZH_CN[kind] ?? kind}`],
  [/^(Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune) (Conjunction|Opposition|Perihelion|Aphelion)$/, (name, event) => `${translateObjectEnglishName(name)}${({ Conjunction: '合', Opposition: '冲', Perihelion: '近日点', Aphelion: '远日点' } as Record<string, string>)[event]}`],
];

function translateObjectEnglishName(name: string): string {
  return Object.values(OBJECT_NAMES).find((item) => item.en === name)?.['zh-CN'] ?? name;
}

export function normalizeLocale(value: unknown): AppLocale {
  return value === 'zh-CN' || value === 'en' ? value : DEFAULT_LOCALE;
}

export function localeFromStorage(storage: Storage | undefined = globalThis.localStorage): AppLocale {
  try {
    return normalizeLocale(storage?.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function persistLocale(locale: AppLocale, storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Sandboxed/file:// standalone documents may not expose persistent storage.
  }
}

export function objectName(objectId: string, locale: AppLocale): string {
  return OBJECT_NAMES[objectId]?.[locale] ?? objectId;
}

export function phaseName(source: string, locale: AppLocale): string {
  return locale === 'zh-CN' ? PHASE_NAMES[source] ?? source : source;
}

export function missionRejectionText(code: string | undefined, fallback: string, locale: AppLocale): string {
  if (locale !== 'zh-CN') return fallback;
  if (code === 'insufficient-delta-v') {
    const values = fallback.match(/([\d.]+) km\/s/g) ?? [];
    return values.length >= 2
      ? `简化任务预算 ${values[0]} 低于所需的 ${values[1]}。`
      : '简化任务的 Delta-v 预算不足。';
  }
  if (code === 'launch-solution-not-converged') return '在当前教学模型阈值内未能收敛出霍曼发射解。';
  if (code === 'earth-requires-orbiter') return '地球仅提供轨道演练，请选择环绕器而不是飞越。';
  if (code === 'earth-orbit-insufficient-fuel') return '所选简化燃料预算不足以完成地球轨道演练。';
  return translateText(fallback, locale);
}

export function translateText(source: string, locale: AppLocale): string {
  if (locale === 'en' || !source.trim()) return source;
  const leading = source.match(/^\s*/)?.[0] ?? '';
  const trailing = source.match(/\s*$/)?.[0] ?? '';
  const core = source.slice(leading.length, source.length - trailing.length);
  const exact = EXACT_ZH_CN[core];
  if (exact) return `${leading}${exact}${trailing}`;
  for (const [pattern, formatter] of PATTERNS_ZH_CN) {
    const match = core.match(pattern);
    if (match) return `${leading}${formatter(...match.slice(1))}${trailing}`;
  }
  return source;
}

export interface I18n {
  readonly locale: AppLocale;
  t(key: MessageKey): string;
  text(source: string): string;
  objectName(objectId: string): string;
  phaseName(source: string): string;
  number(value: number, options?: Intl.NumberFormatOptions): string;
  date(value: Date | number | string, options?: Intl.DateTimeFormatOptions): string;
}

const numberFormatCache = new Map<string, Intl.NumberFormat>();
const dateFormatCache = new Map<string, Intl.DateTimeFormat>();

function formatterKey(locale: AppLocale, options: object): string {
  return `${locale}:${JSON.stringify(options)}`;
}

export function createI18n(localeInput: unknown): I18n {
  const locale = normalizeLocale(localeInput);
  const intlLocale = locale === 'zh-CN' ? 'zh-CN' : 'en-SG';
  return {
    locale,
    t: (key) => locale === 'zh-CN' ? ZH_CN_MESSAGES[key] : EN_MESSAGES[key],
    text: (source) => translateText(source, locale),
    objectName: (objectId) => objectName(objectId, locale),
    phaseName: (source) => phaseName(source, locale),
    number: (value, options = {}) => {
      const key = formatterKey(locale, options);
      let formatter = numberFormatCache.get(key);
      if (!formatter) {
        formatter = new Intl.NumberFormat(intlLocale, options);
        numberFormatCache.set(key, formatter);
      }
      return formatter.format(value);
    },
    date: (value, options = {}) => {
      const key = formatterKey(locale, options);
      let formatter = dateFormatCache.get(key);
      if (!formatter) {
        formatter = new Intl.DateTimeFormat(intlLocale, options);
        dateFormatCache.set(key, formatter);
      }
      return formatter.format(new Date(value));
    },
  };
}

const LOCALIZED_ATTRIBUTES = ['aria-label', 'aria-valuetext', 'title', 'placeholder'] as const;
const DATA_I18N_ATTRIBUTES = ['data-i18n', 'data-i18n-aria-label', 'data-i18n-title', 'data-i18n-placeholder'] as const;

export class DomLocalizer {
  private readonly root: HTMLElement;
  private locale: AppLocale;
  private readonly sourceText = new WeakMap<Text, string>();
  private readonly sourceAttributes = new WeakMap<Element, Map<string, string>>();
  private observer?: MutationObserver;
  private applying = false;

  constructor(root: HTMLElement, locale: AppLocale) {
    this.root = root;
    this.locale = locale;
  }

  start(): void {
    this.localize();
    this.observer = new MutationObserver((records) => {
      if (this.applying) return;
      this.applying = true;
      this.observer?.disconnect();
      try {
        for (const record of records) {
          if (record.type === 'characterData' && record.target instanceof Text) {
            this.sourceText.set(record.target, record.target.data);
            this.localizeTextNode(record.target);
          } else if (record.type === 'childList') {
            record.addedNodes.forEach((node) => this.localizeNode(node));
          } else if (record.type === 'attributes' && record.target instanceof Element && record.attributeName) {
            if ((LOCALIZED_ATTRIBUTES as readonly string[]).includes(record.attributeName)) {
              this.captureAndLocalizeAttribute(record.target, record.attributeName);
            } else {
              this.localizeDataKeys(record.target);
            }
          }
        }
      } finally {
        this.observe();
        this.applying = false;
      }
    });
    this.observe();
  }

  setLocale(locale: AppLocale): void {
    if (locale === this.locale) return;
    this.locale = locale;
    this.localize();
  }

  refresh(): void {
    this.localize();
  }

  destroy(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  private localize(): void {
    this.applying = true;
    this.observer?.disconnect();
    this.localizeNode(this.root);
    this.observe();
    this.applying = false;
  }

  private observe(): void {
    this.observer?.observe(this.root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...LOCALIZED_ATTRIBUTES, ...DATA_I18N_ATTRIBUTES],
    });
  }

  private localizeNode(node: Node): void {
    if (node instanceof Text) {
      this.localizeTextNode(node);
      return;
    }
    if (!(node instanceof Element)) return;
    for (const attribute of LOCALIZED_ATTRIBUTES) this.captureAndLocalizeAttribute(node, attribute);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();
    while (current) {
      this.localizeTextNode(current as Text);
      current = walker.nextNode();
    }
    node.querySelectorAll('*').forEach((element) => {
      for (const attribute of LOCALIZED_ATTRIBUTES) this.captureAndLocalizeAttribute(element, attribute);
    });
    this.localizeDataKeys(node);
  }

  private localizeDataKeys(root: Element): void {
    const elements = [root, ...root.querySelectorAll('[data-i18n],[data-i18n-aria-label],[data-i18n-title],[data-i18n-placeholder]')];
    const i18n = createI18n(this.locale);
    for (const element of elements) {
      const textKey = element.getAttribute('data-i18n') as MessageKey | null;
      if (textKey && textKey in EN_MESSAGES) element.textContent = i18n.t(textKey);
      for (const [dataAttribute, targetAttribute] of [
        ['data-i18n-aria-label', 'aria-label'],
        ['data-i18n-title', 'title'],
        ['data-i18n-placeholder', 'placeholder'],
      ] as const) {
        const key = element.getAttribute(dataAttribute) as MessageKey | null;
        if (key && key in EN_MESSAGES) element.setAttribute(targetAttribute, i18n.t(key));
      }
    }
  }

  private localizeTextNode(node: Text): void {
    const existingSource = this.sourceText.get(node);
    const source = existingSource ?? node.data;
    if (!existingSource) this.sourceText.set(node, source);
    const translated = translateText(source, this.locale);
    if (node.data !== translated) node.data = translated;
  }

  private captureAndLocalizeAttribute(element: Element, attribute: string): void {
    const current = element.getAttribute(attribute);
    if (current === null) return;
    let sources = this.sourceAttributes.get(element);
    if (!sources) {
      sources = new Map();
      this.sourceAttributes.set(element, sources);
    }
    const source = sources.get(attribute) ?? current;
    if (!sources.has(attribute)) sources.set(attribute, source);
    const translated = translateText(source, this.locale);
    if (current !== translated) element.setAttribute(attribute, translated);
  }
}

export function setDocumentLocale(locale: AppLocale): void {
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
  document.title = locale === 'zh-CN'
    ? '科学动画生成器'
    : 'Scientific Animation Generator';
}
