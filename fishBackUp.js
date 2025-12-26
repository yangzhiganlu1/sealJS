
// ==UserScript==
// @name         小咪啪辅助插件 (贡品)
// @author       雪王 & 蜜桃 & ChatGPT
// @version      1.0.28
// @description  1223,修改:新增了自启动的轮转
// @timestamp    1733625600
// @license      MIT 
// ==/UserScript==

(() => {
    // ===== 配置区 =====
    
    const STORAGE_KEY_PENDING = "fish_pending";
    const STORAGE_KEY_RECORDS = "fish_records"; // records 数组，按时间倒序（最新在前）
    const PENDING_WINDOW_SECONDS = 60 * 5; // 5 分钟
    const VERSION = "1.0.28";

    // ==========================================
    // 自动回复数据集（可随时维护）
    // ==========================================



    // ===== 工具函数 =====
    //从候选消息数组中选一条发送
    function pickMessage(msgList) {
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
    //关键字触发匹配机制
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

    //当前时间
    function nowTs() {
        return Math.floor(Date.now() / 1000);
    }
    //格式化日期
    function dateStrFromTs(ts) {
        const d = new Date(ts * 1000);
        const Y = d.getFullYear();
        const M = String(d.getMonth() + 1).padStart(2, "0");
        const D = String(d.getDate()).padStart(2, "0");
        return `${Y}-${M}-${D}`;
    }
    // 规范化 userId -> 纯数字字符串（若无法提取返回原字符串）
    function normalizeUid(raw) {
        if (!raw) return "";
        // 常见 raw: "QQ:3889686462" or "3889686462"
        const m = String(raw).match(/([1-9][0-9]{4,})/);
        return m ? m[1] : String(raw);
    }
    //取
    function storageGet(ext, key, defaultVal) {
        try {
            const raw = ext.storageGet(key);
            if (!raw) return defaultVal;
            return JSON.parse(raw);
        } catch (e) {
            return defaultVal;
        }
    }
    //存
    function storageSet(ext, key, obj) {
        try {
            ext.storageSet(key, JSON.stringify(obj));
        } catch (e) {
            // ignore
        }
    }
    //生成id
    function genId() {
        const ts = (nowTs() % 1000000).toString().padStart(6, "0"); // 取后 6 位时间戳
        const rnd = Math.floor(Math.random() * 1000)                 // 0–999 → 三位随机数
            .toString()
            .padStart(3, "0");
        return ts + rnd;  // 共 9 位
    }
    // 从文本里尝试提取第一个连续数字（可能为 QQ），兼容 "QQ:123" 以及裸数字
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
    // 检查文本内是否包含QQ
    function textMentionsSbQQ(text, qq) {
        if (!text) return false;
        const plain = String(text);
        if (plain.indexOf(qq) !== -1) return true;
        if (plain.indexOf("QQ:" + qq) !== -1) return true;
        return false;
    }
    // 去掉 @机器人（数字或 QQ:形式）或首个 @昵称 标记，返回剩余文本，trim 后
    function stripBotMentionFromText(text) {
        if (!text) return "";
        let t = String(text);
        // 1. 去掉所有 CQ 码 at，例如：
        // [CQ:at,qq=3889686462]
        // [CQ:at,qq=]
        t = t.replace(/\[CQ:at,qq=\d*\]/g, "");
        return t;
    }
    // 解析文本中的第一个 "恢复了N体力"（返回数字或 null）
    function parseFirstRecovery(text) {
        if (!text) return null;

        // 尝试匹配各种格式
        const patterns = [
            // 格式1: 恢复了10体力 / 降低了10体力
            /(恢复|降低)了?\s*([+-]?\s*\d+)(?:\s*点)?\s*体力/,
        ];

        for (const pattern of patterns) {
            const m = text.match(pattern);
            if (m) {


                // 处理其他格式
                const action = m[1]; // "恢复" 或 "降低"
                const numStr = (m[2] || m[m.length - 1]).replace(/\s+/g, '');
                const num = Number(numStr);

                // 如果是"降低"，直接返回数字（可能是负数，如"降低了-10"）
                // 不需要额外处理，因为numStr中已经包含了符号
                if (action === '降低') {
                    return num; // "降低了-10" => -10, "降低了10" => 10
                }

                return num;
            }
        }

        return null;
    }
    // ====== 去重函数：依据 日期 + 恢复体力 + 献上内容 ======
    function dedup(list) {
        const map = {};
        const out = [];
        for (const r of list) {
            const key = `${r.date}_${r.healed}_${r.tribute}`;
            if (!map[key]) {
                map[key] = true;
                out.push(r);
            }
        }
        return out;
    }
    // 清理过期 pending（超过 PENDING_WINDOW_SECONDS 的条目）
    function cleanupExpiredPending(pendingMap) {
        const now = nowTs();
        const keys = Object.keys(pendingMap);
        let tag = false;
        for (let k of keys) {
            const entry = pendingMap[k];
            if (!entry || !entry.ts) {
                delete pendingMap[k];
                tag = true;
                continue;
            }
            if (now - entry.ts > PENDING_WINDOW_SECONDS) {
                delete pendingMap[k];
                tag = true;
            }
        }
        return tag;
    }

    //清理旧定时器
    function cleanupOldTimers(list, expireSec = 3600) {
        const now = nowTs();
        return list.filter(e => now - e.triggerTs <= expireSec);
    }





    // ========== 主流程：注册扩展 ===============
    function main() {
        let inactive = true;
        let ext = seal.ext.find("f");
        if (!ext) {
            ext = seal.ext.new("f", "XW", VERSION);

            // ====================================== 命令：贡品 ====================================
            const cmd = seal.ext.newCmdItemInfo();
            cmd.name = "贡品";
            cmd.help = `.贡品 help，以下是指令格式：
.贡品            【今日恢复体力最高的一条记录】
.贡品 list today/all                      【今日/所有列表（已去重）】
.贡品 add 你的qq号（纯数字） 你的昵称 恢复体力值（纯数字） 献上的内容（艾特小咪啪后面的内容）      【添加一条记录】
.贡品 del 记录id                             【删除一条记录】
.贡品 edit 记录id 列名 该列的值           【编辑记录（列名: healed/tribute）（即恢复体力值/献上的内容）】
.贡品 get 记录id                              【查看单条记录】
.贡品 clear      【！！！清空！！！所有！！！记录！！！】
`;

            //".贡品" 相关指令
            cmd.solve = (ctx, msg, cmdArgs) => {
                try {
                    
                    FISH_BOT_USERID = getBotId(ext);
                    FISHGROUP = getFISHGROUP(ext);
                    CHATGROUPS = getCHATGROUP(ext);

                    const arg1 = cmdArgs.getArgN(1) || "";
                    const sub = ("" + arg1).trim().toLowerCase();
                    const records = storageGet(ext, STORAGE_KEY_RECORDS, []);
                    const fromUserGroupID = normalizeUid(ctx.group.groupId);

                    if (!FISHGROUP.includes(fromUserGroupID)) {
                        return;
                    }
                    // ====== help ======
                    if (sub === "help" || sub === "h") {
                        const ret = seal.ext.newCmdExecuteResult(true);
                        ret.showHelp = true;
                        return ret;
                    }
                    // ====== clear ======
                    if (sub === "clear") {
                        if (ctx.privilegeLevel < 50) {
                            seal.replyToSender(ctx, msg, "清空记录需要群主或管理员权限");
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        storageSet(ext, STORAGE_KEY_RECORDS, []);
                        storageSet(ext, STORAGE_KEY_PENDING, {});
                        seal.replyToSender(ctx, msg, "所有记录与待处理项已清空。");
                        return seal.ext.newCmdExecuteResult(true);
                    }
                    // ====== add ======
                    if (sub === "add") {
                        const uidRaw = cmdArgs.getArgN(2) || "";
                        const nicknameRaw = cmdArgs.getArgN(3) || "";
                        const healedRaw = cmdArgs.getArgN(4) || "";
                        const tributeRaw = cmdArgs.getArgN(5) || "";
                        const uid = normalizeUid(uidRaw);
                        const healed = Number(healedRaw) || 0;
                        const rec = {
                            id: genId(),
                            ts: nowTs(),
                            date: dateStrFromTs(nowTs()),
                            userId: uid,
                            nickname: nicknameRaw,
                            tribute: tributeRaw || "",
                            healed: healed
                        };
                        const arr = storageGet(ext, STORAGE_KEY_RECORDS, []);
                        arr.unshift(rec);
                        storageSet(ext, STORAGE_KEY_RECORDS, arr);
                        seal.replyToSender(ctx, msg, `已添加记录：id=${rec.id} user=${rec.userId} nickname=${rec.nickname} healed=${rec.healed} tribute=${rec.tribute}`);
                        return seal.ext.newCmdExecuteResult(true);
                    }
                    //====== del ======
                    if (sub === "del") {
                        if (ctx.privilegeLevel < 50) {
                            seal.replyToSender(ctx, msg, "删除记录需要管理员权限。");
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        const id = cmdArgs.getArgN(2) || "";
                        if (!id) {
                            seal.replyToSender(ctx, msg, "用法：.贡品 del 记录id");
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        let arr = storageGet(ext, STORAGE_KEY_RECORDS, []);
                        const idx = arr.findIndex(r => r.id === id);
                        if (idx === -1) {
                            seal.replyToSender(ctx, msg, `未找到 id=${id} 的记录。`);
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        const removed = arr.splice(idx, 1)[0];
                        storageSet(ext, STORAGE_KEY_RECORDS, arr);
                        seal.replyToSender(ctx, msg, `已删除记录：id=${removed.id} 用户=${removed.userId} 恢复=${removed.healed} 献上内容=${removed.tribute}`);
                        return seal.ext.newCmdExecuteResult(true);
                    }
                    // ====== edit ======
                    if (sub === "edit") {
                        if (ctx.privilegeLevel < 50) {
                            seal.replyToSender(ctx, msg, "编辑记录需要管理员权限。");
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        const id = cmdArgs.getArgN(2) || "";
                        const field = (cmdArgs.getArgN(3) || "").toLowerCase();
                        const val = cmdArgs.getArgN(4) || "";
                        if (!id || !field) {
                            seal.replyToSender(ctx, msg, "用法：.贡品 edit 记录id 列名 该列的值           【编辑记录（列名: healed/tribute/nickname）（即恢复体力值/献上的内容/群昵称）】");
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        const arr = storageGet(ext, STORAGE_KEY_RECORDS, []);
                        const r = arr.find(rr => rr.id === id);
                        if (!r) {
                            seal.replyToSender(ctx, msg, `未找到 id=${id} 的记录。`);
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        if (field === "healed") r.healed = Number(val) || 0;
                        else if (field === "tribute") r.tribute = val;
                        else if (field === "nickname") r.nickname = val;
                        else if (field === "date") r.date = val;
                        else {
                            seal.replyToSender(ctx, msg, "不支持的列。可用列：healed|tribute|nickname");
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        storageSet(ext, STORAGE_KEY_RECORDS, arr);
                        seal.replyToSender(ctx, msg, `已更新记录 id=${r.id}`);
                        return seal.ext.newCmdExecuteResult(true);
                    }
                    //  ====== get ======
                    if (sub === "get") {
                        const id = cmdArgs.getArgN(2) || "";
                        if (!id) {
                            seal.replyToSender(ctx, msg, "用法：.贡品 get 记录id");
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        const arr = storageGet(ext, STORAGE_KEY_RECORDS, []);
                        const r = arr.find(rr => rr.id === id);
                        if (!r) {
                            seal.replyToSender(ctx, msg, `未找到 id=${id} 的记录。`);
                            return seal.ext.newCmdExecuteResult(true);
                        }
                        const out = `记录 ${r.id}：
日期：${r.date}
时间：${new Date(r.ts * 1000).toLocaleString()}
用户：${r.nickname || r.userId}
恢复：${r.healed}
献上：${r.tribute || "(空)"}`;
                        seal.replyToSender(ctx, msg, out);
                        return seal.ext.newCmdExecuteResult(true);
                    }
                    //====== list ======
                    if (sub === "list") {
                        const arg2 = (cmdArgs.getArgN(2) || "").toLowerCase();
                        if (arg2 === "today") {
                            const today = dateStrFromTs(nowTs());
                            let todays = storageGet(ext, STORAGE_KEY_RECORDS, []).filter(r => r.date === today);
                            todays = dedup(todays);
                            if (todays.length === 0) {
                                seal.replyToSender(ctx, msg, `今日（${today}）暂无记录。`);
                                return seal.ext.newCmdExecuteResult(true);
                            }
                            let out = `今日记录（${today}）共 ${todays.length} 条（已去重）：\n`;
                            for (let i = 0; i < todays.length; ++i) {
                                const r = todays[i];
                                out += `${i + 1}. id=${r.id} ${new Date(r.ts * 1000).toLocaleTimeString()} 恢复：${r.healed} - 献上：${r.tribute || "(空)"} (用户 ${r.nickname || r.userId})\n`;
                            }
                            seal.replyToSender(ctx, msg, out);
                            return seal.ext.newCmdExecuteResult(true);
                        } else if (arg2 === "all") {
                            const list = dedup(storageGet(ext, STORAGE_KEY_RECORDS, []));
                            if (list.length === 0) {
                                seal.replyToSender(ctx, msg, "暂无记录。");
                                return seal.ext.newCmdExecuteResult(true);
                            }
                            let out = `全部记录（去重后共 ${list.length} 条）：\n`;
                            for (let i = 0; i < list.length; ++i) {
                                const r = list[i];
                                out += `${i + 1}. id=${r.id} ${r.date} ${new Date(r.ts * 1000).toLocaleTimeString()} 恢复：${r.healed} - ${r.tribute || "(空)"} (用户 ${r.nickname || r.userId})\n`;
                            }
                            seal.replyToSender(ctx, msg, out);
                            return seal.ext.newCmdExecuteResult(true);
                        } else {
                            seal.replyToSender(ctx, msg, "用法：.贡品 list [today|all]");
                            return seal.ext.newCmdExecuteResult(true);
                        }
                    }
                    // ====== 默认：今日最高记录 ======
                    if (sub === "" || sub === "top") {
                        const today = dateStrFromTs(nowTs());
                        let todays = records.filter((r) => r.date === today);
                        if (todays.length === 0) {
                            seal.replyToSender(ctx, msg, `今日（${today}）暂无记录。`);
                            return seal.ext.newCmdExecuteResult(true);
                        }

                        todays.sort((a, b) => b.healed - a.healed);
                        const top = todays[0];

                        const out = `今日最高恢复记录：
id：${top.id}
恢复体力：${top.healed}
时间：${new Date(top.ts * 1000).toLocaleString()}
用户：${top.nickname || top.userId}
献上：${top.tribute || "(空)"}`;

                        seal.replyToSender(ctx, msg, out);
                        return seal.ext.newCmdExecuteResult(true);
                    }
                    // 未知参数
                    seal.replyToSender(ctx, msg, "未知子命令，输入 `.贡品 help` 查看用法。");
                    return seal.ext.newCmdExecuteResult(true);
                } catch (err) {
                    return seal.ext.newCmdExecuteResult(true);
                }
            };



            // 注册别名 
            ext.cmdMap["贡"] = cmd;
            ext.cmdMap["贡品"] = cmd;
            ext.cmdMap["贡品记录"] = cmd;
            ext.cmdMap["贡品今日"] = cmd;
            ext.cmdMap["fishlog"] = cmd;
            ext.cmdMap["献祭"] = cmd;

            //注册扩展
            seal.ext.register(ext);

            

            // ====== 注册配置项 ======
            seal.ext.registerStringConfig(
                ext,
                "fish_bot_id",
                "3889686462"
            );

            seal.ext.registerTemplateConfig(
                ext,
                "fish_group",
                ["1041391088"]
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
                "chat_groups",
                [
                    "732523535",//跑团大群
                    "623619309",//石群
                    "621591811",//跑团小群 
                ]
            );

            seal.ext.registerStringConfig(ext, "fish_cd_delay_1", "20", "丰收CD 第一次延迟（秒）");
            seal.ext.registerStringConfig(ext, "fish_cd_delay_2", "40", "丰收CD 第二次延迟（秒）");
            seal.ext.registerStringConfig(ext, "fish_cd_window", "40", "重复触发判定窗口（±秒）");
            seal.ext.registerStringConfig(ext, "botqqid", "2322534068", "小猪的qq号");
            seal.ext.registerIntConfig(ext, "settleMentHour", 9, "结算时间(小时)");
            seal.ext.registerIntConfig(ext, "settleMentMinute", 0, "结算时间(分钟)");



            // ======配置项读取======
            function getBotId(ext) {
                return seal.ext.getStringConfig(ext, "fish_bot_id") || "3889686462";
            }

            function getPigId(ext) {
                return seal.ext.getStringConfig(ext, "botqqid") || "2322534068";
            }

            function getFISHGROUP(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "fish_group") || [];
                // TemplateConfig 是数组，每个元素就是一行
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }
            function getCHATGROUP(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "chat_groups") || [];
                // TemplateConfig 是数组，每个元素就是一行
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }
            function getBANGROUP(ext) {
                const arr = seal.ext.getTemplateConfig(ext, "ban_group") || [];
                // TemplateConfig 是数组，每个元素就是一行
                return arr.map(s => String(s).trim()).filter(s => s.length > 0);
            }
            

            //配置项获取
            let FISH_BOT_USERID = getBotId(ext);
            let FISHGROUP = getFISHGROUP(ext);
            let CHATGROUPS = getCHATGROUP(ext);
            let BANGROUP = getBANGROUP(ext);
            let BOTQQID = getPigId(ext);

            //======关键词触发======
            ext.onNotCommandReceived = (ctx, msg) => {
                try {
                    FISH_BOT_USERID = getBotId(ext);
                    FISHGROUP = getFISHGROUP(ext);
                    CHATGROUPS = getCHATGROUP(ext);
                    BANGROUP = getBANGROUP(ext);
                    
                    const text = msg.message || "";
                    const sender = msg.sender || {};
                    const fromUserIdRaw = sender.userId || "";
                    const fromUserId = normalizeUid(fromUserIdRaw);
                    const fromUserGroupID = normalizeUid(ctx.group.groupId);
                    const fromName = sender.nickname || "";
                    const senderUidNormalized = normalizeUid(msg.sender && msg.sender.userId);

                    // 读取 pendingMap
                    const pendingMap = storageGet(ext, STORAGE_KEY_PENDING, {});
                
                    //=====监测小咪啪发言=====
                    if (String(senderUidNormalized) === String(FISH_BOT_USERID) && !text.includes('称呼主人')) {
                        //考虑bot自己被艾特的情况
                        const recovered = parseFirstRecovery(text);
                        const atUidInReply = extractFirstNumericId(text);
                        if (extractFirstNumericId(text) == BOTQQID && (text.indexOf("献上贡品") != -1 || text.indexOf("献上你的贡品，或者…成为贡品。") != -1)) {
                            const records = storageGet(ext, STORAGE_KEY_RECORDS, []);
                            const today = dateStrFromTs(nowTs());
                            const todays = records.filter(r => r.date === today);
                            //按恢复值降序排列
                            todays.sort((a, b) => b.healed - a.healed);
                            const delay = parseInt(seal.ext.getStringConfig(ext, "fish_cd_delay_2"), 10);
                            setTimeout(() => {
                                seal.replyToSender(ctx, msg, `[CQ:at,qq=${FISH_BOT_USERID}]${todays[0].tribute || ""}`);
                            }, 1000);
                            setTimeout(() => {
                                seal.replyToSender(ctx, msg, `[CQ:at,qq=${FISH_BOT_USERID}] /抛竿丰收`);
                            }, 1000 * delay);
                            setTimeout(() => {
                                seal.replyToSender(ctx, msg, `[CQ:at,qq=${FISH_BOT_USERID}] /抛竿丰收`);
                            }, 3000 * delay);
                        }
                        //========================【记录贡品逻辑三步骤START】========================                       
                        // --- Step 1: 小咪啪发起（包含“献上贡品”并 @ 用户的数字 QQ） ---
                        if (text && text.indexOf("献上贡品") != -1 ) {
                            // 清理过期 pending
                            let tag = cleanupExpiredPending(pendingMap);
                            if (tag && FISHGROUP.includes(fromUserGroupID)) {
                                seal.replyToSender(ctx, msg, `【已清理未响应献上贡品事件...】 `);
                            }
                            // 提取被 @ 的数字 userId（优先）
                            const atUid = extractFirstNumericId(text);
                            // 如果有被艾特的用户
                            if (atUid) {
                                const key = normalizeUid(atUid);
                                pendingMap[key] = {
                                    step: 1,
                                    botText1: text,
                                    tribute: "",
                                    ts: nowTs(),
                                    nickname: ""
                                };
                                storageSet(ext, STORAGE_KEY_PENDING, pendingMap);
                                //咪啪窝只需存不要发消息
                                if (!FISHGROUP.includes(fromUserGroupID)) {
                                    return;
                                }

                                // 附加消息：展示今日已知最高记录（如果有）
                                const records = storageGet(ext, STORAGE_KEY_RECORDS, []);
                                const today = dateStrFromTs(nowTs());
                                const todays = records.filter(r => r.date === today);
                                //按恢复值降序排列
                                todays.sort((a, b) => b.healed - a.healed);
                                let top = todays[0];
                                let topMsg = "（今日尚无记录）";
                                if (todays.length > 0) {
                                    topMsg = `已知今日献上贡品最高记录为：${top.healed}（用户：${top.nickname || top.userId}，献上：${top.tribute || "(空)"}）`;
                                }

                                seal.replyToSender(ctx, msg, `【已记录待用户献上贡品事件，等待用户献上贡品中... 】
                                ${topMsg}`);

                            }
                        }
                        // --- Step 3: 小咪啪回复恢复体力（必须 @ 用户 并包含恢复了N体力） ---
                        else if (recovered !== null && atUidInReply) {
                            const key = normalizeUid(atUidInReply);
                            const pendingEntry = pendingMap[key];
                            // seal.replyToSender(ctx, msg, ` pendingEntry：${JSON.stringify(pendingEntry)}`);
                            const today = dateStrFromTs(nowTs());
                            const records = storageGet(ext, STORAGE_KEY_RECORDS, []);
                            const todays = records.filter(r => r.date === today);
                            todays.sort((a, b) => b.healed - a.healed);
                            if ((key == BOTQQID) && (recovered != todays[0].healed)){
                                pendingEntry.step = 2;
                                pendingEntry.tribute = todays?todays[0].tribute:'';
                            }
                            if (pendingEntry && pendingEntry.step == 2) {
                                const rec = {
                                    id: genId(),
                                    ts: nowTs(),
                                    date: dateStrFromTs(nowTs()),
                                    userId: key,
                                    nickname: pendingEntry.nickname || "",
                                    tribute: pendingEntry.tribute || "",
                                    healed: recovered
                                };
                                
                                records.unshift(rec);
                                storageSet(ext, STORAGE_KEY_RECORDS, records);
                                delete pendingMap[key];
                                storageSet(ext, STORAGE_KEY_PENDING, pendingMap);

                                // 回复确认（包含昵称）
                                const namePart = rec.nickname ? `${rec.nickname}（${rec.userId}）` : rec.userId;
                                if (FISHGROUP.includes(fromUserGroupID)) {
                                    seal.replyToSender(ctx, msg, `【已记录献上事件：
  用户 ${namePart}
  献上：${rec.tribute || "(空)"}
  恢复体力：${rec.healed}
  日期：${rec.date}】`);
                                }
                                return;
                            } else {
                                // 未找到 step==2 的 pending -> 忽略
                                return;
                            }
                        }
                        //========================【记录贡品逻辑三步骤END】========================
                    }
                    //=====监测用户艾特小咪啪发言=====
                    else if (text && textMentionsSbQQ(text, FISH_BOT_USERID)) {
                        // --- Step 2: 用户回应（用户 @ 小咪啪，整条消息（去除 @机器人）作为 tribute） ---
                        const key = fromUserId;
                        const pend = pendingMap[key];
                        //查找是否处在步骤流程里
                        if (pend && Number(pend.step) == 1) {
                            const tributeText = stripBotMentionFromText(text);
                            // seal.replyToSender(ctx, msg, `tributeText：${tributeText}`);
                            pendingMap[key] = {
                                step: 2,
                                botText1: pend.botText1 || "",
                                tribute: tributeText,
                                ts: pend.ts || nowTs(),
                                nickname: fromName || ""
                            };
                            storageSet(ext, STORAGE_KEY_PENDING, pendingMap);
                            if (FISHGROUP.includes(fromUserGroupID)) {
                                seal.replyToSender(ctx, msg, `【已记录你的献上内容：${tributeText || "(空)"}，等待小咪啪回复结果。】`);
                            }
                            return;
                        }
                    }


                    //=====监测用户普通发言=====
                    return;
                } catch (err) {
                    // seal.replyToSender(ctx, msg, err)
                    console.log('雪机报错',err)
                }
            };
        }
    }
    main();
})();
