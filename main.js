const GAME_FPS = 1000/60;  //FPS
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;


let vcan = document.createElement("canvas");
let vcon = vcan. getContext("2d");

let can = document.getElementById("can");
let con = can.getContext("2d");

vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

can.width = SCREEN_SIZE_W*2;
can.height = SCREEN_SIZE_H*2;

con.mozimageSmoothingEnabled    = false;
con.msimageSmoothingEnabled     = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled       = false;

//フレームレート維持
let frameCount =0;
let startTime;

let chImg = new Image ();
chImg.src = "sprite.png";
//chImg.onload = draw;

//おじさん情報
//座標
let oji_x  =100<<4; 　　　　　　　　　　　　　　　　 //2進数で４つずらす＝１６かける
let oji_y  =100<<4;
let oji_vx =0;
let oji_anime  = 0;　　　　　　　　　　　　　　　　　//今何をやっているか
let oji_sprite =48;　　　　　　　　　　　　　　　　　//絵柄
let oji_acount = 0;  　　　　　　　　　　　　　　　　//歩くとき　アニメ用
let oji_dir    = 0;　　　　　　　　　　　　　　　　　//向き


//更新処理
function update ()
{
    if( keyb.Left ) {
        if(oji_anime==0)oji_acount=0;               //止まってるときリセット(走り出しはキュキュッとしないしない)
        oji_anime=1;
        oji_dir=1;
        if(oji_vx>-32) oji_vx-=1;
        if(oji_vx>0) oji_vx-=1;
        if(oji_vx>-8)oji_anime=2; 　　　　　　　　　　//キュキュっと
    }else if( keyb.Right ) {
        if(oji_anime==0)oji_acount=0; 　　　　　　　　//止まってるときリセット
        oji_anime=1;
        oji_dir=0;
        if(oji_vx<32 ) oji_vx+=1;
        if(oji_vx<0 ) oji_vx+=1;
        if(oji_vx<8)oji_anime=2;　　　　　　　　　　　//キュキュっと
    }else {
        if(oji_vx>0)oji_vx-=1;
        if(oji_vx<0)oji_vx+=1;
        if(!oji_vx) oji_anime=0;
    }
    oji_acount++;
    if(Math.abs(oji_vx)==32)oji_acount++;     　　　　//最高速度でアニメ倍速

    if( oji_anime == 0) oji_sprite =0;
    else if( oji_anime == 1) oji_sprite =2+((oji_acount/6)%3);  //2,3,4の絵柄を繰り返したい
    else if( oji_anime == 2) oji_sprite =5; 　　　　　//キュキュっと

    if( oji_dir)oji_sprite +=48;　　　　　　　　　　　　//方向転換
    
    console. log(oji_vx);
    oji_x += oji_vx;

}

//スプライトの描画
function drawSprite(snum,x,y)
{
    let sx =(snum&15)*16;
    let sy =(snum>>4)*16
    vcon.drawImage(chImg,sx,sy,16,32,x,y,16,32);
}

//描画処理
function draw()
{
    //画面を水色でクリア
    vcon.fillStyle="#66AAFF";
    vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
    
    //おじさんを表示
    drawSprite( oji_sprite, oji_x>>4, oji_y>>4);

    //デバッグ情報を表示
    vcon.font="24px 'Impact'";
    vcon.fillStyle="white";
    vcon.fillText("FRAME:"+frameCount,10,20);

    //仮想画面から実画面へ拡大転送
    con.drawImage(vcan,0,0,SCREEN_SIZE_W,SCREEN_SIZE_H
        ,0,0,SCREEN_SIZE_W*2,SCREEN_SIZE_H*2);
}


//setInterval (mainLoop, 1000/60);

//ループ開始
window.onload = function()
{
    startTime = performance.now();
    mainLoop();
}

//メインループ  
function mainLoop()
{
    let nowTime = performance.now();
    let nowFrame = (nowTime-startTime)/GAME_FPS;

    if(nowFrame>frameCount)
    {
        let c=0;
        while(nowFrame>frameCount)
        {
            frameCount++;
            //更新処理
            update();
            if( ++c>=4)break
        }
        //描画処理
        draw();
    }
    requestAnimationFrame(mainLoop);    
}

//キーボード
let keyb={};

//キーボードがが押されたときに呼ばれる
document.onkeydown = function(e)
{
    if(e.keyCode == 37)keyb.Left = true;
    if(e.keyCode == 39)keyb.Right = true;
}

//キーボードが離されたときに呼ばれる
document.onkeyup = function(e)
{
    if(e.keyCode == 37)keyb.Left = false;
    if(e.keyCode == 39)keyb.Right = false;
}
