window.onload = async function () {
    await firstShow();
    terminalInput.style.display = "block";
    // 初始状态就闪烁
    inputCmd.innerHTML = spanInputBlock;
    inputBox.focus();
};

async function firstShow() {
    await Intro();
    addBlock(2, ["System"], ["cmd", "Type \"help\" to get a supporting command list."]);
    addBlock(2, ["System"], ["cmd", "Type \"clear\" to clear the terminal screen."]);
    addBlock(2, ["System"], ["cmd", "Type \"exit\" to return to the main page."]);
}

function updateInputCmd() {
    inputCmd.innerHTML = inputBox.value.substring(0, PointerCurrentPosition) + spanInputBlock + inputBox.value.substring(PointerCurrentPosition);
}

inputBox.addEventListener("input", (event) => {
    PointerCurrentPosition = inputBox.selectionStart;
    updateInputCmd();
});

inputBox.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
        if (PointerCurrentPosition > 0) {
            PointerCurrentPosition -= 1;
            updateInputCmd();
        }
    } else if (event.code === "ArrowRight") {
        if (PointerCurrentPosition < inputBox.value.length) {
            PointerCurrentPosition += 1;
            updateInputCmd();
        }
    } else if (event.code === "ArrowUp") {
        event.preventDefault();
        if (historyCommandCurrent !== 0) {
            historyCommandCurrent = (historyCommandCurrent > 0) ? (historyCommandCurrent - 1) : 0;
            inputBox.value = historyCommand[historyCommandCurrent];
            inputCmd.innerHTML = inputBox.value + spanInputBlock;
        }
    } else if (event.code === "ArrowDown") {
        event.preventDefault();
        historyCommandCurrent = (historyCommandCurrent < historyCommandCounter) ? historyCommandCurrent + 1 : historyCommandCounter;
        inputBox.value = (historyCommandCurrent === historyCommandCounter) ? "" : historyCommand[historyCommandCurrent];
        inputCmd.innerHTML = inputBox.value + spanInputBlock;
    } else if (event.code === "Enter") {
        event.preventDefault(); // 阻止默认的回车换行行为
        // 没有输入汉字的时候处理send
        if (!isComposing) {
            addHistoryCommand(inputBox.value);
            addOutput(inputBox.value);
            inputBox.value = null;
            inputCmd.innerHTML = spanInputBlock;
        }
    } else if (event.code === 'Tab') {
        event.preventDefault();
        let input = inputBox.value.trim();
        let filtered = Command.filter(command => command.startsWith(input));
        let length = filtered.length;
        if (length === 1) {
            inputBox.value = filtered[0];
            inputCmd.innerHTML = inputBox.value + spanInputBlock;
        } else if (length > 1) {
            addBlock(1, ["cmd", "➜ ~ " + inputBox.value]);
            addBlock(1, ["Tab", filtered.join('&emsp;')])
        }
    }

    
    // 处理选中结束之后的左右箭头事件，当前指针位置分别对应选中文本的左右位置
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) {
        if (event.key === "ArrowLeft") {
            PointerCurrentPosition = inputBox.selectionStart;
            updateInputCmd();
        } else if (event.key === "ArrowRight") {
            PointerCurrentPosition = inputBox.selectionEnd;
            updateInputCmd();
        }
    }
});
// BUG:  同方向选中到头后继续同方向移动，高光会消失
// 在文本框中进行选中操作后触发
inputBox.addEventListener("select", function (event) {
    const start = inputBox.selectionStart;
    const end = inputBox.selectionEnd;

    let selected = document.createElement("span");
    selected.className = "input-cmd-selected";
    selected.innerText = inputBox.value.substring(start, end);

    if (start !== end) {
        inputCmd.innerHTML = inputBox.value.substring(0, start) + selected.outerHTML + inputBox.value.substring(end);
    } 
    // else {
    //     console.log("没有选中文本");
    // }
});

// 解决拼音输入法的时候回车事件
let isComposing = false; // 标记是否正在输入中
// 拼音输入法开始输入
inputBox.addEventListener("compositionstart", () => {
    isComposing = true;
});
// 拼音输入法结束
inputBox.addEventListener("compositionend", (event) => {
    isComposing = false;
});

// 保持输入在视窗之内,有滚动条的部分是mid
// 弃用DOMNodeInserted
// terminalMid.addEventListener('DOMNodeInserted', function (event) {
//     // 子元素被添加到了terminalMid
//     terminalMid.scrollTop = terminalMid.scrollHeight;
// });
const scrollObserver = new MutationObserver(function (mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // 子元素被添加到了terminalShow的时候调整terminalMid的视窗位置
            terminalMid.scrollTop = terminalMid.scrollHeight;
        }
    }
});
// childList - 子元素列表;   subtree - 孙元素
scrollObserver.observe(terminalShow, {childList: true, subtree: false});


// 添加历史记录
function addHistoryCommand(value) {
    historyCommand[historyCommandCounter] = value;
    historyCommandCounter++;
    historyCommandCurrent = historyCommandCounter;
}
function printHistoryCommand(obj) {
    let result = ""; // 初始化一个空字符串来保存格式化后的键值对
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) { // 确保属性是对象自身的属性，而不是继承的属性
            const paddedKey = key.padEnd(maxHistoryKeyLength); // 对其键的长度，统一为<9999
            result += `&emsp;&emsp;${paddedKey}&nbsp;&nbsp;${obj[key]}<br />`; // 将键和值拼接为一个字符串，并添加换行符
        }
    }
    return result; // 返回格式化后的键值对字符串
}
