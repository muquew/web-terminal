const inputCmd = document.getElementById('inputCmd');
const inputBox = document.getElementById("inputBox");
const spanInputBlock = '<span class="input-block">&nbsp;</span>';
var PointerCurrentPosition = 0;       // 光标位置
const terminalShow = document.getElementById("terminalShow");
const terminalMid = document.getElementById("terminalMid");
const terminalInput = document.getElementById("terminalInput");
const terminalName = document.getElementById("terminalName");

const urlRegex = new RegExp("((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?");
// ①：该正则表达式匹配的字符串必须以http://、https://、ftp://开头；
// ②：该正则表达式能匹配URL或者IP地址；（如：http://www.baidu.com 或者 http://192.168.1.1）
// ③：该正则表达式能匹配到URL的末尾，即能匹配到子URL；（如能匹配：http://www.baidu.com/s?wd=a&rsv_spt=1&issp=1&rsv_bp=0&ie=utf-8&tn=baiduhome_pg&inputT=1236）
// ④：该正则表达式能够匹配端口号；

const Command = ['cd', 'pwd', 'ls', 'echo',
    'open', 'intro', 'contact', 'cartoon', 'music', 'gallery', 'film',
    'open', 'intro', 'contact', 'cartoon', 'music', 'gallery', 'film',
    'help', 'history', 'cls', 'clear', 'exit']
const historyCommand = {};              // 不要超过9999，四位数
const maxHistoryKeyLength = 4;     // 键的最长，四位数
let historyCommandCounter = 0;
let historyCommandCurrent = 0;