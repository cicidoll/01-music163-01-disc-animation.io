//获取文档中 id="demo" 的元素：document.querySelector("#demo");
const $ = (str) => document.querySelector(str);//自定义了一个“$”的常量,使用了箭头函数，获取文档中的元素

//addEventListener() 方法用于向指定元素添加事件句柄。
//当点击class=song-disc的标签时，将包含以下三个类的标签，再添加class=play
$('.song-disc').addEventListener('click',() => {
    correctCoverRotate();
    $('.song-needle').classList.toggle('play');//classList.toggle为 xx 元素添加 class=play
    $('.song-img').classList.toggle('play');
    $('.play-btn').classList.toggle('play');
});

function correctCoverRotate(){
    const isPlaying = $('.play-btn').classList.contains('play');//classList.contains()返回布尔值，判断指定的类名是否存在
    const nextPlay = !isPlaying;
    //下一步静止的时候才纠正旋转

    //getComputedStyle() 方法用于获取指定元素的 CSS 样式。
    //getPropertyValue('xx')返回 xx 属性的值
    //transform 属性向元素应用 2D 或 3D 转换。该属性允许您对元素进行旋转、缩放、移动或倾斜。
    //matrix(n,n,n,n,n,n)	定义 2D 转换，使用六个值的矩阵。
    //transform 2D的转换是由一个3*3的矩阵表示的，前两行代表转换的值，分别是 a b c d e f 
    //[ [a,c,e],
    //  [b,d,f],
    //  [0,0,1]
    //]
    //要注意是竖着排的，第一行代表的是X轴变化，第二行代表的是Y轴的变化，第三行代表的是Z轴的变化，2D不涉及到Z轴，这里使用 0 0 1
    if (!nextPlay) {
        const $songCover = $('.song-disc__cover');
        const $songImg = $('.song-img');
        const songImgMatrix = window.getComputedStyle($songImg).getPropertyValue('transform');//获取song——img的transform的matrix值
        const songCoverMatrix = window.getComputedStyle($songCover).getPropertyValue('transform');//获取song——disc__cover的transform的matrix值
        if (songCoverMatrix === 'none' ) {
            $songCover.style.transform = songImgMatrix;
        } else {
            const matrix1 = parseMatrix(songCoverMatrix);
            const matrix2 = parseMatrix(songImgMatrix);
            const angle1 = calcAngle(matrix1[0],matrix1[1]);
            const angle2 = calcAngle(matrix2[0],matrix2[1]);
            const angle = angle1 + angle2;
            const radian = (Math.PI / 180) * angle;
            const [a, b, c, d] = [Math.cos(radian), Math.sin(radian), -Math.sin(radian), Math.cos(radian)];
            $songCover.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, 0, 0)`;
        }
    }
}


/**
* 解析 matrix 数据
* @param {String} matrix "matrix(-0.958715, 0.284368, -0.284368, -0.958715, 0, 0)"
* @returns {Array} [a, b, c, d, e, f]
*/
function parseMatrix(matrix){
    const start = matrix.indexOf('(') + 1;
    const end = matrix.indexOf(')');
    const content = matrix.slice(start,end);
    const values = content.split(', ');
    return values;
}

/**
* 根据x,y坐标，返回角度值angle
* @param {Number} (a, b) "(a, b)=(x, y)"
* @returns {Number} angle
*/
function calcAngle(a, b){
    //Math.atan2() 返回从原点(0,0)到(x,y)点的线段与x轴正方向之间的平面角度(弧度值)，也就是Math.atan2(y,x)
    //注意此函数接受的参数：先传递 y 坐标，然后是 x 坐标。
    const radian = Math.atan2(b, a);//radian：弧度
    const angle = radian * (180 / Math.PI);//angle：角度
    return angle;
}