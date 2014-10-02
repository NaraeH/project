"use strict";
var startLadder = {};
var endLadder = {};
var ladderList = []; //가로 좌표값 담고 있는 배열

var ladderX = []; // 사다리에 다리부분 그릴 때 계산하기 위한 배열
var width = window.getComputedStyle(ladderCanvas, null).width.split("p")[0] - 20;
var height = window.getComputedStyle(ladderCanvas, null).height.split("p")[0];
var member; // 사다리 게임을 할 사람 수

var userIndexX, userY; // 행, 절대좌표
var lineStartX, lineStartY, lineEndX, lineEndY; // 절대좌표
var GoalX, saveGoalX, GoalY; // 절대 좌표
var lineDirect, saveLineDirect;
var turnNeed;
var moveEnd;
var gameStart = false;

var move = function() {
	if (moveEnd == true)
		return;

	var can = document.getElementById('ladderCanvas');
	var context = can.getContext('2d');

	//console.log( '이동해 빨리 ', lineDirect );
	context.strokeStyle = '#ff0000';
	context.beginPath();
	context.moveTo(lineStartX, lineStartY);

	// 선을 그립니다.
	context.lineTo(lineEndX, lineEndY);
	context.stroke();

	if (lineDirect == 'down') {
		++lineEndY;

		if (lineEndY > 420) {
			moveEnd = true;
			//console.log( '이동 끝 ');
			clearInterval(move);
		} else {
			if (lineEndY > GoalY) {
				lineDirect = saveLineDirect;

				GoalX = saveGoalX;
				lineStartY = lineEndY;
			}
		}
	} else if (lineDirect == 'left') {
		--lineEndX;
		if (lineEndX < GoalX) {
			lineStartX = lineEndX;
			--userIndexX;
			lineDirect = 'down';
			UpdateTurn(false);
		}
	} else if (lineDirect == 'right') {
		++lineEndX;
		if (lineEndX > GoalX) {
			lineStartX = lineEndX;
			++userIndexX;
			lineDirect = 'down';
			UpdateTurn(false);
		}
	}
}

Array.prototype.myRemove = function(index) {
	this.splice(index, 1);
}

document.getElementById("btnStart").onclick = function(event) {
	member = document.getElementById("member").value;

	if ((member > 0) && (member < 21)) {
		document.getElementById("pop").style.display = 'none';
		document.getElementById("back").style.display = "none";

		drawCanvasBackground();
		rightDiv(document.getElementById("inputNameContent"));
		rightDiv(document.getElementById("inputResultContent"));

		printLineNumber(100);
		printLineNumber(570);

	} else {
		document.getElementById("errorMsg").innerHTML = "참여 인원 수를 1 ~ 20 사이로 입력해주세요";
	}
}

// 시작 x,y 좌표 받아오기
document.getElementById("ladderCanvas").onmousedown = function(event) {
	startLadder = {
		"x" : event.offsetX,
		"y" : event.offsetY
	};
	var index = width / event.offsetX;
	
	console.log(startLadder.x, startLadder.y);
}

// 끝 x,y 좌표 받아오기
document.getElementById("ladderCanvas").onmouseup = function(event) {

	endLadder = {
		"x" : event.offsetX,
		"y" : event.offsetY
	};
	
	console.log(endLadder.x-3, endLadder.y-3);
	computeDrawLadder();
}

function printLineNumber(top){
	
	var mainObj = document.getElementById('mainContent');
	var spa = document.createElement('table');
	var tr = document.createElement('tr');
	var td, a, tr1;

	spa.setAttribute('id', 'memberId');
	
	for (var d = 0; d < member; ++d) {
		td = document.createElement('td');
		a = document.createElement("a");

		a.setAttribute('id', 'myid' + d);
		a.href = "#";
		a.innerHTML = d + 1;
		a.style.color = 'red';
		a.style['font-size'] = '20px';
		a.style.position = 'absolute';
		a.onclick = drawLadderAuto;
		var numPx = d * (width / (member - 1)) + 20 + 'px';

		a.style['left'] = numPx;
		a.style['top'] = top +'px';

		td.appendChild(a);
		tr.appendChild(td);
	}
	spa.appendChild(tr);

	mainObj.appendChild(spa);

	spa.style.position = 'relative';
	spa.style.left = '27px';
	spa.style.top = '-610px';
}

