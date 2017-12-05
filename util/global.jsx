//工作年限列表,工作年限类型：1-<=3, 2-3至5年，3-5至10年，4->=10年',
export const YEARS_LIST = [
    {value: 1, text: '<=3'},
    {value: 2, text: '3至5年'},
    {value: 3, text: '5至10年'},
    {value: 4, text: '>=10年'}
];

//病历状态
export const STATUS_LIST = [
    {value: 1, text: '待归档'},
    {value: 2, text: '已归档'},
    {value: 3, text: '作废'}
];

export const getStatusText = (val)=> {
    return (STATUS_LIST.find((item)=> {
        return item.value === val;
    }) || {}).text;
};


//问诊人与患者关系
export const RELATION_LIST = [
    {value: 0, text: '本人'},
    {value: 1, text: '父母'},
    {value: 2, text: '子女'},
    {value: 3, text: '配偶'},
    {value: 4, text: '兄妹'}
];

export const getRelationText = (val)=> {
    return (RELATION_LIST.find((item)=> {
        return item.value === val;
    }) || {}).text;
};

//显示呼入还是呼出,1为用户to医端 2为医端to用户 0通话进行中
export const INQUIRY_CALL_TYPE_LIST = [
    {value: 0, text: '医端to用户'},
    {value: 1, text: '用户to医端'}
];

export const getInquiryCallTypeText = (val)=> {
    return (INQUIRY_CALL_TYPE_LIST.find((item)=> {
        return item.value === val;
    }) || {}).text;
};

//通话类型,1:音频;；2:视频；3-电话预约'
export const CALL_TYPE_LIST = [
    {value: 1, text: '音频'},
    {value: 2, text: '视频'},
    {value: 3, text: '电话预约'}
];

export const getCallTypeText = (val)=> {
    return (CALL_TYPE_LIST.find((item)=> {
        return item.value === val;
    }) || {}).text;
};

//显示异常类型,挂机类型；-1:被叫没有振铃就收到了挂断消息；-2: 呼叫超时没有接通被挂断 ；
// -5: 被叫通道建立了被挂断 ；-8: 直拨被叫振铃了挂断 ' 大于0正常
export const BYE_TYPE_LIST = [
    {value: 0, text: '进行中'},
    {value: -1, text: '挂断'},
    {value: -2, text: '未呼通'},
    {value: -3, text: '挂断'},
    {value: -4, text: '拒接'},
    {value: -5, text: '拒接'},
    {value: -8, text: '未呼通'},
    {value: -9, text: '拒接'},
    {value: -10, text: '挂断'},
    {value: -12, text: '未呼通'},
    {value: -14, text: '挂断'}
];

export const getbyeTypeText = (val)=> {
    if (val > 0) {
        return '正常';
    } else {
        return (BYE_TYPE_LIST.find((item)=> {
            return item.value === val;
        }) || {}).text;
    }
};

//时分秒设置为零
export const formatDay = (date)=> {
    var date = new Date();
    date.setHours(0, 0, 0);
    return formatDate(date, "yyyy-MM-dd HH:mm:ss");
}

//日期格式化
export const formatDate = (date, formatStr)=> {
    var date = new Date(date);
    /*
     函数：填充0字符
     参数：value-需要填充的字符串, length-总长度
     返回：填充后的字符串
     */
    var zeroize = function (value, length) {
        if (!length) {
            length = 2;
        }
        value = new String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    };

    if (!formatStr) {
        formatStr = 'yyyy-MM-dd';
    }

    return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function ($0) {
        switch ($0) {
            case 'd':
                return date.getDate();
            case 'dd':
                return zeroize(date.getDate());
            case 'ddd':
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];
            case 'dddd':
                return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
            case 'M':
                return date.getMonth() + 1;
            case 'MM':
                return zeroize(date.getMonth() + 1);
            case 'MMM':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
            case 'MMMM':
                return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
            case 'yy':
                return new String(date.getFullYear()).substr(2);
            case 'yyyy':
                return date.getFullYear();
            case 'h':
                return date.getHours() % 12 || 12;
            case 'hh':
                return zeroize(date.getHours() % 12 || 12);
            case 'H':
                return date.getHours();
            case 'HH':
                return zeroize(date.getHours());
            case 'm':
                return date.getMinutes();
            case 'mm':
                return zeroize(date.getMinutes());
            case 's':
                return date.getSeconds();
            case 'ss':
                return zeroize(date.getSeconds());
            case 'l':
                return date.getMilliseconds();
            case 'll':
                return zeroize(date.getMilliseconds());
            case 'tt':
                return date.getHours() < 12 ? 'am' : 'pm';
            case 'TT':
                return date.getHours() < 12 ? 'AM' : 'PM';
        }
    });
};

