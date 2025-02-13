<template>
  <div class="container">
      <div class="left"></div>
      <div class="middle">
          <div class="terminal">
              <div class="terminal-top">
                  <ul class="circle-list">
                      <li class="red-circle"></li>
                      <li class="yellow-circle"></li>
                      <li class="green-circle"></li>
                  </ul>
                  <h4> {{ terminalName }}</h4>
              </div>
              <div class="terminal-mid" id="terminalMid" @click="inputFous">
                  <div class="terminal-show" id="terminalShow"></div>
                  <div class="terminal-input" id="terminalInput">
                      <span class="input-prompt">➜ ~ </span>
                      <span class="input-cmd" @click="inputFous"  v-html="inputCmd"></span>
                      <label for="inputBox"></label><input id="inputBox" lang="en" inputmode="text"/>
                  </div>
              </div>
          </div>
      </div>
      <div class="right"></div>
      <a class="github-corner" :href=ine.link.github target="_blank" rel="noopener noreferrer">
          <svg width="80" height="80" viewBox="0 0 250 250"
              style="fill:transparent;color:#ccc;position:absolute;top:0;border:0;right:0">
              <path d="M0 0 115 115 130 115 142 142 250 250 250 0Z"></path>
              <path class="Octocat-arm"
                  d="M128.3 109C113.8 99.7 119 89.6 119 89.6 122 82.7 120.5 78.6 120.5 78.6 119.2 72 123.4 76.3 123.4 76.3 127.3 80.9 125.5 87.3 125.5 87.3 122.9 97.6 130.6 101.9 134.4 103.2"
                  fill="currentColor" style="transform-origin:130px 106px"></path>
              <path class="Octocat-body"
                  d="M115 115C114.9 115.1 118.7 116.5 119.8 115.4L133.7 101.6C136.9 99.2 139.9 98.4 142.2 98.6 133.8 88 127.5 74.4 143.8 58 148.5 53.4 154 51.2 159.7 51 160.3 49.4 163.2 43.6 171.4 40.1 171.4 40.1 176.1 42.5 178.8 56.2 183.1 58.6 187.2 61.8 190.9 65.4 194.5 69 197.7 73.2 200.1 77.6 213.8 80.2 216.3 84.9 216.3 84.9 212.7 93.1 206.9 96 205.4 96.6 205.1 102.4 203 107.8 198.3 112.5 181.9 128.9 168.3 122.5 157.7 114.1 157.9 116.9 156.7 120.9 152.7 124.9L141 136.5C139.8 137.7 141.6 141.9 141.8 141.8Z"
                  fill="currentColor"></path>
          </svg>
      </a>
  </div>
