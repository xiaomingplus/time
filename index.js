const alfy = require('alfy');

let input = alfy.input; //这个是输入
input = input.trim();
let originInput = input;
let description = originInput; //描述的初始值是输入的内容
let errors = []; //错误数组
try {
    if (input && input != "") {
        //是否是合法的数字
        if (input * 1 >= 0) {
            //是数字
            //看下位数，是否是毫秒
            if (input > 2145916800) {
                //如果是毫秒
                input = new Date(input * 1);
            } else {
                //如果是秒
                input = new Date(input * 1000)
            }
        } else {
            //是字符串
            if (input === 'now') {
                //特殊处理
                input = new Date();
                description = "现在时间"
            } else {
                //尝试直接用new Date
                input = new Date(input);
            }

        }
    } else {
        description = "现在时间"
        input = new Date();
    }
} catch (e) {
    errors.push({
        title: "输入不符合规范"
    })
}
if (!(input instanceof Date && isFinite(input))) {
    errors.push({
        title: "输入不符合规范"
    })
}

let time = {
    standard: input.toString(),
    source: originInput,
    timestamp: String(Math.floor(input / 1000)),
    format: format(input, 'YYYY年mm月dd日 HH:ii:ss')
};

let outputItems = [];

if (errors.length > 0) {
    //说明有错误
    outputItems = errors;
} else {
    outputItems = [{
            title: time.timestamp,
            subtitle: description + "的时间戳",

        }, {
            title: time.format,
            subtitle: "正常格式",

        },
        {
            title: time.standard,
            subtitle: "标准格式",

        }
    ]
}
outputItems = outputItems.map(item => {
    if (!item.arg) {
        item.arg = item.title;
    }
    return item;
})

alfy.output(outputItems);


function format(time, formatStr) {
    const date = new Date(Number(time));
    //格式化时间
    const arrWeek = ['日', '一', '二', '三', '四', '五', '六'];
    let str = formatStr
        .replace(/yyyy|YYYY/, date.getFullYear())
        .replace(/yy|YY/, addZero(date.getFullYear() % 100, 2))
        .replace(/mm|MM/, addZero(date.getMonth() + 1))
        .replace(/m|M/g, date.getMonth() + 1)
        .replace(/dd|DD/, addZero(date.getDate()))
        .replace(/d|D/g, date.getDate())
        .replace(/hh|HH/, addZero(date.getHours()))
        .replace(/h|H/g, date.getHours())
        .replace(/ii|II/, addZero(date.getMinutes()))
        .replace(/i|I/g, date.getMinutes())
        .replace(/ss|SS/, addZero(date.getSeconds()))
        .replace(/s|S/g, date.getSeconds())
        .replace(/w/g, date.getDay())
        .replace(/W/g, arrWeek[date.getDay()]);
    return str;
}

function addZero(time) {
    time = String(time);
    return (`0${time}`).substr(-2);
}