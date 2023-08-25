/**
 * @function
 * @description 创建span元素供terminal-block使用
 * @param {string} type - 要创建的span的类型
 * @param {string} content - 要创建的span的文本内容
 * @return {HTMLSpanElement} statusSpan
 */
function addSpan(type, content) {
    // 创建一个新的 <span> 元素
    let statusSpan = document.createElement("span");

    // 根据传入的 type 参数添加不同的类名和内容
    switch (type) {
        case "Loading":
            statusSpan.id = "Loading";
            statusSpan.textContent = "";
            break;
        case "Tab":
            statusSpan.className = "Tab";
            statusSpan.textContent = "";
            break;
        case "System":
            statusSpan.className = "System";
            statusSpan.textContent = "System";
            break;
        case "Date":
            statusSpan.className = "Date";
            // 获取当前时间并设置为内容
            statusSpan.textContent = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            break;
        case "Succ":
            statusSpan.className = "Succ";
            statusSpan.textContent = "Done";
            break;
        case "Fail":
            statusSpan.className = "Fail";
            statusSpan.textContent = "Error";
            break;
        case "Info":
            statusSpan.className = "Info";
            statusSpan.textContent = "Info";
            break;
        default:
            statusSpan.className = "cmd";
            statusSpan.textContent = "";
            break;

    }

    if (content != null)
        statusSpan.innerHTML = content;

    return statusSpan;
}

/**
 * @function
 * @description 创建terminal-block元素并添加子元素span，最后添加到terminal-show中
 * @param {number} numSpans - 要创建的 <span> 元素的数量
 * @param {...string[][]} spanData - 包含每个 <span> 元素的数据，格式为 [type, content]
 */
function addBlock(numSpans, ...spanData) {
    if (typeof numSpans !== "number" || numSpans <= 0) {
        console.error("First argument must be a positive number.");
        return;
    }

    let terminalBlock = document.createElement("div");
    terminalBlock.className = "terminal-block";

    for (let i = 0; i < numSpans; i++) {
        if (!Array.isArray(spanData[i])) {
            console.error("Subsequent arguments must be in the form of string arrays.");
            return;
        }
        let span = addSpan(spanData[i] && spanData[i][0],
            spanData[i] && spanData[i][1])
        // span.className = spanData[i] && spanData[i][0] ? spanData[i][0] : "cmd";
        // span.textContent = spanData[i] && spanData[i][1] ? spanData[i][1] : "";
        terminalBlock.appendChild(span);
    }
    
    if (terminalShow)
        terminalShow.appendChild(terminalBlock);
}

//
// // 调用函数，并传入相应的参数
// add(1, ["System", "Welcome to muquew!"]); // 一个 <span> 元素
// add(2, ["Date"], ["Succ", "Success Content"]); // 两个 <span> 元素
// add(3, ["Fail", "Error"], ["System", "Another example"], ["Succ"]); // 三个 <span> 元素
// add(1,["cmd","Invalid"]); // 参数错误，会输出错误消息

/**
 * @function
 * @description 根据命令执行
 * @param {string} command - 命令
 */
async function addOutput(command) {
    addBlock(1, ["cmd", "➜ ~ " + command]);
    
    terminalInput.style.display = "none";
    
    await commandProcess(command);

    terminalInput.style.display = "block";
}


