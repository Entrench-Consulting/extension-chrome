/* global SelectorGenerator */
let clickedElement;

function copyToClipboard(text) {
    if( text != "" ){
        const input = document.createElement("input");
        input.style.position = "fixed";
        input.style.opacity = 0;
        input.value = text; 

        window.vt.success("CSS Selector 가 복사되었습니다. 클립보드 내용을 확인하세요.",{
          title: undefined,
          position: "top-right",
          duration: 3000,
          closable: true,
          focusable: true,
          callback: undefined
        });

        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        document.body.removeChild(input);
    } 
}

function addClass(element, cls){
    let classes = (element.className || "").split(" ");
    if(!classes.includes(cls)){
        element.className = classes.concat([cls]).join(" ");
    }
}

function removeClass(element, cls){
    let classes = (element.className || "").split(" ");
    if(classes.includes(cls)){
        element.className = classes.filter(_=>_ !== cls).join(" ");
    }
}

function highlight(element){
    if(!element){
        return;
    }
    const higlightClass = "__copy-css-selector-highlighted";
    addClass(element,higlightClass);
    setTimeout(() => {
        removeClass(element,higlightClass);
    },2000);
}

document.addEventListener("mousedown", (event) => {
    clickedElement = event.target;
}, true);

chrome.runtime.onMessage.addListener((request) => {
    if(request && request.target === "copy"){
        let selectorGenerator = new SelectorGenerator({querySelectorAll:window.document.querySelectorAll.bind(window.document)});
        let selector = selectorGenerator.getSelector(clickedElement); 
        highlight(clickedElement);
        copyToClipboard(selector);
    }
});