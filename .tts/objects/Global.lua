-- --------------------------
-- 当前语言，默认 cn
local currentLang = "cn"

-- --------------------------
-- URL 模板（部分动态，根据 currentLang）
local mechUrlTemplate = "https://op-1307392056.cos.ap-guangzhou.myqcloud.com/mechs/%s"

local function getCardUrlTemplate()
    if currentLang == "cn" then
        return "https://op-1307392056.cos.ap-guangzhou.myqcloud.com/res/cn/%s.png"
    else
        return "https://raw.githubusercontent.com/Watermelon02/builder-web/main/res/" .. currentLang .. "/%s.png"
    end
end

local function getTabTemplate()
    if currentLang == "cn" then
        return "https://op-1307392056.cos.ap-guangzhou.myqcloud.com/res/tab/%s.png"
    else
        return "https://raw.githubusercontent.com/Watermelon02/builder-web/main/res/tab/%s.png"
    end
end

-- --------------------------
-- 辅助函数：生成驾驶员卡 URL
local function getPilotUrl(pilotId, fileType)
    local template
    if currentLang == "cn" then
        template = "https://op-1307392056.cos.ap-guangzhou.myqcloud.com/res/cn/pilot_dial/%s.png"
    else
        template = "https://raw.githubusercontent.com/Watermelon02/builder-web/main/res/" .. currentLang .. "/pilot_dial/%s.png"
    end
    return string.format(template, pilotId .. (fileType or ""))
end

-- --------------------------
-- 辅助函数：生成完整 URL
local function getUrl(template, idOrUrl)
    if not idOrUrl then
        return nil
    end
    if idOrUrl:match("^https?://") then
        return idOrUrl
    else
        return string.format(template, idOrUrl)
    end
end

-- --------------------------
-- 不生成 Figurine 的投射物列表
local projectileFigurineBlacklist = {
    ["154"] = true,
    ["155"] = true,
    ["267"] = true,
    ["268"] = true,
    ["288"] = true,
    ["293"] = true,
    ["294"] = true,
    ["295"] = true,
    ["PDAM-001"] = true,
    ["PDAM-002"] = true,
    ["PDAM-003"] = true,
    ["PDAM-004"] = true,
    ["PDAM-005"] = true,
    ["PDAM-006"] = true
}

-- --------------------------
-- 生成无人机
local function spawnDrone(line, pos, offsetX, playerColor)
    local id = line:match("([%w%-_]+)%s*$")
    if id then
        local droneCardUrl = getUrl(getCardUrlTemplate(), id)
        printToAll("生成无人机 : " .. droneCardUrl, {0, 1, 0})
        spawnCard(droneCardUrl, {pos.x + offsetX, pos.y, pos.z + 4})

        local droneFigurineUrl = getUrl(getTabTemplate(), id)
        printToAll("生成无人机 Figurine: " .. droneFigurineUrl, {0.5, 1, 0})
        spawnFigurine(droneFigurineUrl, {pos.x + offsetX, pos.y + 2, pos.z + 4}, {1, 1, 1}, playerColor)

        offsetX = offsetX + 6
    else
        printToAll("无人机未解析到 ID: " .. line, {1, 0, 0})
    end
    return offsetX
end