</template>
<script>
export default {
  name: "About",
  data() {
    return {
        ine: intro,
        spanInputBlock: '<span class="input-block">&nbsp;</span>',
        PointerCurrentPosition: 0,
        urlRegex: '',
        terminalName: '',
        inputCmd: '',
        doms: {
            inputBox: '',
            terminalShow: '',
            terminalMid: '',
            terminalInput: '',
        },
        Command: [],
        historyCommand: {},         // 不要超过9999，四位数
        maxHistoryKeyLength: 4,     // 键的最长，四位数
        historyCommandCounter: 0,
        historyCommandCurrent: 0,

        // 解决拼音输入法的时候回车事件
        isComposing: false, // 标记是否正在输入中

        // Span
        spanTypes: {},
        spanHtmlTypes: [],
        spanLinkTypes: []

    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
        // 确保在组件挂载之后执行
        vm.$nextTick(() => {
            if (vm.doms && vm.doms.terminalMid && vm.doms.inputBox) {
                vm.doms.terminalMid.scrollTop = vm.doms.terminalMid.scrollHeight;
                setTimeout(() => { vm.doms.inputBox.focus(); }, 0);
            }
        });
    });
  },
  mounted() {
    this.terminalName = this.ine.en.name;

    this.doms.inputBox = document.getElementById("inputBox");
    this.doms.terminalShow = document.getElementById("terminalShow");
    this.doms.terminalMid = document.getElementById("terminalMid");
    this.doms.terminalInput = document.getElementById("terminalInput");
    // ①：该正则表达式匹配的字符串必须以http://、https://、ftp://开头；
    // ②：该正则表达式能匹配URL或者IP地址；（如：http://www.baidu.com 或者 http://192.168.1.1）
    // ③：该正则表达式能匹配到URL的末尾，即能匹配到子URL；（如能匹配：http://www.baidu.com/s?wd=a&rsv_spt=1&issp=1&rsv_bp=0&ie=utf-8&tn=baiduhome_pg&inputT=1236）
    // ④：该正则表达式能够匹配端口号；
    this.urlRegex = new RegExp("((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?");
    this.Command = ['cd', 'pwd', 'ls', 'echo', 'date', 'open', 'intro', 'contact', 'cartoon', 'music', 'gallery', 'film', 'help', 'history', 'cls', 'clear', 'exit'];
    // 定义类型和内容映射
    this.spanTypes = {
        "Loading": { id: "Loading", text: "" },
        "System": { className: "System", text: "System" },
        "Date": { className: "Date", text: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
        "Succ": { className: "Succ", text: "Done" },
        "Fail": { className: "Fail", text: "Error" },
        "Info": { className: "Info", text: "Info" },
    };
    this.spanHtmlTypes = [ "History", "Tab" ];
    this.spanLinkTypes = [ "Link", "Email" ];



    this.onLoad();

    this.doms.inputBox.addEventListener("input", this.LisInputInput);
    this.doms.inputBox.addEventListener("keydown", this.LisInputKeydown);
    // this.doms.inputBox.addEventListener("select", this.LisInputSelect);
    this.doms.inputBox.addEventListener("compositionstart", () => {this.isComposing = true});
    this.doms.inputBox.addEventListener("compositionend", () => {this.isComposing = false});

    // 保持输入在视窗之内,有滚动条的部分是mid
    // 弃用DOMNodeInserted
    // terminalMid.addEventListener('DOMNodeInserted', function (event) {
    //     // 子元素被添加到了terminalMid
    //     terminalMid.scrollTop = terminalMid.scrollHeight;
    // });
    const scrollObserver_1 = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 子元素被添加到了terminalShow的时候调整terminalMid的视窗位置
                this.doms.terminalMid.scrollTop = this.doms.terminalMid.scrollHeight;
            }
        }
    });
    // childList - 子元素列表;   subtree - 孙元素
    scrollObserver_1.observe(this.doms.terminalShow, {childList: true, subtree: false});
    // terminalInput的display属性变为block的时候
    const scrollObserver_2 = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "attributes" && mutation.attributeName === "style") {
                const displayStyle = this.doms.terminalInput.style.display;
                if (displayStyle === "block") {
                    this.doms.terminalMid.scrollTop = this.doms.terminalMid.scrollHeight;
                }
            }
        }
    });
    scrollObserver_2.observe(this.doms.terminalInput, { attributes: true });

  },
  unmounted() {
    this.doms.inputBox.removeEventListener("input", this.LisInputInput);
    this.doms.inputBox.removeEventListener("keydown", this.LisInputKeydown);
    // this.doms.inputBox.removeEventListener("select", this.LisInputSelect);
    this.doms.inputBox.removeEventListener("compositionstart", () => {this.isComposing = true});
    this.doms.inputBox.removeEventListener("compositionend", () => {this.isComposing = false});
    scrollObserver_1.disconnect();
    scrollObserver_2.disconnect();
  },
  methods: {
    /**
     * @function
     * @description 创建span元素供terminal-block使用
     * @param {string} type - 要创建的span的类型
     * @param {string} content - 要创建的span的文本内容
     * @return {HTMLSpanElement} statusSpan
     */
     addSpan(type, content) {
        // 创建一个新的 <span> 元素
        let statusSpan = document.createElement("span");

        let element;  // 用来存储处理后的元素（<a> 标签或 <span> 标签）


        // 默认处理的类和文本
        const typeData = this.spanTypes[type];

        if (typeData) {
            statusSpan.className = typeData.className || "cmd"; 
            if(typeData.id) statusSpan.id = typeData.id;
            statusSpan.textContent = content || typeData.text;
        } else {
            if (this.spanLinkTypes.includes(type)) {
                element = document.createElement("a");
                element.href = type === "Email" ? "mailto:" + content : content;
                element.textContent = content;
                element.target = "_blank";
                element.className = "Links";

                // statusSpan.className = type;
                statusSpan.appendChild(element);  // 将链接添加到span中
            } else if(this.spanHtmlTypes.includes(type)) {
                statusSpan.className = "cmd";
                statusSpan.innerHTML = content;     // History使用innerHTML
            } else {
                // 默认情况，普通文本处理
                statusSpan.className = "cmd";
                statusSpan.textContent = content || "";
            }
        }

        return statusSpan;
    },

    // addSpan(type, content) {
    //     // 创建一个新的 <span> 元素
    //     let statusSpan = document.createElement("span");

    //     // 根据传入的 type 参数添加不同的类名和内容
    //     switch (type) {
    //         case "Loading":
    //             statusSpan.id = "Loading";
    //             statusSpan.textContent = "";
    //             break;
    //         case "Tab":
    //             statusSpan.className = "Tab";
    //             statusSpan.textContent = "";
    //             break;
    //         case "System":
    //             statusSpan.className = "System";
    //             statusSpan.textContent = "System";
    //             break;
    //         case "Date":
    //             statusSpan.className = "Date";
    //             // 获取当前时间并设置为内容
    //             statusSpan.textContent = new Date().toLocaleTimeString([], {
    //                 hour: '2-digit',
    //                 minute: '2-digit',
    //                 second: '2-digit'
    //             });
    //             break;
    //         case "Succ":
    //             statusSpan.className = "Succ";
    //             statusSpan.textContent = "Done";
    //             break;
    //         case "Fail":
    //             statusSpan.className = "Fail";
    //             statusSpan.textContent = "Error";
    //             break;
    //         case "Info":
    //             statusSpan.className = "Info";
    //             statusSpan.textContent = "Info";
    //             break;
    //         case "Link":
    //             // 如果是 link 类型，创建 <a> 标签
    //             let link = document.createElement("a");
    //             link.href = content;  // 将 content 作为链接
    //             link.textContent = content;  // 设置显示文本
    //             link.target = "_blank";  // 在新标签页打开链接
    //             link.className = "Link";
    //             statusSpan.className = "Link";  // 设置 span 的 className
    //             statusSpan.appendChild(link);  // 将 <a> 标签添加到 span 中
    //             break;
    //         case "Email":
    //             // 如果是 link 类型，创建 <a> 标签
    //             let email = document.createElement("a");
    //             email.href = "mailto:" + content;  // 将 content 作为链接
    //             email.textContent = content;  // 设置显示文本
    //             email.target = "_blank";  // 在新标签页打开链接
    //             statusSpan.className = "Email";  // 设置 span 的 className
    //             statusSpan.appendChild(email);  // 将 <a> 标签添加到 span 中
    //             break;
    //         default:
    //             statusSpan.className = "cmd";
    //             statusSpan.textContent = "";
    //             break;
    //     }

    //     if (content != null && type != "Link" && type != "Email")
    //         statusSpan.innerHTML = content;
    //     return statusSpan;
    // },

    
    /**
     * @function
     * @description 创建terminal-block元素并添加子元素span，最后添加到terminal-show中
     * @param {number} numSpans - 要创建的 <span> 元素的数量
     * @param {...string[][]} spanData - 包含每个 <span> 元素的数据，格式为 [type, content]
     */
    addBlock(numSpans, ...spanData) {
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
            let span = this.addSpan(spanData[i] && spanData[i][0], spanData[i] && spanData[i][1])
            // span.className = spanData[i] && spanData[i][0] ? spanData[i][0] : "cmd";
            // span.textContent = spanData[i] && spanData[i][1] ? spanData[i][1] : "";
            terminalBlock.appendChild(span);
        }
        
        if (this.doms.terminalShow)
            this.doms.terminalShow.appendChild(terminalBlock);
    },
    // // 调用函数，并传入相应的参数
    // add(1, ["System", "Welcome to .....!"]); // 一个 <span> 元素
    // add(2, ["Date"], ["Succ", "Success Content"]); // 两个 <span> 元素
    // add(3, ["Fail", "Error"], ["System", "Another example"], ["Succ"]); // 三个 <span> 元素
    // add(1,["cmd","Invalid"]); // 参数错误，会输出错误消息

    /**
     * @function
     * @description 根据命令执行
     * @param {string} command - 命令
     */
    async addOutput(command) {
        this.addBlock(1, ["cmd", "➜ ~ " + command]);
        
        this.doms.terminalInput.style.display = "none";
        
        await this.commandProcess(command);

        this.doms.terminalInput.style.display = "block";
    },
    async commandProcess(command) {
        if (command === "") {
            // 处理空命令
        } else if (command.trimStart().startsWith("cd ") || command.trim() === "cd") {
            this.terminalName = command.replace(/^cd\s*/, "");
        } else if (command.trim() === "pwd") {
            this.addBlock(1,["cmd", this.terminalName]);
        } else if (command.trim() === "ls") {
            this.Help();
        } else if (command.trim() === "date"){
            this.addBlock(2,['Info', "Date:"], ["cmd", new Date().toString()])
        } else if (command.trimStart().startsWith("echo ") || command.trim() === "echo") {
            this.addBlock(3, ["Date"], ["Succ", "Echo"], ["cmd", command.replace(/^echo\s*/, "")]);
        } else if (command.trimStart().startsWith("open ") || command.trim() === "open") {
            let url = command.replace(/^open\s*/, "");
            if(this.urlRegex.test(url)) {
                this.addBlock(2, ["Succ", "Success"], ["cmd", "Opening..."]);
                window.open(url, "_blank");
                this.addBlock(2, ["Succ", "Done"], ["cmd", ":)"]);
            } else {
                this.addBlock(2, ["Fail"], ["cmd", "Please add `http | https | ftp` prefix!"]);
            }
        } else if (command.trim() === "intro"){
            await this.Intro();
            this.inputFous();
        } else if (command.trim() === "contact"){
            // this.addBlock(2, ["Info", "Email:"], ["cmd", `\`${ this.ine.link.mail }\``]);
            // this.addBlock(2, ["Info", "Github:"], ["cmd", `\`${ this.ine.link.github }\``]);
            this.addBlock(2, ["Info", "Email:"], ["Email", this.ine.link.mail]);
            this.addBlock(2, ["Info", "Github:"], ["Link", this.ine.link.github]);
        } else if (command.trim() === "cartoon"){

        } else if (command.trim() === "music"){

        } else if (command.trim() === "gallery"){

        } else if (command.trim() === "film"){

        } else if (command.trim() === "help") {
            this.Help();
        } else if (command.trim() === "history") {
            if(Object.keys(this.historyCommand).length !== 0) {
                this.addBlock(1, ["History", this.printHistoryCommand(this.historyCommand)]);
            }
        } else if (/^!.*/.test(command.trim())) {  // 匹配类似 !1, !2 的命令
            const match = command.trim().match(/^!(.*)$/);
            const contentAfterExclamation = match[1];
            // 判断 ! 后面的内容是否是数字
            if (!/^\d+$/.test(contentAfterExclamation)) {
                this.addBlock(2, ["Fail"], ["cmd", `!${contentAfterExclamation} : event not found!`]);
                return;
            }
            const index = parseInt(contentAfterExclamation, 10);
            // 当前命令：避免执行当前命令（历史命令的最新命令）
            if(Object.keys(this.historyCommand).length - index === 1) {
                this.addBlock(2, ["Fail"], ["cmd", "It is the current command already executed."]);
                return;
            }
            // 超命令
            if(index < 0 || Object.keys(this.historyCommand).length - index < 1) {
                this.addBlock(2, ["Fail"], ["cmd", "No such history found."]);
                return;
            }
            // 重复执行
            if(index - 1 < 0 || this.historyCommand[index] === this.historyCommand[index - 1] || this.historyCommand[index] === this.historyCommand[Object.keys(this.historyCommand).length - 1]) {
                this.addBlock(2, ["Fail"], ["cmd", `To avoid infinite loops, command !${index} won't be executed again.`]);
                return;
            }
            await this.addOutput(this.historyCommand[index]);
        } else if (command.trim() === "clear" || command.trim() === "cls") {
            this.doms.terminalShow.innerHTML = "";
        } else if(command.trim() === "exit"){
            this.$router.go(-1);
        } else {
            this.addBlock(2, ["Fail"], ["cmd", `Command '${command}' not found`]);
            this.addBlock(2, ["System"], ["cmd", "Type \"help\" to get a supporting command list."]);
        }
    },
    async LoadingEffect() {
        await this.addBlock(1,["Loading"]);
        await new Promise(resolve => setTimeout(resolve, 500));
        const LoadingElement = document.getElementById("Loading");
        await LoadingElement.parentElement.remove();
    },
    async Intro() {
        await this.LoadingEffect();
        this.addBlock(1, ["cmd", `Welcome to ${ this.ine.en.name }!`]);
        await this.LoadingEffect();
        this.addBlock(2, ["System"], ["cmd", `cd ${ this.ine.en.name }`]);
        await this.LoadingEffect();
        this.addBlock(2, ["System"], ["cmd", "Thanks for your visit, let me introduce myself."]);
        await this.LoadingEffect();
        this.addBlock(3, ["Date"], ["Info","Name:"], ["cmd", `${ this.ine.en.name }`]);
        await this.LoadingEffect();
        this.addBlock(3, ["Date"], ["Info","Sex:"], ["cmd", "Male"]);
        await this.LoadingEffect();
        this.addBlock(3, ["Date"], ["Info","Age:"], ["cmd", (new Date().getFullYear() - 2003).toString()]);
        await this.LoadingEffect();
        this.addBlock(3, ["Date"], ["Info","Email:"], ["Email", this.ine.link.mail]);
        this.addBlock(2, ["Succ"], ["cmd", "Myself introduction is over!"]);

        // 解决焦点丢失的bug
        setTimeout(() => { this.inputFous(); }, 0);
    },
    Help() {
        this.addBlock(1, ["cmd", "Here is a list of supporting command."]);
        
        this.addBlock(2, ["Succ", "contact"], ["cmd", "() => Return a list of my contact information."]);
        this.addBlock(2, ["Succ", "intro"], ["cmd", "() => Introducting myself again."]);
        this.addBlock(2, ["Succ", "echo"], ["cmd", "() => Echoes input."]);
        this.addBlock(2, ["Succ", "open"], ["cmd", "() => Open a specified url in a new tab."]);

        this.addBlock(2, ["Succ", "cartoon"], ["cmd", "() =>Open my favorite cartoon in a new tab."]);
        this.addBlock(2, ["Succ", "music"], ["cmd", "() => Open my favorite music in a new tab."]);
        this.addBlock(2, ["Succ", "gallery"], ["cmd", "() => Open my gallery in a new tab."]);
        this.addBlock(2, ["Succ", "film"], ["cmd", "() => Open my favorite film in a new tab."]);

        this.addBlock(2, ["System"], ["cmd", "Type \"history\" to show a list of history commands."]);
        this.addBlock(2, ["System"], ["cmd", "Type \"clear\" to clear the terminal screen."]);
        this.addBlock(2, ["System"], ["cmd", "Type \"exit\" to return to the main page."]);
    },
    async onLoad () {
        await this.firstShow();
        this.doms.terminalInput.style.display = "block";
        // 初始状态就闪烁
        this.inputCmd = this.spanInputBlock;
        this.inputFous();
        this.doms.inputBox.setSelectionRange(0, 0);
    },
    async firstShow() {
        await this.Intro();
        this.addBlock(2, ["System"], ["cmd", "Type \"help\" to get a supporting command list."]);
        this.addBlock(2, ["System"], ["cmd", "Type \"clear\" to clear the terminal screen."]);
        this.addBlock(2, ["System"], ["cmd", "Type \"exit\" to return to the main page."]);
    },
    updateInputCmd() {
        this.inputCmd = this.doms.inputBox.value.substring(0, this.PointerCurrentPosition) + this.spanInputBlock + this.doms.inputBox.value.substring(this.PointerCurrentPosition);
    },

    LisInputInput(event) {
        this.PointerCurrentPosition = this.doms.inputBox.selectionStart;
        this.updateInputCmd();
    },
    async LisInputKeydown(event) {
        if (event.code === "ArrowLeft") {
            if (this.PointerCurrentPosition > 0) {
                this.PointerCurrentPosition -= 1;
                this.updateInputCmd();
            }
        } else if (event.code === "ArrowRight") {
            if (this.PointerCurrentPosition < this.doms.inputBox.value.length) {
                this.PointerCurrentPosition += 1;
                this.updateInputCmd();
            }
        } else if (event.code === "ArrowUp") {
            event.preventDefault();
            if (this.historyCommandCurrent !== 0) {
                this.historyCommandCurrent = (this.historyCommandCurrent > 0) ? (this.historyCommandCurrent - 1) : 0;
                this.doms.inputBox.value = this.historyCommand[this.historyCommandCurrent];
                this.inputCmd = this.doms.inputBox.value + this.spanInputBlock;
            }
        } else if (event.code === "ArrowDown") {
            event.preventDefault();
            this.historyCommandCurrent = (this.historyCommandCurrent < this.historyCommandCounter) ? this.historyCommandCurrent + 1 : this.historyCommandCounter;
            this.doms.inputBox.value = (this.historyCommandCurrent === this.historyCommandCounter) ? "" : this.historyCommand[this.historyCommandCurrent];
            this.inputCmd = this.doms.inputBox.value + this.spanInputBlock;
        } else if (event.code === "Enter") {
            event.preventDefault(); // 阻止默认的回车换行行为
            // 没有输入汉字的时候处理send
            if (!this.isComposing) {
                this.addHistoryCommand(this.doms.inputBox.value);
                await this.addOutput(this.doms.inputBox.value);
                this.doms.inputBox.value = null;
                this.inputCmd = this.spanInputBlock;
            }
        } else if (event.code === 'Tab') {
            event.preventDefault();
            let input = this.doms.inputBox.value.trim();
            let filtered = this.Command.filter(command => command.startsWith(input));
            let length = filtered.length;
            if (length === 1) {
                this.doms.inputBox.value = filtered[0];
                this.inputCmd = this.doms.inputBox.value + this.spanInputBlock;
            } else if (length > 1) {
                this.addBlock(1, ["cmd", "➜ ~ " + this.doms.inputBox.value]);
                this.addBlock(1, ["Tab", filtered.join('&emsp;')])
            }
        }


        // 处理选中结束之后的左右箭头事件，当前指针位置分别对应选中文本的左右位置
        const selectedText = window.getSelection().toString();
        if (selectedText.length > 0) {
            if (event.key === "ArrowLeft") {
                this.PointerCurrentPosition = this.doms.inputBox.selectionStart;
                this.updateInputCmd();
            } else if (event.key === "ArrowRight") {
                this.PointerCurrentPosition = this.doms.inputBox.selectionEnd;
                this.updateInputCmd();
            }
        }
    },
    // LisInputSelect(event) {
    //     const start = this.doms.inputBox.selectionStart;
    //     const end = this.doms.inputBox.selectionEnd;

    //     let selected = document.createElement("span");
    //     selected.className = "input-cmd-selected";
    //     selected.innerText = this.doms.inputBox.value.substring(start, end);

    //     if (start !== end) {
    //         this.inputCmd = this.doms.inputBox.value.substring(0, start) + selected.outerHTML + this.doms.inputBox.value.substring(end);
    //         console.log("11111");
    //     } 
    //     else {
    //         console.log("没有选中文本");
    //     }
    // },
    // 添加历史记录
    addHistoryCommand(value) {
        if(value === "" || value === null)
            return;
        this.historyCommand[this.historyCommandCounter] = value;
        this.historyCommandCounter++;
        this.historyCommandCurrent = this.historyCommandCounter;
    },
    printHistoryCommand(obj) {
        let result = ""; // 初始化一个空字符串来保存格式化后的键值对
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) { // 确保属性是对象自身的属性，而不是继承的属性
                // 将键值用 <span class="history-key"> 包裹，这样可以给键部分添加绿色样式
                let paddedKey = `<span class="history-key">${key.padEnd(this.maxHistoryKeyLength)}</span>`; // 对其键的长度，统一为<9999
                result += `&emsp;&emsp;${paddedKey}&nbsp;&nbsp;${obj[key]}<br />`; // 将键和值拼接为一个字符串，并添加换行符
            }
        }
        return result; // 返回格式化后的键值对字符串
    },

    inputFous() {
        this.doms.inputBox.focus();
    }
  }
}
</script>
<style>
body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(-90deg, #9c9a9a 10%, #4b4747 90%);
}

