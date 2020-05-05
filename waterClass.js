console.log(1+"myscript");
var patt = /[0-9]+/;
var grandf = document.getElementsByClassName("m-learnunitUI.f-pr.learn-plan-container");
//var f = grandf.children[0].className;
//var exis = f.match(patt);

setInterval(function(){//每3秒执行一次
    var patt = /[0-9]+/;
    var grandf = document.getElementsByClassName("m-learnunitUI f-pr learn-plan-container"); 
    console.log(grandf)
    console.log(grandf.innerHTML)
    var f = grandf.children[0].className;
    var exis = f.match(patt);
    console.log(exis)

    if(exis) {
        //用于检测答题弹窗是否出现，并将其关闭
            document.getElementsByClassName('u_tbi').click();//只选A，弹窗题目不影响成绩，就不纠结选的对不对了
            document.getElementsByClassName('j_submit').click();//点击提交
            document.getElementsByClassName('j_continue').click();//点击继续学习
            document.getElementsByClassName('playButton')[0].click()//点击播放继续
        }
    },3000)
