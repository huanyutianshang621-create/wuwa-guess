/* ============================================================
 * 鸣潮立绘猜猜看 · 角色数据
 * ------------------------------------------------------------
 * 一个角色一行，改这个文件就能增删角色、改属性。
 *
 *   id      唯一标识，不能重复（图鉴、存档都用它）
 *   name    显示的名字（也是名字题的正确答案）
 *   element 六属性之一：glacio 冷凝 / fusion 热熔 / electro 导电
 *                      aero 气动 / spectro 衍射 / havoc 湮灭
 *   star    星级，5 或 4
 *   weapon  武器种类
 *   version 上线版本
 *   img     立绘文件名，放在图片目录里（见 config.js 的 IMG_DIRS）
 *
 * 数据来源：鸣潮灰机wiki 的「Data:角色.tabx」数据表，
 * 核对时间 2026-11-19（该表当时覆盖到 3.8 版本共 57 名自机角色）。
 * 注意两处资产名与正式名不一致，已按正式名填写：
 *   Bailian = 白芷（二测名「白莲」的拼音）
 *   Jueyuan = 维里奈（二测名「觉远」的拼音）
 * 另外忌炎的立绘文件叫 T_ActivityRoleJiyan1.webp，带一个后缀 1。
 * ============================================================ */

window.WUWA_CHARACTERS = [
  { id: "aimisi",     name: "爱弥斯",     element: "fusion",  star: 5, weapon: "迅刀",   version: "3.1", img: "T_ActivityRoleAimisi.webp" },
  { id: "anke",       name: "安可",       element: "fusion",  star: 5, weapon: "音感仪", version: "1.0", img: "T_ActivityRoleAnke.webp" },
  { id: "aogusita",   name: "奥古斯塔",   element: "electro", star: 5, weapon: "长刃",   version: "2.6", img: "T_ActivityRoleAogusita.webp" },
  { id: "bailian",    name: "白芷",       element: "glacio",  star: 4, weapon: "音感仪", version: "1.0", img: "T_ActivityRoleBailian.webp" },
  { id: "bulante",    name: "布兰特",     element: "fusion",  star: 5, weapon: "迅刀",   version: "2.1", img: "T_ActivityRoleBulante.webp" },
  { id: "buling",     name: "卜灵",       element: "electro", star: 4, weapon: "音感仪", version: "2.8", img: "T_ActivityRoleBuling.webp" },
  { id: "changli",    name: "长离",       element: "fusion",  star: 5, weapon: "迅刀",   version: "1.1", img: "T_ActivityRoleChangli.webp" },
  { id: "chun",       name: "椿",         element: "havoc",   star: 5, weapon: "迅刀",   version: "1.4", img: "T_ActivityRoleChun.webp" },
  { id: "daniya",     name: "达妮娅",     element: "fusion",  star: 5, weapon: "音感仪", version: "3.3", img: "T_ActivityRoleDaniya.webp" },
  { id: "danjin",     name: "丹瑾",       element: "havoc",   star: 4, weapon: "迅刀",   version: "1.0", img: "T_ActivityRoleDanjin.webp" },
  { id: "dengdeng",   name: "灯灯",       element: "electro", star: 4, weapon: "长刃",   version: "1.4", img: "T_ActivityRoleDengdeng.webp" },
  { id: "feibi",      name: "菲比",       element: "spectro", star: 5, weapon: "音感仪", version: "2.1", img: "T_ActivityRoleFeibi.webp" },
  { id: "feixue",     name: "绯雪",       element: "glacio",  star: 5, weapon: "迅刀",   version: "3.3", img: "T_ActivityRoleFeixue.webp" },
  { id: "fuluoluo",   name: "弗洛洛",     element: "havoc",   star: 5, weapon: "音感仪", version: "2.5", img: "T_ActivityRoleFuluoluo.webp" },
  { id: "jiabeilina", name: "嘉贝莉娜",   element: "fusion",  star: 5, weapon: "佩枪",   version: "2.7", img: "T_ActivityRoleJiabeilina.webp" },
  { id: "jianxin",    name: "鉴心",       element: "aero",    star: 5, weapon: "臂铠",   version: "1.0", img: "T_ActivityRoleJianxin.webp" },
  { id: "jingran",    name: "景燃",       element: "fusion",  star: 5, weapon: "长刃",   version: "3.6", img: "T_ActivityRoleJingran.webp" },
  { id: "jinxi",      name: "今汐",       element: "spectro", star: 5, weapon: "长刃",   version: "1.1", img: "T_ActivityRoleJinxi.webp" },
  { id: "jiyan",      name: "忌炎",       element: "aero",    star: 5, weapon: "长刃",   version: "1.0", img: "T_ActivityRoleJiyan1.webp" },
  { id: "jueyuan",    name: "维里奈",     element: "spectro", star: 5, weapon: "音感仪", version: "1.0", img: "T_ActivityRoleJueyuan.webp" },
  { id: "kakaluo",    name: "卡卡罗",     element: "electro", star: 5, weapon: "长刃",   version: "1.0", img: "T_ActivityRoleKakaluo.webp" },
  { id: "kanteleila", name: "坎特蕾拉",   element: "havoc",   star: 5, weapon: "音感仪", version: "2.2", img: "T_ActivityRoleKanteleila.webp" },
  { id: "katixiya",   name: "卡提希娅",   element: "aero",    star: 5, weapon: "迅刀",   version: "2.4", img: "T_ActivityRoleKatixiya.webp" },
  { id: "kelaita",    name: "珂莱塔",     element: "glacio",  star: 5, weapon: "佩枪",   version: "2.0", img: "T_ActivityRoleKelaita.webp" },
  { id: "libeika",    name: "丽贝卡",     element: "electro", star: 5, weapon: "佩枪",   version: "3.4", img: "T_ActivityRoleLibeika.webp" },
  { id: "lili",       name: "莉莉",       element: "spectro", star: 5, weapon: "佩枪",   version: "3.8", img: "T_ActivityRoleLili.webp" },
  { id: "lingyang",   name: "凌阳",       element: "glacio",  star: 5, weapon: "臂铠",   version: "1.0", img: "T_ActivityRoleLingyang.webp" },
  { id: "linnai",     name: "琳奈",       element: "spectro", star: 5, weapon: "佩枪",   version: "3.0", img: "T_ActivityRoleLinnai.webp" },
  { id: "luhesi",     name: "陆·赫斯",    element: "spectro", star: 5, weapon: "臂铠",   version: "3.1", img: "T_ActivityRoleLuhesi.webp" },
  { id: "luokeke",    name: "洛可可",     element: "havoc",   star: 5, weapon: "臂铠",   version: "2.0", img: "T_ActivityRoleLuokeke.webp" },
  { id: "luosela",    name: "洛瑟菈",     element: "glacio",  star: 5, weapon: "音感仪", version: "3.4", img: "T_ActivityRoleLuosela.webp" },
  { id: "lupa",       name: "露帕",       element: "fusion",  star: 5, weapon: "长刃",   version: "2.4", img: "T_ActivityRoleLupa.webp" },
  { id: "luxi",       name: "露西",       element: "spectro", star: 5, weapon: "佩枪",   version: "3.4", img: "T_ActivityRoleLuxi.webp" },
  { id: "mofeite",    name: "莫特斐",     element: "fusion",  star: 4, weapon: "佩枪",   version: "1.0", img: "T_ActivityRoleMofeite.webp" },
  { id: "moning",     name: "莫宁",       element: "fusion",  star: 5, weapon: "长刃",   version: "3.0", img: "T_ActivityRoleMoning.webp" },
  { id: "qianxiao",   name: "千咲",       element: "havoc",   star: 5, weapon: "长刃",   version: "2.8", img: "T_ActivityRoleQianxiao.webp" },
  { id: "qingxiao",   name: "清宵",       element: "aero",    star: 5, weapon: "迅刀",   version: "3.6", img: "T_ActivityRoleQingxiao.webp" },
  { id: "qiushui",    name: "秋水",       element: "aero",    star: 4, weapon: "佩枪",   version: "1.0", img: "T_ActivityRoleQiushui.webp" },
  { id: "qiuyuan",    name: "仇远",       element: "aero",    star: 5, weapon: "迅刀",   version: "2.7", img: "T_ActivityRoleQiuyuan.webp" },
  { id: "sanhua",     name: "散华",       element: "glacio",  star: 4, weapon: "迅刀",   version: "1.0", img: "T_ActivityRoleSanhua.webp" },
  { id: "shouanren",  name: "守岸人",     element: "spectro", star: 5, weapon: "音感仪", version: "1.3", img: "T_ActivityRoleShouanren.webp" },
  { id: "suisui",     name: "穗穗",       element: "glacio",  star: 5, weapon: "音感仪", version: "3.5", img: "T_ActivityRoleSuisui.webp" },
  { id: "suoming",    name: "锁暝",       element: "electro", star: 5, weapon: "迅刀",   version: "3.7", img: "T_ActivityRoleSuoming.webp" },
  { id: "taoqi",      name: "桃祈",       element: "havoc",   star: 4, weapon: "长刃",   version: "1.0", img: "T_ActivityRoleTaoqi.webp" },
  { id: "xiakong",    name: "夏空",       element: "aero",    star: 5, weapon: "佩枪",   version: "2.3", img: "T_ActivityRoleXiakong.webp" },
  { id: "xiangliyao", name: "相里要",     element: "electro", star: 5, weapon: "臂铠",   version: "1.2", img: "T_ActivityRoleXiangliyao.webp" },
  { id: "xigelika",   name: "西格莉卡",   element: "aero",    star: 5, weapon: "臂铠",   version: "3.2", img: "T_ActivityRoleXigelika.webp" },
  { id: "xin",        name: "心",         element: "electro", star: 5, weapon: "音感仪", version: "3.7", img: "T_ActivityRoleXin.webp" },
  { id: "xuanling",   name: "秧秧·玄翎",  element: "havoc",   star: 5, weapon: "迅刀",   version: "3.5", img: "T_ActivityRoleXuanling.webp" },
  { id: "yangyang",   name: "秧秧",       element: "aero",    star: 4, weapon: "迅刀",   version: "1.0", img: "T_ActivityRoleYangyang.webp" },
  { id: "yinlin",     name: "吟霖",       element: "electro", star: 5, weapon: "音感仪", version: "1.0", img: "T_ActivityRoleYinlin.webp" },
  { id: "youhu",      name: "釉瑚",       element: "glacio",  star: 4, weapon: "臂铠",   version: "1.3", img: "T_ActivityRoleYouhu.webp" },
  { id: "younuo",     name: "尤诺",       element: "aero",    star: 5, weapon: "臂铠",   version: "2.6", img: "T_ActivityRoleYounuo.webp" },
  { id: "yuanwu",     name: "渊武",       element: "electro", star: 4, weapon: "臂铠",   version: "1.0", img: "T_ActivityRoleYuanwu.webp" },
  { id: "zanni",      name: "赞妮",       element: "spectro", star: 5, weapon: "臂铠",   version: "2.3", img: "T_ActivityRoleZanni.webp" },
  { id: "zhezhi",     name: "折枝",       element: "glacio",  star: 5, weapon: "音感仪", version: "1.2", img: "T_ActivityRoleZhezhi.webp" },
  { id: "zhixia",     name: "炽霞",       element: "fusion",  star: 4, weapon: "佩枪",   version: "1.0", img: "T_ActivityRoleZhixia.webp" }
];