.left, .right {
    flex: 1;
    display: block; /* 默认在电脑上显示左右两部分 */
}

.middle {
    text-align: center;
    flex: 3;
    height: 90vh;
    padding: 0;
}

@media (max-width: 768px) {
    .middle {
        margin: 1rem;
    }
}

.circle-list {
    list-style: none;
    margin: 0;
    text-align: left;
    grid-area: 1 / 1 / 2 / 2;
    padding: 0 0 0 1rem;
}

.circle-list li {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    display: inline-block;
}

.red-circle {
    background-color: #C83030;
}

.yellow-circle {
    background-color: #F7DB60;
}

.green-circle {
    background-color: #2EC971;
}

.terminal {
    height: 100%;
    box-shadow: rgb(34, 34, 34) -2px 7px 20px 3px;
}

.terminal h4 {
    margin: 0;
    color: #eeeeee;
    grid-area: 1 / 1 / 2 / 3;
    font-family: 'Fira Code', monospace;
    font-weight: normal;
}

.terminal-top {
    height: 2rem;
    background-color: #252525;
    align-items: center; /* 垂直居中 */
    width: 100%; /* 容器宽度占满父元素 */
    border-radius: 0.2rem 0.2rem 0 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
}


.terminal-mid {
    height: calc(100% - 2rem);
    background-color: #313131;
    text-align: left;
    padding-left: 1rem;
    padding-top: 1.1rem;
    overflow-y: auto;
}

