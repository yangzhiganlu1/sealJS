// ==UserScript==
// @name         综合计时与发送插件
// @author       YogSothoth
// @version      7.0.0
// @description  全自定义配置：定时表、关键词、开关指令、倒计时、多账号间隔发送（支持重启自动恢复）。
// @timestamp    1700000007
// @license      MIT
// ==/UserScript==

if (!seal.ext.find('custom-timer-sender')) {
    const ext = seal.ext.new('custom-timer-sender', 'YogSothoth', '7.0.0');
    seal.ext.register(ext);

    seal.ext.registerStringConfig(ext, "CmdManual", "manual", "查看手册指令（修改后需重载插件）");

    seal.ext.registerBoolConfig(ext, "CdEnabled", true, "是否允许使用倒计时功能 (.cd)。Admin/Owner可开关");
    seal.ext.registerStringConfig(ext, "CdReplyText", "倒计时结束！[CQ:at,qq={$tRequesterID}]，你设置的倒计时 ({$tDuration}) 已经完成。", "倒计时结束时的回复文案。");

    seal.ext.registerStringConfig(ext, "CmdStartA", "开始报时", "任务A：启动指令（修改后需重载插件）");
    seal.ext.registerStringConfig(ext, "CmdStopA", "停止报时", "任务A：停止指令（修改后需重载插件）");
    seal.ext.registerStringConfig(ext, "TextA", "60秒报时：现在是 {$tTime}，我是 {$t骰子昵称}", "任务A：发送内容");
    seal.ext.registerIntConfig(ext, "IntervalA", 60, "任务A：间隔时间(秒)，大于5秒防止刷屏");

    seal.ext.registerStringConfig(ext, "CmdStartB", "开始提醒", "任务B：启动指令（修改后需重载插件）");
    seal.ext.registerStringConfig(ext, "CmdStopB", "停止提醒", "任务B：停止指令（修改后需重载插件）");
    seal.ext.registerStringConfig(ext, "TextB", "每日提醒：今天是 {$tDate}，来自 {$t骰子昵称} 的问候", "任务B：发送内容");
    seal.ext.registerIntConfig(ext, "IntervalB", 180, "任务B：间隔时间(秒)，大于5秒防止刷屏");

    const defaultTextMap = `
morning: 早上好，现在是{$tTime}！ | 太阳晒屁股啦，现在时间 {$tTime}
noon: 该吃午饭了 | 干饭人干饭魂，现在是 {$tTime}
hourly: 铛铛铛！整点报时！当前时间 {$tTime}
5min_tick: 滴答滴答，已经过去了5分钟。

timer_on_reply: 明白！已开启本群的定时报时功能。当前时间: {$tTime}
timer_off_reply: 好的，已关闭本群的定时报时。
timer_perm_err: 你没有权限操作定时器哦。

gacha: 命运的齿轮开始转动... [[1d100]] | 你抽出了一张 R 卡
    `.trim();
    seal.ext.registerStringConfig(ext, "1. 文案库内容 (格式: Key: 文案 | 文案2)", defaultTextMap, "所有回复内容的字典。");

    const defaultSchedule = `{08:00, morning}; {12:00, noon}; {hour, hourly}; {countdown:5m, 5min_tick}`;
    seal.ext.registerStringConfig(ext, "2. 时间表设置 (格式: {规则, Key}; ...)", defaultSchedule, "规则支持：hour, half, quarter, HH:mm 或 countdown:Xm。");

    const defaultSwitchOn = `开启报时: timer_on_reply\n开始报时: timer_on_reply`;
    seal.ext.registerStringConfig(ext, "3. 开启指令设置 (格式: 文本: 反馈Key)", defaultSwitchOn, "群内发送此文本将开启报时。");

    const defaultSwitchOff = `关闭报时: timer_off_reply\n停止报时: timer_off_reply`;
    seal.ext.registerStringConfig(ext, "4. 关闭指令设置 (格式: 文本: 反馈Key)", defaultSwitchOff, "群内发送此文本将关闭报时。");

    const defaultTriggers = `早安: morning\n抽卡: gacha`;
    seal.ext.registerStringConfig(ext, "5. 普通关键词触发 (格式: 文本: Key)", defaultTriggers, "检测到文本完全匹配时，回复对应Key的文案。");

    let senderTimers = {};
    let countdownTimers = {};
    const STORAGE_KEY_SENDER = "AutoSender_State_V7";

    function checkPerm(ctx) {
        return ctx.privilegeLevel >= 50;
    }

    function parseConfigMap(str) {
        const map = {};
        const lines = str.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            const idx = line.indexOf(':');
            if (idx > -1) {
                const key = line.substring(0, idx).trim();
                const contentStr = line.substring(idx + 1).trim();
                if (contentStr.includes('|')) {
                      map[key] = contentStr.split('|').map(s => s.trim()).filter(s => s);
                } else {
                      map[key] = [contentStr];
                }
            }
        }
        return map;
    }

    function getReply(ctx, key) {
        const textMapStr = seal.ext.getStringConfig(ext, "1. 文案库内容 (格式: Key: 文案 | 文案2)");
        const textMap = parseConfigMap(textMapStr);
        const options = textMap[key];

        if (!options || options.length === 0) return null;
        const rawText = options[Math.floor(Math.random() * options.length)];
        return seal.format(ctx, rawText);
    }

    function setGroupEnabled(groupId, enable) {
        let data = ext.storageGet("enabled_groups");
        let groups = data ? JSON.parse(data) : [];
        if (enable) {
            if (!groups.includes(groupId)) groups.push(groupId);
        } else {
            groups = groups.filter(id => id !== groupId);
        }
        ext.storageSet("enabled_groups", JSON.stringify(groups));
    }

    ext.onNotCommandReceived = (ctx, msg) => {
        if (msg.messageType !== 'group' && msg.messageType !== 'private') return;
        const text = msg.message.trim();

        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        seal.format(ctx, `{$tTime = '${currentTime}'}`);

        const onConfigStr = seal.ext.getStringConfig(ext, "3. 开启指令设置 (格式: 文本: 反馈Key)");
        const onMap = parseConfigMap(onConfigStr);

        if (onMap[text]) {
            if (!checkPerm(ctx)) {
                const errReply = getReply(ctx, 'timer_perm_err') || "权限不足";
                seal.replyToSender(ctx, msg, errReply);
                return;
            }
            setGroupEnabled(ctx.group.groupId, true);
            const replyKey = onMap[text][0];
            const reply = getReply(ctx, replyKey);
            if (reply) seal.replyToSender(ctx, msg, reply);
            return;
        }

        const offConfigStr = seal.ext.getStringConfig(ext, "4. 关闭指令设置 (格式: 文本: 反馈Key)");
        const offMap = parseConfigMap(offConfigStr);

        if (offMap[text]) {
             if (!checkPerm(ctx)) {
                const errReply = getReply(ctx, 'timer_perm_err') || "权限不足";
                seal.replyToSender(ctx, msg, errReply);
                return;
            }
            setGroupEnabled(ctx.group.groupId, false);
            const replyKey = offMap[text][0];
            const reply = getReply(ctx, replyKey);
            if (reply) seal.replyToSender(ctx, msg, reply);
            return;
        }

        const triggerConfigStr = seal.ext.getStringConfig(ext, "5. 普通关键词触发 (格式: 文本: Key)");
        const triggerMap = parseConfigMap(triggerConfigStr);

        if (triggerMap[text]) {
            const targetKey = triggerMap[text][0];
            const reply = getReply(ctx, targetKey);
            if (reply) seal.replyToSender(ctx, msg, reply);
        }
    };

    function parseSchedule(str) {
        const list = [];
        str = str.replace(/\n/g, '');
        const items = str.split(';');
        for (let item of items) {
            item = item.trim();
            const match = item.match(/\{(.*?),(.*?)\}/);
            if (match) {
                list.push({ rule: match[1].trim(), key: match[2].trim() });
            }
        }
        return list;
    }

    seal.ext.registerTask(ext, "cron", "* * * * *", (taskCtx) => {
        const now = new Date();
        const min = now.getMinutes();
        const hour = now.getHours();
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        const scheduleStr = seal.ext.getStringConfig(ext, "2. 时间表设置 (格式: {规则, Key}; ...)");
        const schedules = parseSchedule(scheduleStr);

        let keysToTrigger = [];
        for (let item of schedules) {
            let isMatch = false;
            const r = item.rule.toLowerCase();

            if (r === 'hour' && min === 0) isMatch = true;
            else if (r === 'half' && (min === 0 || min === 30)) isMatch = true;
            else if (r === 'quarter' && min % 15 === 0) isMatch = true;
            else if (r === timeStr) isMatch = true;

            else if (r.startsWith('countdown:')) {
                const minuteStr = r.substring(10);
                const matchM = minuteStr.match(/(\d+)m/);
                if (matchM) {
                    const interval = parseInt(matchM[1]);
                    if (interval > 0 && min % interval === 0) {
                        isMatch = true;
                    }
                }
            }

            if (isMatch) keysToTrigger.push(item.key);
        }

        if (keysToTrigger.length === 0) return;

        const eps = seal.getEndPoints();
        if (!eps || eps.length === 0) return;
        const ep = eps[0];

        const data = ext.storageGet("enabled_groups");
        const groups = data ? JSON.parse(data) : [];

        const nowObj = new Date();
        const currentT = `${nowObj.getHours().toString().padStart(2, '0')}:${nowObj.getMinutes().toString().padStart(2, '0')}`;

        for (let gid of groups) {
            const mockMsg = seal.newMessage();
            mockMsg.groupId = gid;
            mockMsg.messageType = "group";
            mockMsg.sender.userId = "SYSTEM";
            const tmpCtx = seal.createTempCtx(ep, mockMsg);

            seal.format(tmpCtx, `{$tTime = '${currentT}'}`);

            for (let key of keysToTrigger) {
                const reply = getReply(tmpCtx, key);
                if (reply) seal.replyGroup(tmpCtx, mockMsg, reply);
            }
        }
    });

    const parseTimeInput = (input) => {
        let totalSeconds = 0;
        const parts = input.match(/(\d+h)?(\d+m)?(\d+s)?/i);
        if (!parts) return 0;

        if (parts[1]) totalSeconds += parseInt(parts[1]) * 3600;
        if (parts[2]) totalSeconds += parseInt(parts[2]) * 60;
        if (parts[3]) totalSeconds += parseInt(parts[3]);

        if (totalSeconds < 5) return 0;
        return totalSeconds * 1000;
    };

    const cmdCountdown = seal.ext.newCmdItemInfo();
    cmdCountdown.name = 'cd';
    cmdCountdown.help = '倒计时功能：.cd <时间> [原因]。时间格式：1h30m5s。最小5秒。';

    cmdCountdown.solve = (ctx, msg, cmdArgs) => {
        const isEnabled = seal.ext.getBoolConfig(ext, "CdEnabled");
        if (!isEnabled) {
            seal.replyToSender(ctx, msg, "倒计时功能已被管理员禁用。");
            return seal.ext.newCmdExecuteResult(true);
        }

        const timeStr = cmdArgs.getArgN(1);
        if (!timeStr || timeStr === 'help') {
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret;
        }

        const ms = parseTimeInput(timeStr);
        if (ms === 0) {
            seal.replyToSender(ctx, msg, "时间格式错误或少于5秒。请使用 XhYmZs 格式。");
            return seal.ext.newCmdExecuteResult(true);
        }

        const reason = cmdArgs.getArgN(2);
        const targetId = ctx.isPrivate ? ctx.player.userId : ctx.group.groupId;
        const countdownKey = `${targetId}_${msg.sender.userId}_${Date.now()}`;

        countdownTimers[countdownKey] = {
            requesterId: msg.sender.userId,
            targetId: targetId,
            durationStr: timeStr,
            reason: reason,
            ctx: ctx
        };

        seal.replyToSender(ctx, msg, `⏲️ 倒计时开始：${timeStr}。原因: ${reason || '无'}`);

        setTimeout(() => {
            const info = countdownTimers[countdownKey];
            if (!info) return;

            const replyTextTemplate = seal.ext.getStringConfig(ext, "CdReplyText");

            const at = `[CQ:at,qq=${info.requesterId}]`;

            let replyContent = replyTextTemplate.replace(/\{\$tRequesterID\}/g, info.requesterId);
            replyContent = replyContent.replace(/\{\$tDuration\}/g, info.durationStr);
            replyContent = replyContent.replace(/\[CQ:at,qq=\$tRequesterID\]/g, at);

            if (!ctx.isPrivate) {
                let finalReply = `${at} ${replyContent}`;
                if (info.reason) finalReply += ` (事项: ${info.reason})`;

                seal.replyGroup(info.ctx, msg, finalReply);
            } else {
                let finalReply = `${replyContent}`;
                if (info.reason) finalReply += ` (事项: ${info.reason})`;
                seal.replyPerson(info.ctx, msg, finalReply);
            }

            delete countdownTimers[countdownKey];
        }, ms);

        return seal.ext.newCmdExecuteResult(true);
    };
    ext.cmdMap['cd'] = cmdCountdown;

    function saveSenderState(uniqueKey, taskType, isActive, msgType) {
        const data = ext.storageGet(STORAGE_KEY_SENDER);
        const states = data ? JSON.parse(data) : {};

        if (!states[uniqueKey]) states[uniqueKey] = {};

        states[uniqueKey][taskType] = isActive;
        states[uniqueKey]["type"] = msgType;

        ext.storageSet(STORAGE_KEY_SENDER, JSON.stringify(states));
    }

    function runSenderTask(ep, targetId, msgType, taskType) {
        let uniqueKey = `${targetId}_${ep.userId}`;
        if (!senderTimers[uniqueKey]) senderTimers[uniqueKey] = {};

        if (senderTimers[uniqueKey][`timer${taskType}`]) {
            clearInterval(senderTimers[uniqueKey][`timer${taskType}`]);
        }

        let textConfigKey = `Text${taskType}`;
        let intervalConfigKey = `Interval${taskType}`;
        let text = seal.ext.getStringConfig(ext, textConfigKey);
        let interval = seal.ext.getIntConfig(ext, intervalConfigKey);
        if (interval < 5) interval = 60;

        senderTimers[uniqueKey][`timer${taskType}`] = setInterval(() => {
            const mockMsg = seal.newMessage();
            if (msgType === "group") {
                mockMsg.groupId = targetId;
                mockMsg.messageType = "group";
            } else {
                mockMsg.sender.userId = targetId;
                mockMsg.messageType = "private";
            }

            const tmpCtx = seal.createTempCtx(ep, mockMsg);

            const now = new Date();
            const ct = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            seal.format(tmpCtx, `{$tTime = '${ct}'}`);

            let content = seal.format(tmpCtx, text);

            if (msgType === "group") {
                seal.replyGroup(tmpCtx, mockMsg, content);
            } else {
                seal.replyPerson(tmpCtx, mockMsg, content);
            }
        }, interval * 1000);

        saveSenderState(uniqueKey, taskType, true, msgType);
    }

    const handleTask = (ctx, msg, taskType, action) => {
        if (!checkPerm(ctx)) {
            seal.replyToSender(ctx, msg, "你没有权限启动/停止此定时任务。");
            return;
        }

        let targetId = ctx.isPrivate ? ctx.player.userId : ctx.group.groupId;
        let ep = ctx.endPoint;
        let uniqueKey = `${targetId}_${ep.userId}`;
        let msgType = ctx.isPrivate ? "private" : "group";
        let timerKey = `timer${taskType}`;

        if (!senderTimers[uniqueKey]) senderTimers[uniqueKey] = {};

        if (action === 'start') {
            if (senderTimers[uniqueKey][timerKey]) {
                seal.replyToSender(ctx, msg, `❌ 任务${taskType}已经在运行中了。`);
                return;
            }

            let interval = seal.ext.getIntConfig(ext, `Interval${taskType}`);
            if (interval < 5) interval = 60;

            seal.replyToSender(ctx, msg, `✅ 已启动任务${taskType}，每 ${interval} 秒发送一次。`);
            runSenderTask(ep, targetId, msgType, taskType);

        } else if (action === 'stop') {
            if (!senderTimers[uniqueKey][timerKey]) {
                seal.replyToSender(ctx, msg, `⚠️ 任务${taskType}当前并未开启。`);
                return;
            }

            clearInterval(senderTimers[uniqueKey][timerKey]);
            senderTimers[uniqueKey][timerKey] = null;
            saveSenderState(uniqueKey, taskType, false, msgType);

            seal.replyToSender(ctx, msg, `🛑 任务${taskType}已停止。`);
        }
    };

    function restoreTasks() {
        const data = ext.storageGet(STORAGE_KEY_SENDER);
        if (!data) return;
        const states = JSON.parse(data);
        const eps = seal.getEndPoints();

        for (let uniqueKey in states) {
            let [targetId, botId] = uniqueKey.split('_');
            let info = states[uniqueKey];

            let ep = eps.find(e => e.userId === botId);
            if (!ep || ep.state !== 1) continue;

            if (info["A"]) runSenderTask(ep, targetId, info["type"], "A");
            if (info["B"]) runSenderTask(ep, targetId, info["type"], "B");
        }
    }

    function registerDynamicCmd(configKey, taskType, action, helpDesc) {
        let cmdName = seal.ext.getStringConfig(ext, configKey);
        if (!cmdName) cmdName = `Default${action}${taskType}`;

        let cmd = seal.ext.newCmdItemInfo();
        cmd.name = cmdName;
        cmd.help = helpDesc;

        cmd.solve = (ctx, msg, cmdArgs) => {
            handleTask(ctx, msg, taskType, action);
            return seal.ext.newCmdExecuteResult(true);
        };

        ext.cmdMap[cmdName] = cmd;
    }

    registerDynamicCmd("CmdStartA", "A", "start", "启动定时任务A");
    registerDynamicCmd("CmdStopA",  "A", "stop",  "停止定时任务A");
    registerDynamicCmd("CmdStartB", "B", "start", "启动定时任务B");
    registerDynamicCmd("CmdStopB",  "B", "stop",  "停止定时任务B");

    let manualCmdName = seal.ext.getStringConfig(ext, "CmdManual");
    if (!manualCmdName) manualCmdName = "manual";

    const PLUGIN_MANUAL = `
[ ${ext.name} V${ext.version} 插件完整手册 ]
作者: ${ext.author}

--- 核心概念 ---
1. KEY (例如: morning, hourly): 用于配置中引用的文案名称。
2. 变量格式: 使用海豹核心支持的 {$tTime}, {$t玩家}, [[1d100]] 等格式。

--- Ⅰ. 定时报时与开关 ---
* 功能: 实现群内精确时间或周期性的自动报时。
* 开关指令: 查看配置项 3/4 (默认: 开启报时/关闭报时)。
* 时间表格式: {规则, KEY};
  - 目标时间: {HH:mm, KEY}, {hour, KEY}, {half, KEY}, {quarter, KEY}
  - 周期倒计时: {countdown:Xm, KEY} (每隔X分钟)

--- Ⅱ. 倒计时功能 ---
* 指令: .cd <时间> [原因] (例如 .cd 1h30m)
* 管理员可禁用此功能。

--- Ⅲ. 间隔发送任务 (AutoSender) ---
* 功能: 任务A/B 可独立循环发送。
* 特性: 支持重启后自动恢复任务。
* 指令: 查看配置项 CmdStartA/B (默认: .开始报时/.开始提醒)。
`;

    const cmdManual = seal.ext.newCmdItemInfo();
    cmdManual.name = manualCmdName;
    cmdManual.help = '查看本插件完整使用手册。';
    cmdManual.solve = (ctx, msg, cmdArgs) => {
        seal.replyToSender(ctx, msg, PLUGIN_MANUAL);
        return seal.ext.newCmdExecuteResult(true);
    };
    ext.cmdMap[manualCmdName] = cmdManual;

    setTimeout(restoreTasks, 5000);
}