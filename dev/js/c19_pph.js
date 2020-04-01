
function writeNodesToConsole (nodes) {
    var i;
    for (i = 0; i < nodes.length; i++) {
		console.log(i + ' : ' + nodes[i].nodeName + ' : ' + nodes[i].id);
    }
}

function moveQuestions(targetDiv, questionNodes, questionCount, firstNodeToMove) {
	// note that there are THREE nodes per question in the html that Qualtrics generates
	var i;
	var nodesPerQuestion = 2;
	for (i = 0; i < questionCount * nodesPerQuestion; i++) {
        var questionNode = questionNodes[firstNodeToMove];
        // console.log('questionNode:' + questionNode.id)
        targetDiv.appendChild(questionNode);
	}
}

function createDivForQuestions(divId, questionsDiv, startAtIndex, questionCount, answersSection){
	// create the new div
	var newDiv = document.createElement('div');
	newDiv.id = divId;
	newDiv.className="tabContent";
	if (!answersSection){
	    newDiv.className += " ctgCaseQuestion";
    }

	// insert new div into questions div
	var questionNodes = questionsDiv.childNodes;
	questionsDiv.insertBefore(newDiv, questionNodes[startAtIndex]);

	// move questions into new div
	moveQuestions(newDiv, questionNodes, questionCount, startAtIndex + 1);

	// find if div contains user input errors
	var tabId = newDiv.id + "Tab";
	var selectedTab = document.getElementById(tabId);

	var errorDivs = newDiv.getElementsByClassName("ValidationError");
	var i;
    for (i = 0; i < errorDivs.length; i++) {
		// console.log(i + ' : ' + errorDivs[i].id+ ' : ' + errorDivs[i].textContent);
		if (errorDivs[i].textContent !== "") {
			// selectedTab.textContent += " *";
			if (selectedTab.className.indexOf("tabWithErrors") === -1) {
        		selectedTab.className += ' tabWithErrors'
    		}
		}
    }
}

function restructureHTMLforVignette(qualtricsWin, answersSection) {
	var questionsDiv = document.getElementById('Questions');
	// writeNodesToConsole(questionsDiv.childNodes);
	var nodesToIgnore = 3;  // first three are for tabs

	createDivForQuestions('ContextDiv', questionsDiv, nodesToIgnore + 0, 1, answersSection);
	createDivForQuestions('Trace1Div', questionsDiv, nodesToIgnore + 1, 3, answersSection);
	createDivForQuestions('Trace2Div', questionsDiv, nodesToIgnore + 2, 3, answersSection);
	createDivForQuestions('Trace3Div', questionsDiv, nodesToIgnore + 3, 3, answersSection);
	/* the answers section does not contain the 'confirm ready to continue' question
	*  need to take this difference into account when restructuring HTML */
	var numberOfQuestionsInSection = 2;
	// console.log ('answersSection:'+ answersSection);
	if (answersSection === true){
	    numberOfQuestionsInSection = 1
        // console.log ('answersSection is now 1')
    }
	createDivForQuestions('AnalysisDiv', questionsDiv, nodesToIgnore + 4, numberOfQuestionsInSection, answersSection);

	// when first opening page go to tab with errors if there is one, otherwise select Context div
	var errorTabs = document.getElementsByClassName("tabWithErrors")

	if (errorTabs.length === 0) {
		showTab(null, 'ContextDiv');
		// qualtricsWin.hideNextButton();
	} else {
		// console.log(errorTabs.length);
		var errorTab = errorTabs[0];
		// console.log(errorTab.id);
		showTabById(null, errorTab.id);
	}
}

function restructureQuestionDivs() {
	let questionsDiv = document.getElementById('Questions');
	let questionNodes = questionsDiv.childNodes;
	let realQuestionsCount = questionNodes.length/2 - 1

	// create the new div
	let videoDiv = document.createElement('div');
	videoDiv.id = 'videoClip';
	let realQuestionsDiv = document.createElement('div');
	realQuestionsDiv.id = 'realQuestions';
	// insert new div into questions div
	questionsDiv.insertBefore(realQuestionsDiv, questionNodes[0]);
	questionsDiv.insertBefore(videoDiv, questionNodes[0]);

	// move questions into new div
	moveQuestions(videoDiv, questionNodes, 1, 2);
	moveQuestions(realQuestionsDiv, questionNodes, realQuestionsCount, 2);
}

