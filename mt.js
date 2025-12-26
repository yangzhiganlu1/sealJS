
// ==UserScript==
// @name         早安/赞助/呼风唤雨/赚钱/收入/雪王插件
// @author       雪王 & 蜜桃
// @version      1.0.1
// @description  1225,修改:圣诞为什么要加班，修复了好多好多未知问题
// @timestamp    1766544987
// @license      MIT
// ==/UserScript==


(() => {

    const VERSION = "1.0.1";
    const STORAGE_KEY_Morning = "morning";
    const STORAGE_KEY_ERROR = "error";
    const STORAGE_KEY_SPONSOR = "sponsor";
    const STORAGE_KEY_FISH_CD_TIMERS = "fish_cd_timers";
    const STORAGE_KEY_MONEY = "money_";
    const STORAGE_KEY_OTHERS_MONEY = "others_money";
    const STORAGE_KEY_TIMEOUT = "timeout_record";
    const STORAGE_KEY_STAMINA = "stamina";
    const AutoReplyRulesLocal = [
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchExact", value: "你好" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["泥嚎", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "哈" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["哈哈哈哈哈哈哈哈哈哈哈", 1],
                        ["哈哈哈哈哈哈哈哈", 1],
                        ["哈哈哈哈哈", 1],
                        ["哈哈哈", 1],
                        ["哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: false,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "困" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["一起水饺吧~~", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchExact", value: "好哦" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["好哦~", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchExact", value: "补药" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["9494，补药！", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "猪" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["你们是小猪！", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "想你" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["雪王也想你啦~", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "宝宝" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["宝宝~~", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchExact", value: "雪王" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["是呀，是呀，我就是雪王！", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchExact", value: "白神" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["[图:data/images/bai.png]", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "犭者" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["你们是小犭者！", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "pig" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["You are little piglets!", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "呜" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["你的眼泪是珍珠，可不能随便掉哦。我帮你好好收着~", 1],
                        ["快来我怀里，给你一个超大的拥抱，把所有难过都挤走！", 1],
                        ["叮咚！您的专属安慰快递已送达，请注意查收一颗甜甜的糖和一朵小花花🌼", 1],
                        ["嘘 —— 告诉你一个秘密，连乌云都在夸你，说你哭完笑起来的样子最好看啦！", 1],
                        ["辛苦啦！现在开始，你只需要做一件事：那就是被我喜欢和关心！", 1],
                        ["让我们像重启电脑一样重启今天：Ctrl + Alt + 开心！", 1],
                        ["叮！您的专属客服已上线。检测到您需要一顿好吃的服务，现已全力为您安排！附加赠言：今天的你也超迷人！", 1],
                        ["宝宝~虽然你现在被小乌云笼罩，但别忘了，你本身就是一道彩虹呀！等乌云散了，大家都会看到你有多绚烂！", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "夸" }
            ],
            results: [
                {
                    delay: 0,
                    resultType: "replyToSender",
                    message: [
                        ["宝宝~每次和你聊完天，都觉得世界又美好了一点，你就是有这种魔力！", 1],
                        ["宝宝~世界因为你变得柔软了一点，谢谢你存在！", 1],
                        ["宝宝~你怎么这么棒！是吃彩虹长大的吗？", 1],
                        ["宝宝~你是我心里最坚韧、最棒的小朋友呀！", 1],
                        ["宝宝~你就像一个小太阳，不是那种刺眼的光，是那种暖暖的，让人想靠近的光~", 1],
                        ["宝宝~能遇见你，是我这辈子最幸运的事之一！", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchExact", value: "你好点了吗" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["你好点了吗", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "早安" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["宝宝早上好呀～要来杯蜜桃四季春开启甜蜜的一天嘛？", 1],
                        ["早！今天的珍珠特别Q弹，要尝尝吗？", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "午安" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["午安...zzz...啊不对！我还没睡着！要来杯咖啡提神吗？", 1],
                        ["午间特惠！第二杯半价！错过等明天！", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            key: "goodnight",
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "晚安" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["宝宝晚安～许个愿吧，说不定明天会有惊喜哦！", 1],
                        ["宝宝晚安...最后一口冰淇淋...zzz 归我啦...", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            key: "love",
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "爱" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["你爱我，我爱你，蜜雪冰城甜蜜蜜~", 1],
                        ["[图:data/images/xuewang2.png]", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            key: "bye",
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "拜拜" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["宝宝别走~", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            key: "who_are_you",
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchFuzzy", value: "你是谁" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        [
                            "我是雪王！\n[图:data/images/xuewang.png]",
                            1
                        ]
                    ]
                }
            ]
        }),
        JSON.stringify({
            key: "peach",
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchFuzzy", value: "蜜桃" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["[CQ:at,qq=3425655273] 蜜桃在这！草饲！", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchContains", value: "啊" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", 1],
                        ["啊啊啊啊啊啊", 1],
                        ["啊啊啊啊啊啊啊啊", 1],
                        ["啊啊啊啊啊啊啊啊啊啊啊啊啊", 1]
                    ]
                }
            ]
        }),
        JSON.stringify({
            enable: true,
            conditions: [
                { condType: "textMatch", matchType: "matchExact", value: "噗" }
            ],
            results: [
                {
                    resultType: "replyToSender",
                    delay: 0,
                    message: [
                        ["噗", 1]
                    ]
                }
            ]
        })

    ];
    
    function storageGet(ext, key, defaultVal) {
        try {
            const raw = ext.storageGet(key);
            if (!raw) return defaultVal;
            return JSON.parse(raw);
        } catch (e) {
            return defaultVal;
        }
    }

    function storageSet(ext, key, obj) {
        try {
            ext.storageSet(key, JSON.stringify(obj));
        } catch (e) {
            // ignore
        } 
    } 

    function dateStrFromTs(ts) {
        const d = new Date(ts * 1000);
        const Y = d.getFullYear();
        const M = String(d.getMonth() + 1).padStart(2, "0");
        const D = String(d.getDate()).padStart(2, "0");
        return `${Y}-${M}-${D}`;
    }

    function textMentionsSbQQ(text, qq) {
        if (!text) return false;
        const plain = String(text);
        if (plain.indexOf(qq) !== -1) return true;
        if (plain.indexOf("QQ:" + qq) !== -1) return true;
        return false;
    }

    function normalizeUid(raw) {
        if (!raw) return "";
        const m = String(raw).match(/([1-9][0-9]{4,})/);
        return m ? m[1] : String(raw);
    }

    function isBetween(start, end, now) {
        if (start > end) {
            return now >= start || now < end;
        } else {
            return now < end && now > start;
        }
    }

    function pickMessage(msgList) {
        if (!msgList || msgList.length === 0) return "";
        if (msgList.length === 1) return msgList[0];
        return msgList[Math.floor(Math.random() * msgList.length)]
    }

    function pickMessageWithWeighting(msgList) {
        if (!msgList || msgList.length === 0) return "";
        if (msgList.length === 1) return msgList[0][0];

        let total = 0;
        for (const m of msgList) {
            total += m[1] || 1;
        }
        let r = Math.random() * total;

        for (const m of msgList) {
            const w = m[1] || 1;
            if (r < w) return m[0];
            r -= w;
        }
        return msgList[0][0];
    }

    function printCheckDict(dict) {
        let output = "今日早安的宝宝有：";
        for (let [id, card] of Object.entries(dict).sort((a, b) => a[1].ts - b[1].ts)) {
            let time = new Date(card.ts);
            output += `\n『${time.getHours()}:${time.getMinutes()}』的「${card.nickname}」`;
        }
        return output;
    }

    function nowTs() {
        return Math.floor(Date.now() / 1000);
    }

    function cleanupOldTimers(list, expireSec = 3600) {
        const now = nowTs();
        return list.filter(e => now - e.triggerTs <= expireSec);
    }

    function extractFirstNumericId(text) {
        if (!text) return null;
        // 先找 QQ:12345
        const mQQ = text.match(/QQ[:：]\s*([1-9][0-9]{4,})/i);
        if (mQQ) return mQQ[1];
        // 再找 CQ 或 at 格式里出现的数字，如 [CQ:at,qq=123]
        const mAt = text.match(/qq\s*=\s*([1-9][0-9]{4,})/i);
        if (mAt) return mAt[1];
        // 最后找裸数字（第一个连续 5+ 位数字）
        const mNum = text.match(/([1-9][0-9]{4,})/);
        if (mNum) return mNum[1];
        return null;
    }

    function matchRule(text, cond) {
        if (!text) return false;
        if (!cond || !cond.matchType) return false;

        switch (cond.matchType) {
            case "matchExact":
                return text === cond.value;

            case "matchContains":
                return text.includes(cond.value);

            case "matchNotContains":
                return !text.includes(cond.value);

            case "matchRegex":
                try {
                    const reg = new RegExp(cond.value);
                    return reg.test(text);
                } catch (e) {
                    return false;
                }

            case "matchFuzzy": // 等同包含
                return text.includes(cond.value);

            default:
                return false;
        }
    }
    /**
     *@param {number} timeout - ms
     */
    function setTimeoutFishing(ext,ctx,msg,timeout){
        let record = storageGet(ext,STORAGE_KEY_TIMEOUT,[]);
        const now = new Date();
        if (timeout > 0){
            const target = new Date(now.getTime() + timeout);
            record.push(`from ${now.toLocaleTimeString()} | target ${target.toLocaleTimeString()}`)
            setTimeout(() => {
                seal.replyToSender(ctx,msg,`[CQ:at,qq=${FISH_BOT_USERID}] /抛竿丰收`)
            }, timeout);
        } else if (timeout == 0) {
            record.push(`from ${now.toLocaleTimeString()} | immediately`)
            seal.replyToSender(ctx,msg,`[CQ:at,qq=${FISH_BOT_USERID}] /抛竿丰收`)
        }
        storageSet(ext,STORAGE_KEY_TIMEOUT,record);
    }


    function main() {
        let inactive = true;
        let ext = seal.ext.find("mt");
        if (!ext) {
            ext = seal.ext.new("mt", "MT", VERSION);


            const cmdThx = seal.ext.newCmdItemInfo();
            cmdThx.name = "赞助";
            cmdThx.help = `.赞助 help，以下是指令格式：
.赞助        【感谢所有金主爸爸妈妈】
.赞助  <名称>  <金额>  【记录<名称>赞助了<金额>】
`;
            cmdThx.solve = (ctx, msg, cmdArgs) => {
                try {
                    CHATGROUPS = getCHATGROUP(ext);
                    THXWORDS = getTHXWORDS(ext);
                    const arg1 = cmdArgs.getArgN(1) || "";
                    const arg2 = cmdArgs.getArgN(2) || "";
                    const sub = ("" + arg1).trim().toLowerCase();
                    const fromUserGroupID = normalizeUid(ctx.group.groupId);
                    let dictSponsor = storageGet(ext, STORAGE_KEY_SPONSOR, {});
                    if (!CHATGROUPS.includes(fromUserGroupID)) {
                        return;
                    }
                    switch (sub) {
                        case "help": {
                            const ret = seal.ext.newCmdExecuteResult(true);
                            ret.showHelp = true;
                            return ret;
                        }
                        case "": {
                            if (dictSponsor == null) { 
                                seal.replyToSender(ctx, msg, `还没收到赞助~`);
                                break;
                            }
                            if (Object.keys(dictSponsor).length == 0) {
                                seal.replyToSender(ctx, msg, `还没收到赞助~`);
                                break;
                            }
                            let output = `感谢:\n`;
                            for (let id in dictSponsor) {
                                if (dictSponsor[id] != 0 && dictSponsor[id] != null){
                                output += `${id}(${dictSponsor[id]}r)、`
                                }
                            }
                            output = output.slice(0, -1);
                            output += `\n`;
                            output += THXWORDS[Math.floor(Math.random() * THXWORDS.length)];
                             seal.replyToSender(ctx, msg, output); 
                            break;
                        }
                        default:
                            if (arg1 && arg2 && (ctx.privilegeLevel >= 100)) {
                                let value = parseFloat(arg2);
                                if (isNaN(value)) {
                                    seal.replyToSender(ctx, msg, `"${arg2}"不是一个有效的数值~`);
                                    break;
                                }
                                if (arg1 in dictSponsor) {
                                    seal.replyToSender(ctx, msg, `小雪记住了~${arg1}之前赞助了${dictSponsor[arg1]}r，刚刚又赞助了${value}r，一共赞助了${dictSponsor[arg1] + value}r`);
                                    dictSponsor[arg1] += value;
                                } else {
                                    seal.replyToSender(ctx, msg, `小雪记住了~${arg1}刚刚赞助了${value}r`);
                                    dictSponsor[arg1] = value;
                                }
                                storageSet(ext, STORAGE_KEY_SPONSOR, dictSponsor);

                            } else {
                                // 添加权限不足的提示
                                if (ctx.privilegeLevel < 100) {
                                    seal.replyToSender(ctx, msg, `请让雪王或蜜桃来帮你录入吧~`);
                                } else {
                                    seal.replyToSender(ctx, msg, `参数错误，请检查格式：.赞助 [名字] [金额]`);
                                }

                            }
                            break;
                    }

                } catch (e) {
                    console.log(e);
                }
            }

        //==========================================命令：雪王指令====================================
        const cmdXueWang = seal.ext.newCmdItemInfo();
        cmdXueWang.name = "雪王";
        cmdXueWang.help = `控制雪王向小咪啪发出指令：\n.雪王 xxx\n让 bot 发送：@小咪啪 /xxx`;

        // 解析规则
        cmdXueWang.solve = (ctx, msg, cmdArgs) => {
            try {
                
                FISH_BOT_USERID = getBotId(ext);
                const fromUserGroupID = normalizeUid(ctx.group.groupId);
                if (!FISHGROUP.includes(fromUserGroupID)) {
                    return;
                }
                const text = cmdArgs.cleanArgs;
                if (!text) {
                    seal.replyToSender(ctx, msg, "用法：.雪王 内容");
                    return seal.ext.newCmdExecuteResult(true);
                }
                if (text.includes('设置')) {
                    return seal.ext.newCmdExecuteResult(true);
                }
                if (text.includes('确')) {
                    text += '⁣';
                }

                const sendMsg = `[CQ:at,qq=${FISH_BOT_USERID}] /${text}`;
                seal.replyToSender(ctx, msg, sendMsg);

                return seal.ext.newCmdExecuteResult(true);
            } catch (error) {
                return seal.ext.newCmdExecuteResult(true);
            }
        };
        //==========================================命令：金币指令====================================
        const cmdMoney = seal.ext.newCmdItemInfo();
        cmdMoney.name = "查看收入"; 
        cmdMoney.help = `.查看收入 help，以下是指令格式：
.查看收入            【显示昨天的收入】
.查看收入 list             【所有列表】
.查看收入 cal             【计算一次收入】
.查看收入 avg              【查看平均收入(每天)】
.查看收入 give <id> <数量>       【给<id>赠送<数量>金币】
.查看收入 clear      【！！！清空！！！所有！！！记录！！！】
`;
        cmdMoney.solve = (ctx,msg,cmdArgs) => {
            try {
                
                const arg1 = cmdArgs.getArgN(1) || "";
                const sub = ("" + arg1).trim().toLowerCase();
                const fromUserGroupID = normalizeUid(ctx.group.groupId);
                if (fromUserGroupID != "1041391088"){
                    return;
                }
                let arrMoney = storageGet(ext,STORAGE_KEY_MONEY,[]);
                let arrMainMoney = arrMoney.filter((m) => m.main);
                switch (sub) {
                    case "help":{
                        const ret = seal.ext.newCmdExecuteResult(true);
                        ret.showHelp = true;
                        return ret;
                    }
                    case "":{
                        if (arrMainMoney.length <= 1){
                            seal.replyToSender(ctx, msg, "没有数据");
                            break;
                        }
                        const curMoney = parseInt(arrMainMoney[0].value,10);
                        const prevMoney = parseInt(arrMainMoney[1].value,10);
                        if (curMoney > prevMoney){
                            seal.replyToSender(ctx, msg, `昨天赚了${curMoney - prevMoney}`); 
                        } else {
                            seal.replyToSender(ctx, msg, `昨天亏了${prevMoney - curMoney}，再也不买股票了呜呜呜...`); 
                        }
                                                    
                        break;
                    }
                    case "list":{
                        if (arrMoney.length <= 0){
                            seal.replyToSender(ctx, msg, "没有数据");
                            break;
                        }
                        let output = `全部记录（共 ${arrMoney.length} 条）：\n`;
                        for (let i = 0 ; i < arrMoney.length ; ++i){
                            const curDate = new Date(arrMoney[i].ts);
                            output += `${dateStrFromTs(curDate.getTime()/1000)} ${curDate.toLocaleTimeString()} - ${arrMoney[i].value}`;
                            if (i + 1 < arrMoney.length){
                                output += `\(${(arrMoney[i].value >= arrMoney[i+1].value) ? '+':''}${arrMoney[i].value - arrMoney[i+1].value}\)`;
                            }
                            output += '\n';
                        }
                        seal.replyToSender(ctx, msg, output);
                        break;
                    }
                    case "avg":{
                        if (arrMoney.length <= 1){
                            seal.replyToSender(ctx, msg, "没有数据");
                            break;
                        }
                        const curMoney = parseInt(arrMoney[0].value,10);
                        const prevMoney = parseInt(arrMoney[arrMoney.length-1].value,10);
                        const curDate = new Date(arrMoney[0].ts);
                        const prevDate = new Date(arrMoney[arrMoney.length-1].ts);
                        if (curMoney > prevMoney){
                            seal.replyToSender(ctx, msg, `平均每天赚了${Math.round((curMoney - prevMoney)*86400000/(arrMoney[0].ts-arrMoney[arrMoney.length-1].ts))} \(${dateStrFromTs(prevDate.getTime()/1000)} ${prevDate.toLocaleTimeString()}\[${prevMoney}\] ~ ${dateStrFromTs(curDate.getTime()/1000)} ${curDate.toLocaleTimeString()}\[${curMoney}\] \)`);
                        } else {
                            seal.replyToSender(ctx, msg, `平均每天亏了${Math.round((prevMoney - curMoney)*86400000/(arrMoney[0].ts-arrMoney[arrMoney.length-1].ts))}，领导真不是人TAT \(${dateStrFromTs(prevDate.getTime()/1000)} ${prevDate.toLocaleTimeString()}\[${prevMoney}\] ~ ${dateStrFromTs(curDate.getTime()/1000)} ${curDate.toLocaleTimeString()}\[${curMoney}\] \)`);
                        }
                        break;
                    }
                    case "give":{
                        const arg2 = (cmdArgs.getArgN(2) || "").toLowerCase()
                        const arg3 = (cmdArgs.getArgN(3) || "").toLowerCase()
                        seal.replyToSender(ctx,msg,`[CQ:at,qq=${FISH_BOT_USERID}] /赠送金币 ${arg2} ${arg3}`)
                        setTimeout(() => {seal.replyToSender(ctx,msg,`@小咪啪Kira 确定`)}, 2000);
                        break;
                    }
                    case "clear":{
                        if (ctx.privilegeLevel < 100) {
                            seal.replyToSender(ctx, msg, "不准清~");
                            break;
                        }
                        storageSet(seal.ext,STORAGE_KEY_MONEY,[]);
                        seal.replyToSender(ctx, msg, "清掉了");
                        break;
                    }
                    case "cal":{
                        seal.replyToSender(ctx, msg, `[CQ:at,qq=${FISH_BOT_USERID}] /升级鱼塘 9999999`);
                    }
                    default:
                        break;
                }

            } catch (error) {
                return seal.ext.newCmdExecuteResult(true);
            }
        }

        //==========================================命令：赚钱指令====================================
        const cmdOthersMoney = seal.ext.newCmdItemInfo();
        cmdOthersMoney.name = "赚钱"; 
        cmdOthersMoney.help = `.赚钱 help，需要手动 @小咪啪Kira /升级鱼塘9999999 来记录，以下是指令格式，qq号不填默认自己的：
.赚钱 <qq号>           【显示<qq号>之前的收入】
.赚钱 list <qq号>      【显示<qq号>的收入列表】
.赚钱 avg <qq号>             【查看<qq号>的平均收入(每天)】
.赚钱 clear <qq号>     【！！！清空！！！<qq号> 的！！！所有！！！记录！！！】
`;
        cmdOthersMoney.solve = (ctx,msg,cmdArgs) => {
            try {
                
                const arg1 = cmdArgs.getArgN(1) || "";
                const sub = ("" + arg1).trim().toLowerCase();
                const fromUserGroupID = normalizeUid(ctx.group.groupId);
                if (fromUserGroupID != "1041391088"){
                    return;
                }
                const atUid = normalizeUid(msg.sender.userId);
                let dict = storageGet(ext,STORAGE_KEY_OTHERS_MONEY,{});
                let arrMoney = [];
                if (atUid in dict){
                    arrMoney = dict[atUid];
                }
                switch (sub) {
                    case "help":{
                        const ret = seal.ext.newCmdExecuteResult(true);
                        ret.showHelp = true;
                        return ret;
                    }
                    case "":{
                        if (arrMoney.length <= 1){
                            seal.replyToSender(ctx, msg, "没有数据");
                            break;
                        }
                        const curMoney = parseInt(arrMoney[0].value,10);
                        const prevMoney = parseInt(arrMoney[1].value,10);
                        const curDate = new Date(arrMoney[0].ts);
                        const prevDate = new Date(arrMoney[1].ts);
                        if (curMoney > prevMoney){
                            seal.replyToSender(ctx, msg, `之前赚了${curMoney - prevMoney} \(${dateStrFromTs(prevDate.getTime()/1000)} ${prevDate.toLocaleTimeString()}\[${prevMoney}\] ~ ${dateStrFromTs(curDate.getTime()/1000)} ${curDate.toLocaleTimeString()}\[${curMoney}\] \)`); 
                        } else {
                            seal.replyToSender(ctx, msg, `之前亏了${prevMoney - curMoney} \(${dateStrFromTs(prevDate.getTime()/1000)} ${prevDate.toLocaleTimeString()}\[${prevMoney}\] ~ ${dateStrFromTs(curDate.getTime()/1000)} ${curDate.toLocaleTimeString()}\[${curMoney}\] \)`); 
                        }                         
                        break;
                    }
                    case "list":{
                        const arg2 = cmdArgs.getArgN(2) || "";
                        if (arg2){
                            if (arg2 in dict){
                                arrMoney = dict[arg2];
                            } else {
                                seal.replyToSender(ctx, msg, "没有对方的数据哦~");
                                break;
                            }
                        }
                        if (arrMoney.length <= 0){
                            seal.replyToSender(ctx, msg, "没有数据");
                            break;
                        }
                        let output = `全部记录（共 ${arrMoney.length} 条）：\n`;
                        for (let i = 0 ; i < arrMoney.length ; ++i){
                            const curDate = new Date(arrMoney[i].ts);
                            output += `${dateStrFromTs(curDate.getTime()/1000)} ${curDate.toLocaleTimeString()} - ${arrMoney[i].value}`;
                            if (i + 1 < arrMoney.length){
                                output += `\(${(arrMoney[i].value >= arrMoney[i+1].value) ? '+':''}${arrMoney[i].value - arrMoney[i+1].value}\)`;
                            }
                            output += '\n';
                        }
                        seal.replyToSender(ctx, msg, output);
                        break;
                    }
                    case "avg":{
                        const arg2 = cmdArgs.getArgN(2) || "";
                        if (arg2){
                            if (arg2 in dict){
                                arrMoney = dict[arg2];
                            } else {
                                seal.replyToSender(ctx, msg, "没有对方的数据哦~");
                                break;
                            }
                        }
                        if (arrMoney.length <= 1){
                            seal.replyToSender(ctx, msg, "没有数据");
                            break;
                        }
                        const curMoney = parseInt(arrMoney[0].value,10);
                        const prevMoney = parseInt(arrMoney[arrMoney.length-1].value,10);
                        const curDate = new Date(arrMoney[0].ts);
                        const prevDate = new Date(arrMoney[arrMoney.length-1].ts);
                        if (curMoney > prevMoney){
                            seal.replyToSender(ctx, msg, `平均每天赚了${Math.round((curMoney - prevMoney)*86400000/(arrMoney[0].ts-arrMoney[arrMoney.length-1].ts))} \(${dateStrFromTs(prevDate.getTime()/1000)} ${prevDate.toLocaleTimeString()}\[${prevMoney}\] ~ ${dateStrFromTs(curDate.getTime()/1000)} ${curDate.toLocaleTimeString()}\[${curMoney}\] \)`);
                        } else {
                            seal.replyToSender(ctx, msg, `平均每天亏了${Math.round((prevMoney - curMoney)*86400000/(arrMoney[0].ts-arrMoney[arrMoney.length-1].ts))} \(${dateStrFromTs(prevDate.getTime()/1000)} ${prevDate.toLocaleTimeString()}\[${prevMoney}\] ~ ${dateStrFromTs(curDate.getTime()/1000)} ${curDate.toLocaleTimeString()}\[${curMoney}\] \)`);
                        }
                        break;
                    }
                    case "clear":{
                        if (ctx.privilegeLevel < 100) {
                            seal.replyToSender(ctx, msg, "不准清~");
                            break;
                        }
                        const arg2 = cmdArgs.getArgN(2) || "";
                        if (arg2){
                            if (arg2 in dict){
                                atUid = arg2;
                            }
                        }
                        delete dict[atUid];
                        storageSet(ext,STORAGE_KEY_OTHERS_MONEY,dict);
                        seal.replyToSender(ctx, msg, "把数据吃掉了，嗝~");
                        break;
                    }
                    default:
                        break;
                }

            } catch (error) {
                let arrError = storageGet(ext, STORAGE_KEY_ERROR, []);
                arrError.push(`${Date.now().toLocaleString()} - ${e}`);
                storageSet(ext, STORAGE_KEY_ERROR, arrError);
            }
        }

        const cmdFishingRecord = seal.ext.newCmdItemInfo();
            cmdFishingRecord.name = "抛竿记录";
            cmdFishingRecord.help = `.抛竿记录 查看记录`;
            cmdFishingRecord.solve = (ctx, msg, cmdArgs) => {
                try {
                    const arg1 = cmdArgs.getArgN(1) || "";
                    const sub = ("" + arg1).trim().toLowerCase();
                    const fromUserGroupID = normalizeUid(ctx.group.groupId);
                    if (fromUserGroupID != "1041391088"){
                        return;
                    }
                    switch (sub) {
                        case "help":{
                            const ret = seal.ext.newCmdExecuteResult(true);
                            ret.showHelp = true;
                            return ret;
                        }
                        case "":{
                            const record = storageGet(ext,STORAGE_KEY_TIMEOUT,[]);
                            if (record.length == 0){
                                seal.replyToSender(ctx,msg,`没有记录`)
                                break;
                            } 
                            let output = '';
                            for (let i = 0 ; i < record.length ; ++i){
                                output += record[i];
                                output += '\n';
                            }
                            seal.replyToSender(ctx,msg,output);
                            break;
                        }
                        default:
                            break;
                    }
                } catch(e) {
                    let arrError = storageGet(ext, STORAGE_KEY_ERROR, []);
                    arrError.push(`${Date.now().toLocaleString()} - ${e}`);
                    storageSet(ext, STORAGE_KEY_ERROR, arrError);
                }
            }

            const cmdStamina = seal.ext.newCmdItemInfo();
            cmdStamina.name = "体力";
            cmdStamina.help = `.体力help，用法:
.体力                   【显示提示】
.体力 <当前体力>         【计算需要多久回满体力】
.体力 max <体力上限>     【设置体力上限】
.体力 sp <体力回复速度>  【设置体力回复速度，默认为1，例:你有+50%回复速度就 .体力 sp 1.5】
.体力 re                【开/关满体力提示，打开的话使用.体力 <当前体力>会在快满体力的时候提醒你】
`;
            cmdStamina.solve = (ctx, msg, cmdArgs) => {
                try {
                    const arg1 = cmdArgs.getArgN(1) || "";
                    const sub = ("" + arg1).trim().toLowerCase();
                    const fromUserGroupID = normalizeUid(ctx.group.groupId);
                    const Uid = normalizeUid(msg.sender.userId);
                    let dictPlayer = storageGet(ext,STORAGE_KEY_STAMINA,{});
                    let player;
                    if (Uid in dictPlayer){
                        player = dictPlayer[Uid];
                    } else {
                        player = {
                            max: 0,
                            speed: 1.0,
                            re: false,
                            timer: -1
                        }
                    }
                    if (fromUserGroupID != "1041391088"){
                        return;
                    }
                    switch (sub) {
                        case "":
                        case "help":
                            const ret = seal.ext.newCmdExecuteResult(true);
                            ret.showHelp = true;
                            return ret;
                        case "max":{
                            const arg2 = cmdArgs.getArgN(2) || "";
                            let value = parseInt(arg2);
                            if (isNaN(value)){
                                seal.replyToSender(ctx, msg, `"${arg2}"不是一个有效的数值~`);
                                break;
                            }
                            if (value < 1){
                                seal.replyToSender(ctx, msg, `体力上限不能小于1~`);
                                break;
                            }
                            player.max = value;
                            dictPlayer[Uid] = player;
                            storageSet(ext,STORAGE_KEY_STAMINA,dictPlayer);
                            break;
                        }
                        case "sp":{
                            const arg2 = cmdArgs.getArgN(2) || "";
                            let value = parseFloat(arg2);
                            if (isNaN(value)){
                                seal.replyToSender(ctx, msg, `"${arg2}"不是一个有效的数值~`);
                                break;
                            }
                            if (value <= 0){
                                seal.replyToSender(ctx, msg, `体力回复速度必须为正数~`);
                                break;
                            }
                            player.speed = value;
                            dictPlayer[Uid] = player;
                            storageSet(ext,STORAGE_KEY_STAMINA,dictPlayer);
                            break;
                        }
                        case "re":{
                            player.re = !player.re;
                            dictPlayer[Uid] = player;
                            storageSet(ext,STORAGE_KEY_STAMINA,dictPlayer);
                            if (player.re){
                                seal.replyToSender(ctx, msg, `已开启提醒`);
                            } else {
                                seal.replyToSender(ctx, msg, `已关闭提醒`);
                                if (player.timer != -1){
                                    clearTimeout(player.timer)
                                }
                            }
                            break;
                        }
                        default:
                            if (player.max == 0){
                                seal.replyToSender(ctx, msg, `请先使用 .体力 max <体力上限> 设置体力上限`);
                                break;
                            }
                            let value = parseInt(sub);
                            if (isNaN(value)){
                                seal.replyToSender(ctx, msg, `"${sub}"不是一个有效的数值~`);
                                break;
                            }
                            if (value < 0){
                                seal.replyToSender(ctx, msg, `当前体力不能小于0~`);
                                break;
                            }
                            if (value >= player.max){
                                seal.replyToSender(ctx, msg, `当前体力必须小于体力上限(${player.max})~`);
                                break;
                            }
                            const stamina = player.max - value;
                            const time = stamina*360000/player.speed;
                            const target = new Date(Date.now() + time);
                            if (player.timer != -1){
                                clearTimeout(player.timer)
                            }
                            if (player.re){
                                seal.replyToSender(ctx,msg,`[CQ:at,qq:${Uid}] 体力预计在${target.toLocaleTimeString()}回满，小雪会提醒你的~`)
                                player.timer = setTimeout(() => {
                                    seal.replyToSender(ctx,msg,`[CQ:at,qq:${Uid}] 小雪提醒你，体力要回满喽~`)
                                    player.timer = -1;
                                }, time - 360000);
                            } else {
                                seal.replyToSender(ctx,msg,`[CQ:at,qq:${Uid}] 体力预计在${target.toLocaleTimeString()}回满~`)
                            }
                            dictPlayer[Uid] = player;
                            storageSet(ext,STORAGE_KEY_STAMINA,dictPlayer);
                            break;
                    }
                } catch(e) {
                    console.log(e);
                    let arrError = storageGet(ext, STORAGE_KEY_ERROR, []);
                    arrError.push(`${Date.now().toLocaleString()} - ${e}`);
                    storageSet(ext, STORAGE_KEY_ERROR, arrError);
                }
            }

        
            ext.cmdMap['赞助'] = cmdThx;
            ext.cmdMap['雪'] = cmdXueWang;
            ext.cmdMap['雪王'] = cmdXueWang;
            ext.cmdMap['收入'] = cmdMoney;
            ext.cmdMap['查看收入'] = cmdMoney;
            ext.cmdMap['赚钱'] = cmdOthersMoney;
            ext.cmdMap['抛竿记录'] = cmdFishingRecord;
            ext.cmdMap['体力'] = cmdStamina;



            seal.ext.register(ext)

            seal.ext.registerTask(ext, "cron", "*/5 * * * *", (()=>{
                const FISH_BOT_USERID = getBotId(ext)
                let timers = storageGet(ext, STORAGE_KEY_FISH_CD_TIMERS, []);
                timers = cleanupOldTimers(timers);

                const exists = timers.some(e =>
                    e.groupId === "1041391088"
                );

                if (!exists){
                    const ep = seal.getEndPoints()[0];
                    const fakeMsg = seal.newMessage();
                    fakeMsg.groupId = "QQ-Group:1041391088";
                    fakeMsg.messageType = "group";
                    fakeMsg.platform = "QQ";
                    fakeMsg.sender = {
                        nickname: "猪",
                        userId: "QQ:1220450657"
                    };
                    const fakeCtx = seal.createTempCtx(ep,fakeMsg);
                    setTimeoutFishing(ext,fakeCtx,fakeMsg,0);
                    setTimeoutFishing(ext,fakeCtx,fakeMsg,1000 * parseInt(seal.ext.getStringConfig(ext, "fish_cd_delay_2"), 10));
                }
            }));

            seal.ext.registerTemplateConfig(
                ext,
                "chat_groups",
                [
                    "732523535",
                    "623619309",
                    "621591811",
                ],
                "聊天群"
            );

            seal.ext.registerTemplateConfig(
                ext,
                "morning_words",
                [
                    "早安",
                    "早上好",
                    "早",
                ],
                "触发早安的词"
            );

            seal.ext.registerTemplateConfig(
                ext,
                "fish_group",
                ["1041391088"]
            );

            seal.ext.registerTemplateConfig(
                ext,
                "fish_up",
                [
                    "是个大物，快收！",
                    "有大家伙！快来！",
                    "浮标起飞了，快来截口！",
                    "竿尖弯了，快收！",
                    "上货了，快发力！",
                    "上钩了！快来！",
                    "竿身大弯，稳住！",
                    "轮子出线了，是巨物！",
                    "咬钩了，快来！",
                    "鱼上钩了，快来！",
                    "有动静，快来！",
                    "浮漂沉了，速来！",
                    "线绷直了，发力！"
                ]
            );

            seal.ext.registerTemplateConfig(
                ext,
                "ban_group",
                [
                    "740988608",
                    "678057532",
                ]
            );

            seal.ext.registerTemplateConfig(
                ext,
                "morning_success_reply",
                [
                    "早上好，「{nickname}」宝宝~今天也是元气满满的一天呢~要像小雪一样活力四射哦！(๑•̀ㅂ•́)و✧",
                    "晨光温柔，万物可爱。愿你的一天，从好心情开始。早安呀！「{nickname}」宝宝~",
                    "「{nickname}」宝宝~小雪已经收到过你的早安啦！要像小雪一样懂得摸鱼，才能活力满满迎接新一天！(◍•ᴗ•◍)✧",
                    "「{nickname}」宝宝~如果宝宝想当躺平冠军的话...那小雪陪你一起躺！(瘫成小熊饼.jpg)",
                ],
                "正常触发早安的回复"
            );
            seal.ext.registerTemplateConfig(
                ext,
                "morning_repeat_reply",
                [
                    "「{nickname}」宝宝~小雪已经收到过你的早安啦！要像小雪一样懂得摸鱼，才能活力满满迎接新一天！(◍•ᴗ•◍)✧",
                    "「{nickname}」宝宝~如果宝宝想当躺平冠军的话...那小雪陪你一起躺！(瘫成小熊饼.jpg)"
                ],
                "重复触发早安的回复"
            );
            seal.ext.registerTemplateConfig(
                ext,
                "morning_fail_reply",
                [
                    "「{nickname}」宝宝~很遗憾~七至十二时才是互道早安的时刻哦~",
                    "「{nickname}」宝宝~“早安” 的营业时间是 7:00-12:00 哦~ 现在的特别问候已为你切换为 “日安 / 晚安”，请查收！🌞",
                ],
                "非早安时段触发早安的回复"
            );
            seal.ext.registerStringConfig(
                ext,
                "fish_bot_id",
                "3889686462"
            );
            seal.ext.registerIntConfig(ext, "morning_start_time", 7, "早安时段开始时间(小时)");
            seal.ext.registerIntConfig(ext, "morning_end_time", 12, "早安时段结束时间(小时)");
            seal.ext.registerIntConfig(ext, "settleMentHour", 9, "结算时间(小时)");
            seal.ext.registerIntConfig(ext, "settleMentMinute", 0, "结算时间(分钟)");
            seal.ext.registerStringConfig(ext, "fish_cd_delay_1", "20", "丰收CD 第一次延迟（秒）");
            seal.ext.registerStringConfig(ext, "fish_cd_delay_2", "40", "丰收CD 第二次延迟（秒）");
            seal.ext.registerStringConfig(ext, "fish_cd_window", "40", "重复触发判定窗口（±秒）");
            seal.ext.registerStringConfig(ext, "botqqid", "2322534068", "小猪的qq号");
            seal.ext.registerTemplateConfig(
                ext,
                "chat_groups",
                [
                    "732523535",
                    "623619309",
                    "621591811",
                    "1041391088"
                ]
            );

            seal.ext.registerTemplateConfig(
                ext,
                "thx_words",
                [
                    "感谢你的支持，让小雪离周游世界的梦想更近一步啦！\n[图:data/images/thx2.png]",
                    "你像柠檬茶里的蜂蜜，让我的日常变得甜而不腻～！\n[图:data/images/thx1.png]",
                    "和你在一起的时光，比全糖奶茶还要让人开心！\n[图:data/images/thx6.png]"
                ]
            );

            seal.ext.registerTemplateConfig(ext, "auto_reply_rules", AutoReplyRulesLocal);


            function getPigId(ext) {
                return seal.ext.getStringConfig(ext, "botqqid") || "2322534068";
            }

            function getBANGROUP(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "ban_group") || [];
                // TemplateConfig 是数组，每个元素就是一行
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }

            function getSettleMentHour(ext) {
                return seal.ext.getIntConfig(ext, "settleMentHour") || 9;
            }
            function getSettleMentMinute(ext) {
                return seal.ext.getIntConfig(ext, "settleMentMinute") || 0;
            }

            function getMORNINGWORDS(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "morning_words") || [];
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }

            function getMorningStartTime(ext) {
                return Math.min(23, Math.max(0, (seal.ext.getIntConfig(ext, "morning_start_time"))));
            }

            function getMorningEndTime(ext) {
                return Math.min(23, Math.max(0, (seal.ext.getIntConfig(ext, "morning_end_time") || 12)));
            }

            function getMorningSuccessWords(ext) {
                return seal.ext.getTemplateConfig(ext, "morning_success_reply") || [""];
            }

            function getMorningRepeatWords(ext) {
                return seal.ext.getTemplateConfig(ext, "morning_repeat_reply") || [""];
            }

            function getMorningFailWords(ext) {
                return seal.ext.getTemplateConfig(ext, "morning_fail_reply") || [""];
            }

            function replaceNickname(message, nickname) {
                return message.replaceAll("{nickname}", nickname);
            }

            function getBotId(ext) {
                return seal.ext.getStringConfig(ext, "fish_bot_id") || "3889686462";
            }

            function getCHATGROUP(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "chat_groups") || [];
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }
            function getTHXWORDS(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "thx_words") || [];
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }
            function getFISHWORDS(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "fish_up") || [];
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }
            function loadAutoReplyRules(ext) {
                const rawList = seal.ext.getTemplateConfig(ext, "auto_reply_rules") || [];
                const rules = [];

                for (const raw of rawList) {
                    try {
                        const obj = JSON.parse(raw);
                        rules.push(obj);
                    } catch (e) {
                        seal.log(`自动回复规则解析失败：${raw}`);
                    }
                }

                return rules;
            }

            function getFISHGROUP(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "fish_group") || [];
                // TemplateConfig 是数组，每个元素就是一行
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }

            let CHATGROUPS = getCHATGROUP(ext);
            let MORNINGWORDS = getMORNINGWORDS(ext);
            let MorningStartTime = getMorningStartTime(ext);
            let MorningEndTime = getMorningEndTime(ext);
            let MorningSuccessWords = getMorningSuccessWords(ext);
            let MorningRepeatWords = getMorningRepeatWords(ext);
            let MorningFailWords = getMorningFailWords(ext);
            let BANGROUP = getBANGROUP(ext);
            let BOTQQID = getPigId(ext);
            let settleMentHour = getSettleMentHour(ext);
            let settleMentMinute = getSettleMentMinute(ext);
            let FishWords = getFISHWORDS(ext);
            let AutoReplyRules = loadAutoReplyRules(ext);


            let THXWORDS = getTHXWORDS(ext);

            ext.onNotCommandReceived = (ctx, msg) => {
                try {
                    console.log(JSON.stringify(ctx));
                    console.log(JSON.stringify(msg));
                    FISH_BOT_USERID = getBotId(ext);
                    FISHGROUP = getFISHGROUP(ext);
                    AutoReplyRules = loadAutoReplyRules(ext);
                    BANGROUP = getBANGROUP(ext);
                    CHATGROUPS = getCHATGROUP(ext);
                    MORNINGWORDS = getMORNINGWORDS(ext);
                    MorningStartTime = getMorningStartTime(ext);
                    MorningEndTime = getMorningEndTime(ext);
                    MorningSuccessWords = getMorningSuccessWords(ext);
                    MorningRepeatWords = getMorningRepeatWords(ext);
                    MorningFailWords = getMorningFailWords(ext);
                    FishWords = getFISHWORDS(ext);
                    
                    const text = msg.message || "";
                    const sender = msg.sender || {};
                    const fromUserIdRaw = sender.userId || "";
                    const fromUserId = normalizeUid(fromUserIdRaw);
                    const fromUserGroupID = normalizeUid(ctx.group.groupId);
                    const fromName = sender.nickname || "";
                    const senderUidNormalized = normalizeUid(msg.sender && msg.sender.userId);
                    const nickname = fromName;

                    if (text == "呼风唤雨" && CHATGROUPS.includes(fromUserGroupID)){
                        seal.replyToSender(ctx, msg, "呼风唤雨");
                    }

                    if (text == "查看报错" && fromUserId == "3425655273") {
                        let arrError = storageGet(ext, STORAGE_KEY_ERROR, []);
                        let output = `1`;
                        for (let i = 0; i < arrError.length; ++i) {
                            output += `${arrError[i]}\n`;
                        }
                        seal.replyToSender(ctx, msg, output);
                    }
                    if (text == "清除报错" && fromUserId == "3425655273") {
                        storageSet(ext, STORAGE_KEY_ERROR, []);
                        seal.replyToSender(ctx, msg, "雪掉了~");
                    }

                    if (fromUserGroupID == "1041391088" && inactive){
                        inactive = false;
                        setTimeoutFishing(ext,ctx,msg,0);
                        setTimeoutFishing(ext,ctx,msg,1000 * parseInt(seal.ext.getStringConfig(ext, "fish_cd_delay_2"), 10))
                    }

                    if (CHATGROUPS.includes(fromUserGroupID)) {
                        if (MORNINGWORDS.includes(text)) {
                            let now = new Date();
                            let dictMorning = storageGet(ext, STORAGE_KEY_Morning, {});
                            let dictTodayMorning = {};
                            if (isBetween(MorningStartTime, MorningEndTime, now.getHours())) {
                                if (now.toLocaleDateString() in dictMorning) {
                                    dictTodayMorning = dictMorning[now.toLocaleDateString()];
                                }
                                if (fromUserId in dictTodayMorning) {
                                    seal.replyToSender(ctx, msg, `${replaceNickname(pickMessage(MorningRepeatWords), nickname)}\n————————\n${printCheckDict(dictTodayMorning)}`);
                                } else {
                                    let card = {
                                        ts: now.getTime(),
                                        nickname: fromName,
                                        groupId: fromUserGroupID
                                    }
                                    dictTodayMorning[fromUserId] = card;
                                    seal.replyToSender(ctx, msg, `${replaceNickname(pickMessage(MorningSuccessWords), nickname)}\n————————\n你是今天第${Object.keys(dictTodayMorning).length}个说早安的宝宝\n————————\n${printCheckDict(dictTodayMorning)}`);
                                    dictMorning[now.toLocaleDateString()] = dictTodayMorning;
                                    storageSet(ext, STORAGE_KEY_Morning, dictMorning);
                                }
                            } else {
                                seal.replyToSender(ctx, msg, `${replaceNickname(pickMessage(MorningFailWords), nickname)}`);
                            }
                        }
                    }
                    // if (
                    //     text &&
                    //     textMentionsSbQQ(text, "1220450657") &&
                    //     FISHGROUP.includes(fromUserGroupID) &&
                    //     fromUserId == FISH_BOT_USERID
                    // ) {
                    //     if (FishWords.some(word => text.includes(word))){
                    //         seal.replyToSender(ctx,msg,`检测到雪雪的鱼上钩`)
                    //         const ep = seal.getEndPoints()[0];
                    //         const fakeMsg = seal.newMessage();
                    //         fakeMsg.messageType = "private";
                    //         fakeMsg.platform = "QQ";
                    //         fakeMsg.sender = {
                    //             nickname: "猪",
                    //             userId: "QQ:1220450657"
                    //         };
                    //         const fakeCtx = seal.createTempCtx(ep,fakeMsg);
                    //         seal.replyToSender(fakeCtx,fakeMsg,`小猪的鱼上钩了`);
                    //     }
                    // } 
                    if (
                        text &&
                        textMentionsSbQQ(text, BOTQQID)
                        &&
                        FISHGROUP.includes(fromUserGroupID)
                    ) {
                        // 匹配：【丰收】CD中（xxx秒）
                        let match = text.match(/【丰收】CD中\((\d+)秒\)/);
                        if (match) {
                            const cdSec = parseInt(match[1], 10);
                            if (!isNaN(cdSec)) {

                                // 读取配置
                                const delay1 = parseInt(seal.ext.getStringConfig(ext, "fish_cd_delay_1"), 10);
                                const delay2 = parseInt(seal.ext.getStringConfig(ext, "fish_cd_delay_2"), 10);
                                const windowSec = parseInt(seal.ext.getStringConfig(ext, "fish_cd_window"), 10);

                                const triggerTs = nowTs() + cdSec + delay1;

                                // 读取 & 清理存储
                                let timers = storageGet(ext, STORAGE_KEY_FISH_CD_TIMERS, []);
                                timers = cleanupOldTimers(timers);

                                // 查找是否已有接近的定时器
                                const exists = timers.some(e =>
                                    e.groupId === fromUserGroupID &&
                                    Math.abs(e.triggerTs - triggerTs) <= windowSec
                                );

                                if (!exists) {
                                    // 存储
                                    timers.push({
                                        groupId: fromUserGroupID,
                                        triggerTs
                                    });
                                    storageSet(ext, STORAGE_KEY_FISH_CD_TIMERS, timers);

                                    // 第一次延时
                                    setTimeoutFishing(ext,ctx,msg,(cdSec + delay1) * 1000);

                                    // 第二次延时
                                    setTimeoutFishing(ext,ctx,msg,(cdSec + delay2) * 1000);
                                }
                            }
                        }

                        match = text.match(/金币不足9999999喵\n当前金币：(\d+)/);
                        if (match && fromUserGroupID == "1041391088") {
                            let Money = {
                                ts: Date.now(),
                                value: match[1],
                                main: false
                            };
                            let arrMoney = storageGet(ext,STORAGE_KEY_MONEY,[]);
                            const target = new Date(Money.ts);
                            target.setHours(settleMentHour,settleMentMinute,0,0);
                            if (arrMoney.length == 0){
                                Money.main = true;
                            } else if (target.getTime() >= arrMoney[0].ts){
                                Money.main = true;
                            }
                            const curMoney = parseInt(match[1],10);
                            const prevMoney = parseInt((arrMoney.length > 0) ? arrMoney[0].value : '0',10);
                            if (curMoney - prevMoney > 0){
                                seal.replyToSender(ctx, msg, `刚才赚了${curMoney - prevMoney}`);
                            } else {
                                seal.replyToSender(ctx, msg, `刚才亏了${prevMoney - curMoney}，我的股票....好绿..`);
                            }
                            arrMoney.unshift(Money);
                            storageSet(ext,STORAGE_KEY_MONEY,arrMoney);
                        }
                    }
                    const atUid = extractFirstNumericId(text);
                    if (text && fromUserGroupID == "1041391088" && atUid && atUid != BOTQQID){
                        const match = text.match(/金币不足9999999喵\n当前金币：(\d+)/);
                        if (match){
                            let dict = storageGet(ext,STORAGE_KEY_OTHERS_MONEY,{})
                            let arrMoney;
                            if (atUid in dict){
                                arrMoney = dict[atUid];
                            } else {
                                arrMoney = [];
                            }
                            let Money = {
                                ts: Date.now(),
                                value: match[1],
                            };
                            const curMoney = parseInt(match[1],10);
                            const prevMoney = parseInt((arrMoney.length > 0) ? arrMoney[0].value : '0',10);
                            if (curMoney - prevMoney > 0){
                                seal.replyToSender(ctx, msg, `刚才赚了${curMoney - prevMoney}`);
                            } else {
                                seal.replyToSender(ctx, msg, `刚才亏了${prevMoney - curMoney}，你也学我买股票了吗?`);
                            }
                            arrMoney.unshift(Money);
                            dict[atUid] = arrMoney;
                            storageSet(ext,STORAGE_KEY_OTHERS_MONEY,dict);
                        }

                    }

                    if (!FISHGROUP.includes(fromUserGroupID) && !CHATGROUPS.includes(fromUserGroupID)) {
                        return;
                    }
                    if (BANGROUP.includes(fromUserGroupID)) {
                        return;
                    }
                    else {
                        // ====== 自动回复触发逻辑 ======
                        for (const rule of AutoReplyRules) {
                            if (!rule.enable) continue;

                            let ok = true;
                            for (const cond of rule.conditions) {
                                if (!matchRule(text, cond)) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (!ok) continue;

                            // 命中规则 → 执行结果
                            for (const res of rule.results) {
                                const msgToSend = pickMessageWithWeighting(res.message);

                                if (res.delay > 0) {
                                    setTimeout(() => seal.replyToSender(ctx, msg, msgToSend), res.delay * 1000);
                                } else {

                                    seal.replyToSender(ctx, msg, msgToSend)
                                }
                            }
                            break;
                        }
                    }
                } catch (e) {
                    let arrError = storageGet(ext, STORAGE_KEY_ERROR, []);
                    arrError.push(`${Date.now().toLocaleString()} - ${e}`);
                    storageSet(ext, STORAGE_KEY_ERROR, arrError);
                }
            }

        }
    }
    main();
})();