function drawLadderAuto(event) {

	var tString = new String(this.id);
	tString = tString.split('d')[1];
	console.log(tString);

	var context = document.getElementById('ladderCanvas').getContext('2d');
	context.strokeStyle = '#000000';
	drawCanvasBackground();

	for (var a = 0; a < ladderList.length; ++a) {
		ladderList[a].used = false;

		var startX = ladderList[a].column * (width / (member - 1)) + 10;
		var endX = startX + (width / (member - 1));

		drawLadder(startX, ladderList[a].y, endX, ladderList[a].y);
	}

	lineStartY = lineEndY = 0;
	GoalY = 420;

	saveLineDirect = lineDirect = 'down';
	turnNeed = true;
	moveEnd = false;

	var dd = Number(tString);
	userIndexX = dd;
	lineStartX = lineEndX = GoalX = dd * (width / (member - 1)) + 10;
	gameStart = true;

	UpdateTurn(true);
	setInterval(move, 1000 / 60);
}

function rightDiv(tbody) {
	var tr;
	var td;
	var input;

	tr = document.createElement("tr");
	for (var i = 0; i < member; i++) {
		tr = document.createElement("tr");

		td = document.createElement("td");
		td.innerHTML = i + 1;
		tr.appendChild(td);

		td = document.createElement("td");
		input = document.createElement("input");
		input.type = "text";
		input.size = 10;
		td.appendChild(input);
		tr.appendChild(td);

		tbody.appendChild(tr);

	}
}

function UpdateTurn(firstTurn) {

	if (turnNeed == false)
		return;

	if (ladderList.length == 0) {
		turnNeed = false;
		GoalY = 420;
		return;
	}

	var nextX = [];
	if (userIndexX == 0) {
		nextX.push(0);
	} else if (userIndexX == member) {
		nextX.push(member - 1);
	} else {
		nextX.push(userIndexX - 1);
		nextX.push(userIndexX);
	}

	GoalY = 420;
	turnNeed = false;
	var removeIndex;

	var a = 0;
	for (a = 0; a < ladderList.length; ++a) {
		for (var b = 0; b < nextX.length; ++b) {

			if (ladderList[a].column == nextX[b] && ladderList[a].used == false) {
				var dataupdate = false;

				if (firstTurn) {
					if (GoalY > ladderList[a].y)
						dataupdate = true;
				} else {
					if (GoalY > ladderList[a].y && ladderList[a].y > lineEndY)
						dataupdate = true;
				}

				if (dataupdate == false)
					continue;

				GoalY = ladderList[a].y;

				if (ladderList[a].column == userIndexX) {
					saveGoalX = Math.floor(GoalX + (width / (member - 1)));
					saveLineDirect = 'right';
				} else {
					saveGoalX = Math.floor(GoalX - (width / (member - 1)));
					saveLineDirect = 'left';
				}

				removeIndex = a;
				turnNeed = true;
			}
		}
	}

	if (turnNeed)
		ladderList[removeIndex].used = true;
}



// 사다리 세로부분 canvas에 그리기
function drawCanvasBackground() {

	ladderX[0] = 0;
	for (var i = 0; i < member; i++) {
		ladderX[i + 1] = (width - ((width / (member - 1)) * ((member - 1) - i))) + 10;

		drawLadder(ladderX[i + 1], 0, ladderX[i + 1], height);
	}
	ladderX[member + 1] = width + 20;
}

// 사용자가 canvas에 그리는 사다리 가로 부분
function computeDrawLadder() {

	if (startLadder.x < endLadder.x) {
		drawLadderPoint(startLadder.x, endLadder.x);
	} else {
		drawLadderPoint(endLadder.x, startLadder.x);
	}
}

//사용자가 그리는 사다리 가로 부분 포인트 유효범위 계산하기
function drawLadderPoint(start, end) {
	var drawStart = 0;
	var drawEnd = 0;
	var column = 0;

	for (var i = 0; i < ladderX.length - 1; i++) {
		if ((ladderX[i] <= start) && (start <= ladderX[i + 1])) {
			drawStart = ladderX[i + 1];
			drawEnd = (end - start) >= (width / member) ? ladderX[i + 2] : -1;
			column = i;
		}
	}
	drawLadder(drawStart, startLadder.y, drawEnd, startLadder.y);

	var tGatta = false;
	var tY = Math.floor(startLadder.y);

	for (var a = 0; a < ladderList.length; ++a) {
		if (ladderList[a].y == tY && ladderList[a].column == column)
			tGatta = true;
	}

	if (tGatta == false)
		ladderList.push(new MakeLadder(column, tY));

}

function MakeLadder(column, y) {
	this.column = column;
	this.y = y;
	this.used = false;
}

//사다리를 화면에 그리는 함수
function drawLadder(startX, startY, endX, endY) {
	if ((startX != -1) && (endX != -1)) {
		var ladderCanvas = document.getElementById("ladderCanvas");
		var ladderCanvas2d = ladderCanvas.getContext("2d");

		ladderCanvas2d.moveTo(startX, startY); // starting point
		ladderCanvas2d.lineTo(endX, endY); // ending point
		ladderCanvas2d.lineWidth = 10;
		ladderCanvas2d.lineCap = 'round';
		ladderCanvas2d.stroke();
	}
}