function addNextPrevTabButtons() {
    var buttonsDiv = document.getElementById('Buttons');

    var newButton = document.createElement('Input');
    newButton.type = 'button';
    newButton.id = 'NextQuestionButton';
    // newButton.className = "NextQuestionButton NextButton Button";
    newButton.className = "btn";
    newButton.value = "Next";
    newButton.onclick = function(){showNextQ()};
    buttonsDiv.insertBefore(newButton, buttonsDiv.childNodes[1]);

    newButton = document.createElement('Input');
    newButton.type = 'button';
    newButton.id = 'PreviousQuestionButton';
    // newButton.className = "PreviousQuestionButton PreviousButton Button";
    newButton.className = "btn";
    newButton.value = "Back";
    newButton.onclick = function(){showPreviousQ()};
    buttonsDiv.insertBefore(newButton, buttonsDiv.childNodes[0]);
}

function addFinishedButton() {
    var buttonsDiv = document.getElementById('Buttons');

    var newButton = document.createElement('Input');
    newButton.type = 'button';
    newButton.id = 'FinishedButton';
    newButton.className = "btn";
    newButton.value = "Finished";
    newButton.onclick = function(){FinishLoop()};
    buttonsDiv.insertBefore(newButton, buttonsDiv.childNodes[1]);
}

function FinishLoop() {
	Qualtrics.SurveyEngine.setEmbeddedData('finish_loop', 'true');
}

function showOrHideNext(hideQuestionButton) {
	showOrHideElementById('NextQuestionButton', hideQuestionButton);
	showOrHideElementById('NextButton', !hideQuestionButton);
}

function showOrHidePrevious(hideQuestionButton) {
	showOrHideElementById('PreviousQuestionButton', hideQuestionButton);
	showOrHideElementById('PreviousButton', !hideQuestionButton);
}

function showNextQ() {
    console.log ("showNextQ");
	let questionsDiv = document.getElementById('realQuestions');
	let questionNodes = questionsDiv.childNodes;
	let visibleQIndex = -1;
	let newVisibleQIndex = -1;
	for (let i = 0; i < questionNodes.length; i=i+2){
	    let element = questionNodes[i];
	    // hide if currently visible but not last question
        if ((element.style.display === "inline" || !element.style.display) && i < questionNodes.length - 2) {
            visibleQIndex = i;
            console.log("visible Q = " + i);
            showOrHideElement(questionNodes[i], true);
            showOrHideElement(questionNodes[i+1], true);
        }
        else if (i === visibleQIndex + 2) {
            console.log("unhiding " + i);
            showOrHideElement(questionNodes[i], false);
            showOrHideElement(questionNodes[i+1], false);
            newVisibleQIndex = i;
        } else {
        	console.log("ignoring " + i)
		}
	}
	showOrHidePrevious(newVisibleQIndex === 0);
	showOrHideNext(newVisibleQIndex === questionNodes.length - 2);
}

function showPreviousQ() {
    console.log ("showPreviousQ");
	let questionsDiv = document.getElementById('realQuestions');
	let questionNodes = questionsDiv.childNodes;
	let visibleQIndex = -1;
	for (let i = questionNodes.length - 2; i >= 0 ; i=i-2){
	    let element = questionNodes[i];
	    // hide if currently visible but not first question
        if ((element.style.display === "inline" || !element.style.display) && i > 0) {
            visibleQIndex = i;
            console.log("visible Q = " + i);
            showOrHideElement(questionNodes[i], true);
            showOrHideElement(questionNodes[i+1], true);
        }
        else if (i === visibleQIndex - 2) {
            console.log("unhiding " + i);
            showOrHideElement(questionNodes[i], false);
            showOrHideElement(questionNodes[i+1], false);
            newVisibleQIndex = i;
       	} else {
        	console.log("ignoring " + i)
		}
	}
	showOrHidePrevious(newVisibleQIndex === 0);
	showOrHideNext(newVisibleQIndex === questionNodes.length - 2);
}

function showOrHideElement(element, hide){
    if (element != null) {
        if (hide) {
        	// console.log("hiding:" + element.id);
            element.style.display = "none"
        } else {
        	// console.log("unhiding:" + element.id);
            element.style.display = "inline"
        }
    }
}

function hideQuestions() {
    console.log ("hideQuestions");
	let questionsDiv = document.getElementById('realQuestions');
	let questionNodes = questionsDiv.childNodes;
	for (let i = 2; i < questionNodes.length; i=i+2){
	    showOrHideElement(questionNodes[i], true);
	    showOrHideElement(questionNodes[i+1], true);
	}
	// and hide back button initially
	// showOrHideElementById('PreviousQuestionButton', true)
	showOrHidePrevious(true)
	showOrHideNext(false)
}

function showOrHideElementById(elementId, hide){
    let element = document.getElementById(elementId);
	showOrHideElement(element, hide)
}

function showOrHideElementByClass(classNames, hide){
    let elements = document.getElementsByClassName(classNames);
    var element;
    for (element in elements)
	showOrHideElement(element, hide)
}