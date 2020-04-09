var num = 0; //显示的那个时间
var times = 0; //记第几个被点中的元素
var scores = 0; //记录成功消掉而得到的分数
var eles = [];
var el = []; //存储被点击的两个元素
var id = [];
var t //settimeout事件参数

var begin = document.getElementById("begin");
begin.addEventListener("click", counting);
begin.addEventListener("click",create);
begin.addEventListener("click", timeUp)

var stop = document.getElementById("pause");
stop.addEventListener("click", pause);

var goon = document.getElementById("goOn");
goon.addEventListener("click", goOn);

var again = document.getElementById("again");
again.addEventListener("click", create);
again.addEventListener("click", function() {
    clearTimeout(t);
    num = 0;
    document.getElementById("time").value = num;
});

//开始的布局
function create() {
    //原有布局消失
    var container = document.getElementById("container");
    if (container.hasChildNodes()) {
        container.innerText = "";
    }
    //规则消失
    document.getElementById("rules").style.display = "none";
    //创建动物们
    var number = 1; //计算它是第几个元素
    for (var i = 0; i < 5; i++) {
        eles[i] = []; //一维变二维 
        for (var j = 0; j < 5; j++) {
            var spanEles = document.createElement("img");
            var randomNumber = Math.floor(Math.random() * 4);        
            switch (randomNumber) {
                case 0:
                    spanEles.setAttribute("src", "dog.jpg");
                    break;
                case 1:
                    spanEles.setAttribute("src", "cat.jpg");
                    break;
                case 2:
                    spanEles.setAttribute("src", "fish.jpg");
                    break;
                case 3:
                    spanEles.setAttribute("src", "cow.jpg");
            }
            spanEles.setAttribute("id", number);
            number++;
            eles[i][j] = spanEles;
            document.getElementById("container").appendChild(spanEles);
        }
    }
    deleteElements();
    scores = 0;
    document.getElementById("scores").value = scores;
    document.getElementById("message").style.display = "none";
}

//创建三个不相同的随机字母
function randomImage() {
    var randomNumber = []; //随机数字记录为数组
    var randomSrc = []; //随机数字对应的src记录为数组
    randomNumber[0] = Math.floor(Math.random() * 4);
    randomSrc[0] = randomSrcNum(randomNumber[0]);
    randomNumber[1] = Math.floor(Math.random() * 4);
    while (randomNumber[0] === randomNumber[1]) {
        randomNumber[1] = Math.floor(Math.random() * 4);
    }
    randomSrc[1] = randomSrcNum(randomNumber[1]);
    randomNumber[2] = Math.floor(Math.random() * 4);
    while (randomNumber[0] === randomNumber[2] || randomNumber[1] === randomNumber[2]) {
        randomNumber[2] = Math.floor(Math.random() * 4);
    }
    randomSrc[2] = randomSrcNum(randomNumber[2]);
    console.log("随机出的字母: " + randomSrc)
    return randomSrc;
}

//根据数字返回字母
function randomSrcNum(num) {
    switch (num) {
        case 0:
            return "dog.jpg";
            break;
        case 1:
            return "cat.jpg";
            break;
        case 2:
            return "fish.jpg";
            break;
        case 3:
            return "cow.jpg";
    }
}

//选中元素
function get(event) {
    times = times%2
    el[times] = event.target;
    id[times] = event.target.id;
    if (times) {
        change(); //第二遍点击的时候就自动判断并交换元素
    }
    times++;
}

//交换，并且自动执行删除相同元素 
function change() {
    var x = Number(id[0]);
    var y = Number(id[1]);
    var value1 = el[0].getAttribute('src');
    var value2 = el[1].getAttribute('src');
    if (x == y + 1 || x == y - 1 || x == y + 5 || x == y - 5) {
        setTimeout(function () {   //企图出现渐变效果？（想用原生js做到）
            el[0].setAttribute('src', value2);
            el[1].setAttribute('src', value1);
        }, 500)
        setTimeout(deleteElements, 1000);
    } //交换内容
}

