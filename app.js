const charLengthInputEl = document.getElementById("charLength");
const charLengthRangeEl = document.getElementById("charLengthRange");
const uppercaseCheckboxEl = document.getElementById("uppercase");
const lowercaseCheckboxEl = document.getElementById("lowercase");
const numbersCheckboxEl = document.getElementById("numbers");
const symbolsCheckboxEl = document.getElementById("symbols");
const generatePwdFormEl = document.getElementById("pwdGeneratorForm");
const errMsgEl = document.getElementById("errMsg");
const generatedPwdEl = document.getElementById("generatedPwd");
const copyBtnEl = document.getElementById("clipboardCopyBtn");
const indicatorsWrapperEl = document.querySelector(".indicators-wrapper");
const strengthResultEl = document.getElementById("strengthResult");

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const showErrMessage = (msgText) => {
    errMsgEl.textContent = msgText;
    errMsgEl.classList.add("show");
}

const updateRangeSliderFill = (value) => {
    const min = charLengthRangeEl.min;
    const max = charLengthRangeEl.max;
    const percentage = ((value - min) / (max - min)) * 100;
    charLengthRangeEl.style.setProperty("--fill", `${percentage}%`);
}

const init = () => {
    updateRangeSliderFill(charLengthRangeEl.value);
}

init();

if(charLengthInputEl && charLengthRangeEl) {
    charLengthInputEl.addEventListener("input", () => {
        let value = parseInt(charLengthInputEl.value) || 0;
        const clampedValue = Math.min(Math.max(value, 0), 20);
        charLengthInputEl.value = clampedValue;
        charLengthRangeEl.value = clampedValue;
        updateRangeSliderFill(clampedValue);
    });

    charLengthRangeEl.addEventListener("input", () => {
        let value = parseInt(charLengthRangeEl.value);
        charLengthInputEl.value = value;
        updateRangeSliderFill(value);
    });
}

const updateStrengthIndicator = (strength) => {
    indicatorsWrapperEl.className = `indicators-wrapper ${strength}`;
    strengthResultEl.textContent = strength.replace("-", " ");
}

const calculatePasswordStrength = (password) => {
    const passwordLength = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?/]/.test(password);

    let strengthScore = 0;

    if(passwordLength >= 6) strengthScore += 5;
    if(passwordLength >= 8) strengthScore += 10;
    if(passwordLength >= 12) strengthScore += 15;
    if(passwordLength >= 16) strengthScore += 15;
    if(passwordLength === 20) strengthScore += 10;

    if(hasLowercase) strengthScore += 10;
    if(hasUppercase) strengthScore += 10;
    if(hasNumbers) strengthScore += 10;
    if(hasSymbols) strengthScore += 15;

    if(strengthScore < 35) {
        updateStrengthIndicator("extra-weak");
        return;
    } 
    if(strengthScore < 50) {
        updateStrengthIndicator("weak");
        return;
    }
    if(strengthScore < 85) {
        updateStrengthIndicator("medium");
        return;
    }
    if(strengthScore >= 85) {
        updateStrengthIndicator("strong");
        return;
    }
}

const generatePassword = (length, charPool, upper, lower, number, symbol) => {
    let passwordText = "";
    if(upper) {
        let upperCh = UPPERCASE[Math.floor(Math.random()* UPPERCASE.length)];
        passwordText += upperCh;
    }
    if(lower) {
        let lowerCh = LOWERCASE[Math.floor(Math.random()* LOWERCASE.length)];
        passwordText += lowerCh;
    }
    if(number) {
        let numCh = NUMBERS[Math.floor(Math.random()* NUMBERS.length)];
        passwordText += numCh;
    }
    if(symbol) {
        let symCh = SYMBOLS[Math.floor(Math.random()* SYMBOLS.length)];
        passwordText += symCh;
    }

    let pwdRest = "";
    for(let i = 0; i < length - passwordText.length; i++) {
        const randomIdx = Math.floor(Math.random() * charPool.length);
        const randomChar = charPool[randomIdx];
        pwdRest += randomChar;
    }
   
    let pwdFinish = passwordText + pwdRest;
    pwdFinish = shuffleArray(pwdFinish.split(""));
    pwdFinish = pwdFinish.join("");

    generatedPwdEl.textContent = pwdFinish;

    calculatePasswordStrength(pwdFinish);   
}

const handleSubmit = (e) => {
    e.preventDefault();

    // RESET PREVIOUS VALUES
    errMsgEl.textContent = "";
    errMsgEl.classList.remove("show");
    indicatorsWrapperEl.className = "indicators-wrapper";
    strengthResultEl.textContent = "";

    const pwdLength = parseInt(charLengthRangeEl.value) || 0;
    const uppercaseInc = uppercaseCheckboxEl.checked;
    const lowercaseInc = lowercaseCheckboxEl.checked;
    const numbersInc = numbersCheckboxEl.checked;
    const symbolsInc = symbolsCheckboxEl.checked;

    let charPool = "";

    if(uppercaseInc) charPool += UPPERCASE;
    if(lowercaseInc) charPool += LOWERCASE;
    if(numbersInc) charPool += NUMBERS;
    if(symbolsInc) charPool += SYMBOLS;

    if(!pwdLength) {
        showErrMessage("Please choose a password length");
        return;
    }

    if(pwdLength < 6) {
        showErrMessage("Minimum password length is 6 characters");
        return;
    }

    if(!charPool) {
        showErrMessage("Please select at least one of char options");
        return;
    }

    generatePassword(pwdLength, charPool, uppercaseInc, lowercaseInc, numbersInc, symbolsInc); 
}

generatePwdFormEl.addEventListener("submit", handleSubmit);

// COPY TO CLIPBOARD
const copyToClipboard = async() => {
    try {
        await navigator.clipboard.writeText(generatedPwdEl.textContent);
        copyBtnEl.classList.add("copied");
    } catch(error) {
        console.error("Clipboard failed:", error);
        // fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = generatedPwdEl.textContent;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        copyBtnEl.classList.add("copied");
    }
}

copyBtnEl.addEventListener("click", async () => {
    if(!generatedPwdEl.textContent) return;
    await copyToClipboard();
    setTimeout(function() {
        copyBtnEl.classList.remove("copied");
    }, 1500);
});

// Fisher-Yates Shuffle
// Link to article https://medium.com/@khaledhassan45/how-to-shuffle-an-array-in-javascript-6ca30d53f772
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}