.terminal-mid::-webkit-scrollbar {
    background-color: transparent;
    width: 0.2rem;
}
.terminal-mid::-webkit-scrollbar-thumb {
    background-color: #999999; /* 滑块颜色 */
}

.terminal-block, .terminal-input, .hidden-element {
    margin: 0;
    padding-bottom: 1.1rem;
    font-family: 'Fira Code', monospace;
    font-size: 1rem;
    font-weight: normal;
    color: #eeeeee;
    text-shadow: rgb(160, 156, 155) 0px 0px 1px, rgb(255, 255, 251) 0px 0px 1px;
}

.terminal-input {
    /*换行显示*/
    word-break: break-all;
    display: none;
}

.input-prompt {
    color: #9BF786;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}

.input-block {
    background-color: #eeeeee;
    animation: blink 1s infinite steps(1);
    width: 0.1rem;
    height: auto;
    position: relative;
    display: inline-block;

}

.input-cmd {
    white-space: pre-wrap; /*保留连续的空格并且允许换行*/
}

.input-cmd-selected {
    background-color: #eeeeee;
    color: #313131;
}

#inputBox {
    /*保留宽度，要不然会出现中文输入异常的情况*/
    height: 0;
    border: none;
    outline: none;
    background: none;
    color: transparent;
    padding: 0;
    margin: 0;
    white-space: pre-wrap; /* 保持换行 */
    word-wrap: break-word; /* 防止长单词溢出 */
}