-- --------------------------
function onChat(message, player)
    local url = string.match(message, "^!spawn%-team%-tts%-url%s+(.+)")
    if not url then
        return
    end

    printToAll("指令触发, URL: " .. url, {0, 1, 0})

    WebRequest.get(url, function(result)
        if result.is_error then
            printToAll("WebRequest 错误: " .. result.error, {1, 0, 0})
            return
        end

        local text = result.text
        if text:byte(1) == 0xEF and text:byte(2) == 0xBB and text:byte(3) == 0xBF then
            text = text:sub(4)
        end

        local lines = {}
        for line in text:gmatch("[^\r\n]+") do
            table.insert(lines, line)
        end

        local basePos = player.getPointerPosition()
        local offsetX = 0
        local droneX = 0
        local droneRealX = 0
        local mechBaseX = 0
        local torsoX = 0
        local partOffsetX = 0
        local projectileOffsetX = 0
        local lastType = "part"

        for _, line in ipairs(lines) do
            line = line:gsub("^%s+", ""):gsub("%s+$", "")

            -- -------------------- 解析语言 --------------------
            if line:find("^# Team") then
                local lang = line:match("Lang:%s*(%S+)")
                if lang then
                    currentLang = lang
                    printToAll("语言切换为: " .. currentLang, {0, 1, 1})
                end
            end

            -- -------------------- 新机体 --------------------
            if line:sub(1, 6) == "# Mech" then
                local urlPart = line:match("https?://%S+")
                if urlPart then
                    mechBaseX = offsetX
                    partOffsetX = 0
                    projectileOffsetX = 0
                    local mechUrl = getUrl(mechUrlTemplate, urlPart)
                    printToAll("生成机体 : " .. mechUrl, {1, 0.5, 0})
                    spawnFigurine(mechUrl, {basePos.x + mechBaseX, basePos.y + 2, basePos.z}, {1.5, 1.5, 1.5},
                        player.color)
                    offsetX = offsetX + 15
                end

                -- -------------------- 新无人机 --------------------
            elseif line:sub(1, 7) == "# Drone" then
                lastType = "drone"
                projectileOffsetX = 0
                droneRealX = droneX
                droneX = spawnDrone(line, basePos, droneX, player.color)

                -- -------------------- 投射物 --------------------
            elseif line:find("^Projectile:") then
                for proj in line:gmatch("([^,]+)") do
                    proj = proj:gsub("Projectile:%s*", ""):gsub("^%s+", ""):gsub("%s+$", "")
                    local urlProjCard = getUrl(getCardUrlTemplate(), proj)
                    printToAll("生成投射物 : " .. urlProjCard, {0, 0.5, 1})
                    if lastType == "part" then
                        spawnCard(urlProjCard, {basePos.x + mechBaseX + projectileOffsetX, basePos.y, basePos.z - 4})
                    elseif lastType == "drone" then
                        spawnCard(urlProjCard, {basePos.x + droneRealX + projectileOffsetX, basePos.y, basePos.z + 6})
                    end

                    if not projectileFigurineBlacklist[proj] then
                        local urlProjFig = getUrl(getTabTemplate(), proj)
                        printToAll("生成投射物 Figurine: " .. urlProjFig, {0, 0.7, 1})
                        if lastType == "part" then
                            spawnFigurine(urlProjFig,
                                {basePos.x + mechBaseX + projectileOffsetX, basePos.y + 2, basePos.z - 4}, {1, 1, 1},
                                player.color)
                        elseif lastType == "drone" then
                            spawnFigurine(urlProjFig,
                                {basePos.x + droneRealX + projectileOffsetX, basePos.y + 2, basePos.z + 6}, {1, 1, 1},
                                player.color)
                        end
                    else
                        printToAll("跳过投射物 Figurine: " .. proj, {1, 0, 0})
                    end

                    projectileOffsetX = projectileOffsetX + 5
                end

                -- -------------------- 战术卡 --------------------
            elseif line:sub(1, 12) == "# TacticCard" then
                local id = line:match("([%w%-_]+)%s*$")
                if id then
                    local cardUrl = getUrl(getCardUrlTemplate(), id)
                    printToAll("生成战术卡: " .. cardUrl, {0, 1, 0})
                    spawnCard(cardUrl, {basePos.x + droneRealX + projectileOffsetX, basePos.y, basePos.z + 4})
                    offsetX = offsetX + 1
                else
                    printToAll("战术卡未解析到 ID: " .. line, {1, 0, 0})
                end

                -- -------------------- 驾驶员卡 --------------------
            elseif line:sub(1, 6) == "Pilot:" then
                local pilotId = line:match("Pilot:%s*(%S+)")
                if pilotId then
                    printToAll("生成驾驶员卡片: " .. pilotId, {1, 1, 0})
                    spawnPilotCard(pilotId, {
                        x = basePos.x + mechBaseX,
                        y = basePos.y,
                        z = basePos.z
                    })
                    partOffsetX = partOffsetX + 2
                end

                -- -------------------- 部件行 --------------------
            else
                local partId, throwIndex = line:match("^%S+: (%S+)%s*%[throwIndex:(%S+)%]")
                if partId then
                    local urlPart = getUrl(getCardUrlTemplate(), partId)
                    printToAll("生成部件卡: " .. urlPart, {1, 1, 0})
                    lastType = "part"
                    spawnCard(urlPart, {basePos.x + mechBaseX + partOffsetX, basePos.y, basePos.z})
                    if line:match("^Torso:") then
                        torsoX = mechBaseX + partOffsetX
                    end
                    if throwIndex then
                        local urlThrow = getUrl(getCardUrlTemplate(), throwIndex)
                        printToAll("生成弃置卡: " .. urlThrow, {1, 0.5, 0})
                        spawnCard(urlThrow, {basePos.x + mechBaseX + partOffsetX, basePos.y, basePos.z})
                    end
                    partOffsetX = partOffsetX + 2
                else
                    partId = line:match("^%S+: (%S+)")
                    if partId then
                        local urlPart = getUrl(getCardUrlTemplate(), partId)
                        printToAll("生成部件卡: " .. urlPart, {1, 1, 0})
                        lastType = "part"
                        spawnCard(urlPart, {basePos.x + mechBaseX + partOffsetX, basePos.y + 1, basePos.z})
                        partOffsetX = partOffsetX + 2
                    end
                end
            end
        end
    end)
