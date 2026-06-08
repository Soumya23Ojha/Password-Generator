const passwordDisplay = document.getElementById("passwordDisplay");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const slider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");

const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");

const excludeSimilarCheck = document.getElementById("excludeSimilar");
const avoidAmbiguousCheck = document.getElementById("avoidAmbiguous");

const strengthText = document.getElementById("strengthText");
const strengthBar = document.getElementById("strengthBar");

const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-={}[]<>?/|";

const similarChars = "0Oo1lI";
const ambiguousChars = "{}[]()/\\'\"`~,;:.<>";

lengthValue.textContent = slider.value;

slider.addEventListener("input", () => {
    lengthValue.textContent = slider.value;
});

function removeCharacters(str, charsToRemove) {
    return str
        .split("")
        .filter(char => !charsToRemove.includes(char))
        .join("");
}

function generatePassword() {

    let charset = "";

    let upper = uppercaseChars;
    let lower = lowercaseChars;
    let nums = numberChars;
    let syms = symbolChars;

    if (excludeSimilarCheck.checked) {
        upper = removeCharacters(upper, similarChars);
        lower = removeCharacters(lower, similarChars);
        nums = removeCharacters(nums, similarChars);
    }

    if (avoidAmbiguousCheck.checked) {
        syms = removeCharacters(syms, ambiguousChars);
    }

    if (uppercaseCheck.checked) charset += upper;
    if (lowercaseCheck.checked) charset += lower;
    if (numbersCheck.checked) charset += nums;
    if (symbolsCheck.checked) charset += syms;

    if (charset === "") {
        alert("Please select at least one option.");
        return;
    }

    let password = "";
    const length = Number(slider.value);

    for (let i = 0; i < length; i++) {

        const randomIndex = Math.floor(
            Math.random() * charset.length
        );

        password += charset[randomIndex];
    }

    passwordDisplay.textContent = password;

    evaluateStrength(password);
}

function evaluateStrength(password) {

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {

        strengthText.textContent = "Weak";
        strengthText.className = "font-semibold text-red-500";

        strengthBar.className =
            "h-full bg-red-500 transition-all duration-500";

        strengthBar.style.width = "25%";

    }

    else if (score <= 4) {

        strengthText.textContent = "Medium";
        strengthText.className = "font-semibold text-yellow-500";

        strengthBar.className =
            "h-full bg-yellow-500 transition-all duration-500";

        strengthBar.style.width = "60%";

    }

    else if (score <= 5) {

        strengthText.textContent = "Strong";
        strengthText.className = "font-semibold text-blue-500";

        strengthBar.className =
            "h-full bg-blue-500 transition-all duration-500";

        strengthBar.style.width = "80%";

    }

    else {

        strengthText.textContent = "Very Strong";
        strengthText.className = "font-semibold text-green-600";

        strengthBar.className =
            "h-full bg-green-600 transition-all duration-500";

        strengthBar.style.width = "100%";

    }
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", async () => {

    const password = passwordDisplay.textContent;

    if (
        password === "" ||
        password === "Click Generate"
    ) {
        return;
    }

    try {

        await navigator.clipboard.writeText(password);

        const originalText = copyBtn.textContent;

        copyBtn.textContent = "Copied ✓";

        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);

    }

    catch (error) {

        alert("Unable to copy password.");

    }
});

generatePassword();