async function commandProcess(command) {
    if (command === "") {
        // 处理空命令
    } else if (command.trimStart().startsWith("cd ") || command.trim() === "cd") {
        terminalName.innerText = command.replace(/^cd\s*/, "");
    } else if (command.trim() === "pwd") {
        addBlock(1,["cmd", terminalName.innerText]);
    } else if (command.trim() === "ls") {
        Help();
    } else if (command.trim() === "date"){
        addBlock(2,['Info', "Date:"], ["cmd", new Date().toString()])
    } else if (command.trimStart().startsWith("echo ") || command.trim() === "echo") {
        addBlock(3, ["Date"], ["Succ", "Echo"], ["cmd", command.replace(/^echo\s*/, "")]);
    } else if (command.trimStart().startsWith("open ") || command.trim() === "open") {
        let url = command.replace(/^open\s*/, "");
        if(urlRegex.test(url)) {
            addBlock(2, ["Succ", "Success"], ["cmd", "Opening..."]);
            window.open(url, "_blank");
            addBlock(2, ["Succ", "Done"], ["cmd", ":)"]);
        } else {
            addBlock(2, ["Fail"], ["cmd", "Please add `http | https | ftp` prefix!"]);
        }
    } else if (command.trim() === "intro"){
        await Intro();
    } else if (command.trim() === "contact"){
        addBlock(2, ["Info", "Email:"], ["cmd", "`muquew@outlook.com`"]);
        addBlock(2, ["Info", "Github:"], ["cmd", "`https://github.com/muquew`"]);
    } else if (command.trim() === "cartoon"){

    } else if (command.trim() === "music"){

    } else if (command.trim() === "gallery"){

    } else if (command.trim() === "film"){

    } else if (command.trim() === "help") {
        Help();
    } else if (command.trim() === "history") {
        if(Object.keys(historyCommand).length !== 0) {
            addBlock(1, ["cmd", printHistoryCommand(historyCommand)]);
        }
    } else if (command.trim() === "clear" || command.trim() === "cls") {
        terminalShow.innerHTML = "";
    } else if(command.trim() === "exit"){
        window.location.href = "index.html";
    } else {
        addBlock(2, ["Fail"], ["cmd", `Command '${command}' not found`]);
        addBlock(2, ["System"], ["cmd", "Type \"help\" to get a supporting command list."]);
    }
}
async function LoadingEffect() {
    await addBlock(1,["Loading"]);
    await new Promise(resolve => setTimeout(resolve, 500));
    const LoadingElement = document.getElementById("Loading");
    await LoadingElement.parentElement.remove();
}

async function Intro() {
    await LoadingEffect();
    addBlock(1, ["cmd", "Welcome to muquew!"]);
    await LoadingEffect();
    addBlock(2, ["System"], ["cmd", "cd muquew"]);
    await LoadingEffect();
    addBlock(2, ["System"], ["cmd", "Thanks for your visit, let me introduce myself."]);
    await LoadingEffect();
    addBlock(3, ["Date"], ["Info","Name:"], ["cmd", "muquew"]);
    await LoadingEffect();
    addBlock(3, ["Date"], ["Info","Sex:"], ["cmd", "Male"]);
    await LoadingEffect();
    addBlock(3, ["Date"], ["Info","Age:"], ["cmd", (new Date().getFullYear() - 2003).toString()]);
    await LoadingEffect();
    addBlock(3, ["Date"], ["Info","Email:"], ["cmd", "muquew@outlook.com"]);
    addBlock(2, ["Succ"], ["cmd", "Myself introduction is over!"]);
}

function Help() {
    addBlock(1, ["cmd", "Here is a list of supporting command."]);
    
    addBlock(2, ["Succ", "contact"], ["cmd", "() => Return a list of my contact information."]);
    addBlock(2, ["Succ", "intro"], ["cmd", "() => Introducting myself again."]);
    addBlock(2, ["Succ", "echo"], ["cmd", "() => Echoes input."]);
    addBlock(2, ["Succ", "open"], ["cmd", "() => Open a specified url in a new tab."]);

    addBlock(2, ["Succ", "cartoon"], ["cmd", "() =>Open my favorite cartoon in a new tab."]);
    addBlock(2, ["Succ", "music"], ["cmd", "() => Open my favorite music in a new tab."]);
    addBlock(2, ["Succ", "gallery"], ["cmd", "() => Open my gallery in a new tab."]);
    addBlock(2, ["Succ", "film"], ["cmd", "() => Open my favorite film in a new tab."]);


    addBlock(2, ["System"], ["cmd", "Type \"history\" to show a list of history commands."]);
    addBlock(2, ["System"], ["cmd", "Type \"clear\" to clear the terminal screen."]);
    addBlock(2, ["System"], ["cmd", "Type \"exit\" to return to the main page."]);
}