end

-- --------------------------
function spawnCard(url, pos)
    if not url then
        return
    end
    spawnObject({
        type = "Card",
        position = pos,
        rotation = {0, 180, 0},
        scale = {1, 1, 1},
        callback_function = function(o)
            o.setCustomObject({
                face = url,
                back = url,
                type = 0,
                sideways = false
            })
            o.reload()
        end
    })
end

-- --------------------------
function spawnFigurine(url, pos, sca, playerColor)
    if not url then
        return
    end
    spawnObject({
        type = "Figurine_Custom",
        position = pos,
        rotation = {0, 180, 0},
        scale = sca,
        callback_function = function(o)
            o.setCustomObject({
                image = url,
                image_secondary = url
            })
            o.setColorTint(playerColor)
            o.reload()
        end
    })
end



-- --------------------------
function spawnPilotCard(pilotId, pos)
    local stateCount = 6
    local baseName = tostring(pilotId)
    local baseDeckId = 50

    -- 每个 state 的显示名称
    local stateNames = {
        [1] = "快速",
        [2] = "近战",
        [3] = "抛射",
        [4] = "射击",
        [5] = "移动",
        [6] = "战术"
    }

    -- 主卡 CustomDeck
    local customDeck = {}
    customDeck[tostring(baseDeckId)] = {
        FaceURL = getPilotUrl(baseName, "-face"),
        BackURL = getPilotUrl(baseName, "-state-1"),
        NumWidth = 1,
        NumHeight = 1,
        BackIsHidden = true,
        UniqueBack = true,
        Type = 0
    }

    local card = {
        GUID = "pilot" .. pilotId,
        Name = "CardCustom",
        Nickname = stateNames[1],
        Description = "",
        Transform = {
            posX = pos.x, posY = pos.y, posZ = pos.z,
            rotX = 0, rotY = 180, rotZ = 0,
            scaleX = 1, scaleY = 1, scaleZ = 1
        },
        CustomDeck = customDeck,
        CardID = baseDeckId * 100 + 1,
        States = {}
    }

    -- 其余 state
    for i = 2, stateCount do
        local deckId = baseDeckId + i - 1
        local stateCardId = deckId * 100 + 1

        local stateDeck = {}
        stateDeck[tostring(deckId)] = {
            FaceURL = getPilotUrl(baseName, "-face"),
            BackURL = getPilotUrl(baseName, "-state-" .. i),
            NumWidth = 1,
            NumHeight = 1,
            BackIsHidden = true,
            UniqueBack = true,
            Type = 0
        }

        card.States[tostring(i)] = {
            GUID = "pilot" .. pilotId .. "s" .. i,
            Name = "CardCustom",
            Nickname = stateNames[i] or ("State " .. i),
            Description = "",
            Transform = {
                posX = pos.x, posY = pos.y, posZ = pos.z,
                rotX = 0, rotY = 180, rotZ = 0,
                scaleX = 1, scaleY = 1, scaleZ = 1
            },
            CustomDeck = stateDeck,
            CardID = stateCardId
        }
    end

    spawnObjectJSON({ json = JSON.encode(card) })
end






-- --------------------------
function onPlayerConnect(player)
    printToColor(
        "欢迎游玩 EOP！你可以前往 https://watermelon02.github.io/builder-web/ 创建你的军表。完成后将军表导出为 TTS 指令，并把指令粘贴到 TTS 聊天框中，即可自动生成对应的卡片和单位。\n\nWelcome to EOP! Visit https://watermelon02.github.io/builder-web/ to build your squad. After exporting the TTS command, paste it into the TTS chat to automatically generate all cards and units.",
        player.color, {1, 0, 0})
end

function onLoad()
    printToAll(
        "欢迎游玩 EOP！你可以前往 https://watermelon02.github.io/builder-web/ 创建你的军表。完成后将军表导出为 TTS 指令，并把指令粘贴到 TTS 聊天框中，即可自动生成对应的卡片和单位。\n\nWelcome to EOP! Visit https://watermelon02.github.io/builder-web/ to build your squad. After exporting the TTS command, paste it into the TTS chat to automatically generate all cards and units.",
        {1, 0, 0})
end