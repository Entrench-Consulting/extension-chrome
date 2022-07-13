// background.js 
/**
 * 마우스 오른쪽 버튼 클릭시 노출되는 Context Menu에 메뉴 추가. 
 ***/

try{
    chrome.contextMenus.create({
        id: "copyForEGS",
        title: "Copy for Entrench GTM",
        contexts: ["all"] 
    });
}catch(e){ 
} 

/**
 * Context Menu 클릭시 호출되는 함수.  
 **/
chrome.contextMenus.onClicked.addListener(function(info,tab) {
    chrome.tabs.sendMessage(tab.id, {target: "copy"});
});

function injectScriptsInAllTabs(){
    console.log("reinject content scripts into all tabs");
    var manifest = chrome.runtime.getManifest();
    var scripts = manifest.content_scripts.reduce((sc, cur)=>sc.concat(cur.js || []), []);
    var styles = manifest.content_scripts.reduce((sc, cur)=>sc.concat(cur.css || []), []); 
    
    chrome.tabs.query({url:"*://*/*"}, (tabs)=>{
        var filtered = tabs.filter(_=>_.url.indexOf("https://chrome.google.com/webstore/detail") !== 0);
        filtered.forEach(tab=>{
            scripts.map((sc)=>chrome.tabs.executeScript(tab.id, {file: sc, allFrames: true}));
        });
        filtered.forEach(tab=>{
            styles.map((sc)=>chrome.tabs.insertCSS(tab.id, {file: sc, allFrames: true}));
        });
    });
}

/**
 * Chrome Extension 설치, 업데이트시에 브라우져에 열려진 모든 Tab 화면에 css selector 기능 주입 처리 
 ***/
chrome.runtime.onInstalled.addListener((details)=>{
    if(["install", "update"].some((reason)=>details.reason === reason)){
        setTimeout(()=>{
            injectScriptsInAllTabs();
        },5000);
    }
});