//遍历   删除元素并填补新的
function deleteElements() {
    //水平方向检查
    var isDeleteable = 0;
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 3; j++) {
            var eles1 = eles[i][j].getAttribute('src');
            var eles2 = eles[i][j + 1].getAttribute('src');
            var eles3 = eles[i][j + 2].getAttribute('src');
            if (eles1 == eles2 && eles1 == eles3) {
                console.log("deleteH eles" + i + j + eles1)
                deleteHorizontal(i, j);
                checkHorizontal(i, j);
                scores += 2;
                document.getElementById("scores").value = scores;
                isDeleteable = 1;
            }
        }
    }
    //竖直方向检查
    for (var j = 0; j < 5; j++) {
        for (var i = 0; i < 3; i++) {
            var eles1 = eles[i][j].getAttribute('src');
            var eles2 = eles[i + 1][j].getAttribute('src');
            var eles3 = eles[i + 2][j].getAttribute('src');
            if (eles1 == eles2 && eles1 == eles3) {
                console.log("deleteV eles" + i + j + eles1)
                deleteVertical(i, j);
                checkVertical(i, j);
                scores += 2;
                document.getElementById("scores").value = scores;
                isDeleteable = 1;
            }
        }
    }
    if (isDeleteable == 0) {
        var value2 = el[0].getAttribute('src');
        var value1 = el[1].getAttribute('src');
        el[1].setAttribute('src', value2);
        el[0].setAttribute('src', value1);
    } //换回来
    success();
}

function deleteHorizontal(i, j) {
    console.log("horizontal")
    console.log(i, j)
    var Arr = randomImage();
    eles[i][j].setAttribute('src', Arr[0]);
    eles[i][j + 1].setAttribute('src', Arr[1]);
    eles[i][j + 2].setAttribute('src', Arr[2]);
    console.log("new array = " + Arr)
}

function deleteVertical(i, j) {
    console.log("vertical")
    console.log(i, j)
        //console.log("原来的字母" + eles[i][j].innerText)
        //eles[i][j].style.color = "red";
    var Arr = randomImage();
    eles[i][j].setAttribute('src', Arr[0]);
    eles[i + 1][j].setAttribute('src', Arr[1]);
    eles[i + 2][j].setAttribute('src', Arr[2]);
    console.log("new array = " + Arr)
}

