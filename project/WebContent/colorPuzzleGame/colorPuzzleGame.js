/*
 1. 2*2 타일 블럭 생성
 2. 셀에 마우스 커버가 있을 때, 색상변경 
 3. 랜덤으로 두칸만(?) 색상변경
 4. chkUserSelect(): 사용자 칸을 클릭하면, 맞으면=> 파란색,  틀리면=> X이미지 출력
 5. 마지막 칸 클릭 시, 정답일 경우=> v이미지 출력 
 */
"use strict"

var cntAnswer = 0;
var levelCnt = 2;   // 처음은 2*2로 시작
$(function() {

	chkLevel();

});

// level Check한 후 그 다음 함수들 호출하기
function chkLevel() {
	cntAnswer=0;

	levelCnt = levelCnt>6? 6: levelCnt;
	
	refreshArea();
	makePuzzleArea();
	makeRandomPuzzle();
	chkUserSelect();
}

function refreshArea(){
	$("#main > div").remove();
}

// n에 따라 n*n의 공간 생성
function makePuzzleArea() {

	var mainWidth = $("#main").css("width").split("p")[0]; 
	var divWidth = 120 - (levelCnt - 3) * 20;
	var divHeight = 120 - (levelCnt - 3) * 20;
	var staticMarginLeft = (mainWidth - (divWidth * levelCnt)) / (levelCnt - 1);
	var divMarginLeft = 0;
	var staticMarginTop = staticMarginLeft;
	var divMarginTop = 0;

	for (var i = 0; i < levelCnt; i++) {
		divMarginLeft = 0;
		for (var j = 0; j < levelCnt; j++) {

			$("<div>").css({
				"width" : divWidth,
				"height" : divHeight,
				"margin-top" : divMarginTop,
				"margin-left" : divMarginLeft,
				"display" : "inline",
				"position" : "absolute"
			}).appendTo($("#main"));
			divMarginLeft = staticMarginLeft * (j + 1) + divWidth * (j + 1);
		}
		divMarginTop = staticMarginTop * (i + 1) + divHeight * (i + 1);
	}
}

// random하게 puzzle 블럭 선택되는 함수
function makeRandomPuzzle() {
	var divList = $("#main>div");

	$(divList).each(function(index, element) {
		if (parseInt(Math.random() * 2)) {
			$(divList[index]).addClass("answer").css("background", "green");

			cntAnswer++;
		}

		setTimeout(function() {
			$(divList[index]).css("background", "yellow");
		}, 1300);
	});
}

// 사용자가 선택한 공간 맞는지 체크하는 함수
function chkUserSelect() {
	var divList = $("#main>div");
	var divClicked;
	var cntClicked = 0;

	$(divList).one("click",function(event) {
		divClicked = $(this);

			if (divClicked.is(".answer")) {
				$(divClicked).css("background", "green").html("yes!");
				cntClicked++;

				if(cntClicked==cntAnswer){
					levelCnt++;
					alert("정답입니다");
					chkLevel();
				}
			} else {
					$(divClicked).css("background", "red");
					setTimeout(function() {
						$(divClicked).css("background", "yellow");
					}, 300);
			}
	});
}