//年月日格式化
export const formatYear = (date)=> {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    let day = date.getDate();
    day = day > 9 ? day : "0" + day;

    date = year + '' + month + '' + day;
    return date;
};

export const formatTime = (time)=> {
    if (time) {
        let m = Math.floor(time / 60);
        let s = Math.floor(time % 60);
        let str = '';
        let h = Math.floor(m / 60);

        if (h > 0) {
            m = m % 60;
            str = str + h + '小时';

        }
        if (m > 0) {
            str = str + m + '分';
            if (s <= 0) {
                str = str + '钟';
            }
        }

        if (s > 0) {
            str = str + s + '秒';
        }
        return str;

    } else if (time === 0) {
        return '0秒';
    } else {
        return '';
    }

};


export const defaultHead = require('assets/images/defaultHead.jpg');
export const defaultDocHead = require('assets/images/defaultDocHead.png');

export const loadingTip = ""; //eg: 正在读取数据...
export const noData = "暂无数据"; //eg: 暂无数据...


//根据生日计算年龄，待优化
function isValidDate(d) {
    return ( Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d.getTime()) );
}

export const getAge = (val, createTime)=> {
    let dayStr = '';

    if (val) {
        let d;
        if (createTime) {
            d = new Date(createTime);
        } else {
            d = new Date();
        }

        let curY = d.getFullYear();
        let curM = d.getMonth() + 1;
        let curD = d.getDate();
        d = new Date(curY, curM - 1, curD);

        let birthDay = new Date(val);

        if (!isValidDate(birthDay)) {
            return null;
        }

        let [y, m, day] = [birthDay.getFullYear(), birthDay.getMonth() + 1, birthDay.getDate()];

        birthDay = new Date(y, m - 1, day);
        let birthInThisYear = new Date(curY, m - 1, day + 1);

        let diff = curY - y;
        let diffDay = 0;

        if (birthInThisYear <= d) {
            if (diff > 2) {
                dayStr = diff + '岁';
            }
            else if (diff > 0) {
                dayStr = diff + '岁';
                diffDay = (d - birthInThisYear) / (24 * 60 * 60 * 1000);

                if (diffDay > 0) {
                    dayStr = dayStr + diffDay + '天';
                }
            } else {
                diffDay = (d - birthDay) / (24 * 60 * 60 * 1000) - 1;
                diffDay = diffDay < 0 ? 0 : diffDay;
                dayStr = diffDay + '天';
            }
        } else {
            if (diff > 3) {
                dayStr = (diff - 1) + '岁';
            }
            else if (diff > 1) {
                dayStr = (diff - 1) + '岁';
                diffDay = (d - new Date(curY - 1, m - 1, day)) / (24 * 60 * 60 * 1000) - 1;
                if (diffDay > 0) {
                    dayStr = dayStr + diffDay + '天';
                }
            }
            else {
                diffDay = (d - birthDay) / (24 * 60 * 60 * 1000) - 1;
                diffDay = diffDay < 0 ? 0 : diffDay;
                dayStr = diffDay + '天';
            }
        }
    }

    return dayStr;
};

//性别
export const GENDER_LIST = [
    {value: 0, text: '男', url: require('../assets/images/male.png')},
    {value: 1, text: '女', url: require('../assets/images/female.png')}
];

export const getGenderText = (val)=> {
    return (GENDER_LIST.find((item)=> {
        return item.value === val;
    }) || {}).text;
};

export const getGenderUrl = (val)=> {
    return (GENDER_LIST.find((item)=> {
        return item.value === val;
    }) || {}).url;
};
