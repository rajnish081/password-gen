document.addEventListener("DOMContentLoaded", () => {
    const inputSlider = document.querySelector("[data-lengthSlider]");
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    const passwordDisplay = document.querySelector("[data-passwordDisplay]");
    const copybutton = document.querySelector("[data-copy]");
    const copymsg = document.querySelector("[data-copyMsg]");
    const uppercaseCheck = document.querySelector("#uppercase");
    const lowercaseCheck = document.querySelector("#lowercase");
    const numbersCheck = document.querySelector("#numbers");
    const symbolsCheck = document.querySelector("#symbols");
    const indicator = document.querySelector("[data-indicator]");
    const generateButton = document.querySelector(".generate-button");
    const allcheckbox = document.querySelectorAll("input[type=checkbox]");
    const symbols = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/~`";


    let password = "";
    let passwordLength = 10;
    let checkCount = 0;
    handleSlider();

    // set strength circle to grey


    // set passwordlength
    function handleSlider() {
        inputSlider.value = passwordLength;
        lengthDisplay.innerText = passwordLength;
    }
    function setIndicator(color) {
        indicator.style.backgroundColor = color;
    }
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function generateRandomNumber() {
        return getRndInteger(0, 9);
    }
    function generateLowercase() {
        return String.fromCharCode(getRndInteger(97, 123));
    }

    function generateUppercase() {
        return String.fromCharCode(getRndInteger(65, 91));

    }
    function generateSymbol() {
        const randNum = getRndInteger(0, symbols.length);
        return symbols.charAt(randNum);
    }
    function calcStrength() {
        let hasUpper = false;
        let hasLower = false;
        let hasNum = false;
        let hasSym = false;
        if (lowercaseCheck.checked) hasUpper = true;
        if (uppercaseCheck.checked) hasLower = true;
        if (numbersCheck.checked) hasNum = true;
        if (symbolsCheck.checked) hasSym = true;
        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
            setIndicator('#0f0');

        } else if ((hasLower || hasUpper) && (hasNum || hasSym) && (passwordLength >= 6)) {
            setIndicator('#ff0');

        } else {
            setIndicator('#f00');
        }
    }

    async function copyContent() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            copymsg.innerText = 'copied';
        }
        catch {
            copymsg.innerText = "failed"

        }
        copymsg.classList.add('active');
        setTimeout(() => {
            copymsg.classList.remove("active");
        }, 2000);
    }
    function handleCheckBoxChange() {
        checkCount = 0;
        allcheckbox.forEach((checkbox) => {
            if (checkbox.checked)
                checkCount++;
        });

        // special condition
        if (checkCount > passwordLength) {
            passwordLength = checkCount;
            handleSlider();
        }
    }
    function shufflePassword(array) {
        // fisher yates method
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        let str = "";
        array.forEach((el) => (str += el));
        return str;
    }


    allcheckbox.forEach((checkbox) => {
        checkbox.addEventListener('change', handleCheckBoxChange);

    })

    inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;
        lengthDisplay.innerText = passwordLength;
        handleSlider();
    })

    copybutton.addEventListener('click', () => {
        if (passwordDisplay.value)
            copyContent();
    })

    generateButton.addEventListener('click', () => {
        // none of the checkbox are checked
        if (checkCount <= 0) {
            return;
        }


        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }


        console.log("start");
        // remove old password;

        password = "";

        // if (uppercaseCheck.checked){
        //     password+=generateUppercase();
        // }
        // if (lowercaseCheck.checked){
        //     password+=generateLowercase();
        // }
        // if (numbersCheck.checked){
        //     password+=generateRandomNumber();
        // }
        // if (symbolsCheck.checked){
        //     password+=generateSymbol();
        // }

        let funcArr = []
        if (uppercaseCheck.checked)
            funcArr.push(generateUppercase);
        if (lowercaseCheck.checked)
            funcArr.push(generateLowercase);
        if (numbersCheck.checked)
            funcArr.push(generateRandomNumber);
        if (symbolsCheck.checked)
            funcArr.push(generateSymbol);

        // compulsory addition
        for (let i = 0; i < funcArr.length; i++) {
            password += funcArr[i]();
        }
        console.log("compilsory addition done")

        // remaining Addition
        for (let i = 0; i < passwordLength - funcArr.length; i++) {
            let randIndex = getRndInteger(0, funcArr.length);
            console.log("randIndex" + randIndex);
            password += funcArr[randIndex]();

        }

        console.log("remaining addition done")


        // shuffle the password
        password = shufflePassword(Array.from(password));
        console.log("shuffle password");

        // show in UI
        passwordDisplay.value = password;
        console.log("ui addition done");
        // calculate strength
        calcStrength();

    });
});





