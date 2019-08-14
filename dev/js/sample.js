
function writeNodesToConsole (nodes) {
    var i;
    for (i = 0; i < nodes.length; i++) {
		console.log(i + ' : ' + nodes[i].nodeName + ' : ' + nodes[i].id);
    }
}

function uncheckOptionButton(questionId) {
    var button = document.getElementById(questionId);
    if (button != null) {
        console.log("q:" + button);
        button.checked = false;
    }
}

function hideButton(buttonId) {
    var button = document.getElementById(buttonId);
    if (button != null){
        button.style.display = "none";
    }
}

function showOrHideButton(buttonId, hide){
    button = document.getElementById(buttonId);
    if (button != null) {
        if (hide) {
            button.style.display = "none"
        } else {
            button.style.display = "inline"
        }
    }
}
