//点击开始->动态生成100个div小格
//leftClick 没有雷，显示数字。 扩散（周围八个格没有雷）
//rightClick 没有标记，进行标记。  有标记取消 -->判断标记是否正确，雷数--

var startBtn = document.getElementsByClassName('btn')[0];
var box = document.getElementsByClassName('box')[0];
var flagBox = document.getElementsByClassName('flagBox')[0];
var alertBox = document.getElementsByClassName('alertBox')[0];
var alertImg = document.getElementsByClassName('alertImg')[0];
var close = document.getElementsByClassName('close')[0];
var score = document.getElementById('score');
var numLei;
var overLei;
var block;
var leiMap = [];
var startGame = true;
bindEvent();
function bindEvent() {
    startBtn.onclick = function() {
        if(startGame){
            box.style.display = 'block';
            flagBox.style.display = 'block';
            init();
            startGame = false;
        }
    }
    box.oncontextmenu = function (){
        return false;               //鼠标右键事件                取消
    }
    box.onmousedown = function (e) {        //时间委托 box下的每一个小格子
        var event = e.target;
        if(e.which == 1){       //左键
            leftClick(event);
        }else if(e.which == 3){     //右键
            rightClick(event);
        }
    }
    close.onclick = function () {
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';
        score.innerHTML = '10';
        startGame = true;
    }
}

function init() {
    numLei = 10;
    overLei = 10;
    for(var i = 0;i < 10; i++){
        for(var j = 0;j <10; j++){
            var con = document.createElement('div');
            con.classList.add('block');             //规定每个小格初始样式
            con.setAttribute('id', i+'-' + j);      //小格唯一标示
            box.appendChild(con);
            leiMap.push({mine:0});
        }
    }
    block = document.getElementsByClassName('block');
    while(numLei) {
        var indexLei = Math.floor(Math.random()*100);       //雷的位置
        if(leiMap[indexLei].mine === 0) {
            leiMap[indexLei].mine = 1
            block[indexLei].classList.add('isLei');
            numLei --;    //雷数减小
        }
    }
}

function leftClick(dom){
    if(dom.classList.contains('flag')){
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    if(dom && dom.classList.contains('isLei')) {        //点击到雷
        console.log('over');
        for(var i = 0; i < isLei.length; i++) {
            isLei[i].classList.add('show');
        }
        setTimeout(function(){
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url("img/over.jpg")';
        },500)
    }else {         //点击出数字
        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-');      //&&容错处理，存在执行后面代码
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];        //取的字符串 用+隐式类型转换
        dom && dom.classList.add('num');
        // i-1,j-1     i-1,j       i-1,j+1
        // i,j-1       i,j         i,j+1
        // i+1,j-1     i+1,j       i+1,+1   点击的小格的四周
        for(var i = posX - 1; i <= posX + 1; i++){
            for(var j = posY -1; j <= posY +1; j++){
                var aroundBox = document.getElementById(i + '-' + j);   //小格id (1-3)
                if(aroundBox && aroundBox.classList.contains('isLei')){
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        if(n == 0){      //当周围没雷是n为0扩散
            for(var i = posX - 1; i <= posX + 1; i++){
                for(var j = posY -1; j <= posY +1; j++){
                    var nearBox = document.getElementById(i + '-' +j);
                    if(nearBox && nearBox.length != 0) {
                        if(!nearBox.classList.contains('check')){
                            nearBox.classList.add('check');
                            leftClick(nearBox);
                        }
                       
                    }        
                }
            }
        }
    }
}
function rightClick(dom){
    if(dom.classList.contains('num')){
        return;
    }
    dom.classList.toggle('flag');
    if(dom.classList.contains('isLei') && dom.classList.contains('flag')){
        overLei --;
    }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
        overLei ++;
    }  
    score.innerHTML = overLei;
    if(overLei == 0){
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("img/success.png")';
    }
}