.cmd {
    padding-right: 0.5rem;
    margin-right: 1rem;

    /* 解决撑大容器的bug */
    max-width: 100%;  /* 确保它不超过父元素的宽度 */
    overflow-wrap: break-word; /* 使长单词在宽度不足时换行 */
    word-wrap: break-word; /* 防止单词溢出 */
    white-space: pre-wrap; /* 保证输入内容能够换行 */
    word-break: break-word; /* 防止长单词单行显示 */
}


.System, .Date, .Fail, .Succ, .Info {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    margin-right: 0.5rem;
}

.System {
    background-color: #999999;
}

.Date {
    background-color: #666262;
}

.Fail {
    background-color: #C0392B;
}

.Succ {
    background-color: #27AE60;
}

.Info {
    background-color: #2980B9;
}

.Tab {
    position: relative;
    left: 1rem;
}

/* 取消 <a> 标签的默认样式 */
    a {
    text-decoration: none;  /* 去掉下划线 */
    color: inherit;  /* 继承父元素的字体颜色 */
    outline: none;  /* 去掉聚焦时的轮廓 */
}
@keyframes blink {
    0%, 100% { opacity: 1; visibility: visible; } /* 正常显示 */
    50% { opacity: 0; visibility: hidden; } /* 中间时隐藏 */
}
.Links {
    color: #3498db;
    font-style: italic;
    text-decoration: none;
    display: inline-block;
    animation: blink 1.2s infinite; /* 每1秒闪烁一次，持续3秒 */
    animation-iteration-count: 3; /* 动画重复3次 */
    animation-timing-function: ease-in-out; /* 动画的过渡效果 */
}
.Links:hover {
    animation: none; /* 鼠标悬停时不闪烁 */
}

.history-key {
    color: green;
}

#Loading {
    color: #eeeeee;
    font-size: 0.7rem; /* 调整方块的大小 */
    position: relative;
}

#Loading::after {
    content: "■";
    letter-spacing: 0.2rem; /* 调整方块之间的间隙 */
    animation: loadingAnimation 0.4s infinite;
}

@keyframes loadingAnimation {
    0%, 33.33% {
        content: "■";
    }
    33.33%, 66.66% {
        content: "■■";
    }
    66.66%, 100% {
        content: "■■■";
    }
}

.github-corner:hover .Octocat-arm {
    -webkit-animation: octocat-wave .56s ease-in-out;
    animation: octocat-wave .56s ease-in-out;
}

@keyframes octocat-wave {
    0%, 100% {
        transform: rotate(0);
    }
    20%, 60% {
        transform: rotate(-25deg);
    }
    40%, 80% {
        transform: rotate(10deg);
    }
}
</style>