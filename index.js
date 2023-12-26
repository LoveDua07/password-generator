// const { setTimeout } = require("timers/promises");

const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthnum = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[dataPasswordDisplay]");

const upper = document.querySelector("#uppercase");

const lower = document.querySelector("#lowercase");

const numbercheck = document.querySelector("#numbers");

const symbolcheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const copyBtn = document.querySelector("[data-copy]");

const copyMsg = document.querySelector("[data-copyMsg]");

const generateBtn = document.querySelector(".generateButton");

const allCheckbox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()-_+={[}]|\:;"<,>.?/';

let password = "";

let passwordLength=10;

let checkCount=0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");


// set passwordLength
function handleSlider(){

    inputSlider.value = passwordLength;
    lengthnum.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min)) + "% 100%"

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){

    return Math.floor(Math.random() * (max-min))+min;

}

function getRndNumber() {

    return getRndInteger(0,9);
    
}

function generateLowercae() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercae() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols() {

    const rndNum = getRndInteger(0,symbols.length);

    return symbols.charAt(rndNum);
    
}


function calcStrength() {

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upper.checked) hasUpper = true;
    if(lower.checked) hasLower = true;
    if(numbercheck.checked) hasNum = true;
    if(symbolcheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
    
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied'
    }
    catch(e){
        copyMsg.innerText = 'failed'
    }
    // copy wala span visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}


inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})



function handleCheckBoxChange(){

    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

};

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});


function shufflePassword(array){
    // fisher yates password
    for(let i = array.length-1 ; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j] =temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
} 

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0 ) 
    return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password
    console.log("start");
    // remove old password
    password = "";

    //let's put the staff mentioned by checkboxes
    // if(upper.checked){
    //     password += generateUppercae();
    // }

    // if(lower.checked){
    //     password += generateLowercae();
    // }

    // if(numbercheck.checked){
    //     password += getRndNumber();
    // }

    // if(symbolcheck.checked){
    //     password += generateSymbols();
    // }


    let funcArr = [];

    if(upper.checked)
        funcArr.push(generateUppercae);

    if(lower.checked)
        funcArr.push(generateLowercae);

    if(numbercheck.checked)
        funcArr.push(getRndNumber);

    if(symbolcheck.checked)
        funcArr.push(generateSymbols);

    // compulsory Addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("ca done");
    // remaining 
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    } 
    console.log("s done");
    // shuffle password
    password = shufflePassword(Array.from(password));
    console.log("sfuff done");
    // show in UI
    passwordDisplay.value = password;
    console.log("ui  done");
    
    // calc strength
    calcStrength();

});