//下个函数会用。。。
function checkVerticalSingle(i, j) {
    console.log("checkVerS")
    var eles1 = eles[i][j].getAttribute('src');
    if (i >= 0 && i <= 2) {
        var eles2 = eles[i + 1][j].getAttribute('src');
        var eles3 = eles[i + 2][j].getAttribute('src');
        if (eles1 == eles2 && eles1 == eles3) { //下连
            deleteVertical(i, j);
            console.log("checkverticalsingle" + i, j)
            checkVertical(i, j);
        }
    }
    if (i >= 1 && i <= 3) {
        var eles2 = eles[i + 1][j].getAttribute('src');
        var eles4 = eles[i - 1][j].getAttribute('src');
        if (eles4 == eles1 && eles2 == eles1) { //中连
            deleteVertical(i - 1, j);
            console.log("checkverticalsingle" + (i - 1), j)
            checkVertical(i - 1, j);
        }
    }
    if (i >= 2 && i <= 4) {
        var eles4 = eles[i - 1][j].getAttribute('src');
        var eles5 = eles[i - 2][j].getAttribute('src');
        if (eles1 == eles4 && eles1 == eles5) { //上连
            deleteVertical(i - 2, j);
            console.log("checkverticalsingle" + (i - 2), j)
            deleteVertical(i - 2, j);
        }
    }
}
//检测单个元素周围是否出现三连(横着删除之后)
function checkHorizontal(i, j) { //ps：j的范围只有1到3
    console.log("checkHo")
        //竖向有没有连
    checkVerticalSingle(i, j);
    checkVerticalSingle(i, j + 1);
    checkVerticalSingle(i, j + 2);
    //横向有没有连
    if (j == 0) {
        var eles4 = eles[i][j + 2].getAttribute('src');
        var eles5 = eles[i][j + 3].getAttribute('src');
        var eles6 = eles[i][j + 4].getAttribute('src');
        if (eles4 == eles5 && eles4 == eles6) { //左连
            deleteHorizontal(i, j + 2);
            console.log("横向删除完横向" + i, (j + 2));
            checkHorizontal(i, j + 2);
        }
    }
    if (j == 2) {
        var eles1 = eles[i][j].getAttribute('src');
        var eles2 = eles[i][j - 1].getAttribute('src');
        var eles3 = eles[i][j - 2].getAttribute('src');
        if (eles1 == eles2 && eles1 == eles3) { //右连
            deleteHorizontal(i, j);
            console.log("横向删除完横向" + i, j);
            checkHorizontal(i, j);
        }
    }
}
//纵向删除会用到
function checkHorizontalSingle(i, j) {
    console.log("checkHoS")
    var eles1 = eles[i][j].getAttribute('src');
    if (j >= 0 && j <= 2) {
        var eles2 = eles[i][j + 1].getAttribute('src');
        var eles3 = eles[i][j + 2].getAttribute('src');
        if (eles1 == eles2 && eles1 == eles3) { //右连
            deleteHorizontal(i, j);
            console.log("checkhorizontalsingle" + i, j)
            checkHorizontal(i, j);
        }
    }
    if (j >= 1 && j <= 3) {
        var eles2 = eles[i][j + 1].getAttribute('src');
        var eles4 = eles[i][j - 1].getAttribute('src');
        if (eles4 == eles1 && eles2 == eles1) { //中连
            deleteHorizontal(i, j - 1);
            console.log("checkhorizontalsingle" + i, (j - 1))
            checkHorizontal(i, j - 1);
        }
    }
    if (j >= 2 && j <= 4) {
        var eles4 = eles[i][j - 1].getAttribute('src');
        var eles5 = eles[i][j - 2].getAttribute('src');
        if (eles1 == eles4 && eles1 == eles5) { //左连
            deleteHorizontal(i, j - 2);
            console.log("checkhorizontalsingle" + i, (j - 2))
            checkHorizontal(i, j - 2);
        }
    }
}
//纵向删除后
function checkVertical(i, j) {
    console.log("checkVer")
        //横向有没有连
    checkHorizontalSingle(i, j);
    checkHorizontalSingle((i + 1), j);
    checkHorizontalSingle((i + 2), j);
    //纵向有没有连
    if (i == 0) {
        var eles4 = eles[i + 2][j].getAttribute('src');
        var eles5 = eles[i + 3][j].getAttribute('src');
        var eles6 = eles[i + 4][j].getAttribute('src');
        if (eles4 == eles5 && eles4 == eles6) { //下连
            deleteVertical(i + 2, j);
            console.log("纵向删除完纵向" + (i + 2), j)
            checkVertical(i + 2, j);
        }
    }
    if (i == 2) {
        var eles1 = eles[i][j].getAttribute('src');
        var eles2 = eles[i - 1][j].getAttribute('src');
        var eles3 = eles[i - 2][j].getAttribute('src');
        if (eles1 == eles2 && eles1 == eles3) { //上连
            deleteVertical(i - 2, j);
            console.log("纵向删除完纵向" + (i - 2), j)
            checkVertical(i - 2, j);
        }
    }
}
//提示游戏成功
function success() {
    if (scores >= 30 && num <= 120) {
        let message = document.getElementById("message");
        clearTimeout(t);
        message.style.display = "block";   
        message.innerText("你赢辽（不过游戏确实简单是吧是吧")
    }
}

//时间到了
function timeUp() {
    if (num >= 120) {
        let message = document.getElementById("message");
        message.innerText = "时间到了吼吼吼~";
        message.style.display = "block";
        clearTimeout(t);
        scores = 0;
        document.getElementById("scores").value = scores;
    }   
}

//显示时间
function counting() {
    document.getElementById("time").value = num;
    num++;
    t = setTimeout(counting, 1000);
}

//暂停
function pause() {
    clearTimeout(t);
    document.getElementById("container").style.visibility = "hidden";
}

//继续
function goOn() {
    setTimeout(counting, 1000);
    document.getElementById("container").style.visibility = "visible";
}