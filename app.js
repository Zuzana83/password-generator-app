const charLengthInputEl = document.getElementById("charLength");
const charLengthRangeEl = document.getElementById("charLengthRange");

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
        let value = charLengthInputEl.value;
        charLengthRangeEl.value = value;
    });

    charLengthRangeEl.addEventListener("input", () => {
        let value = parseInt(charLengthRangeEl.value) || 0;
        const clampedValue = Math.min(Math.max(value, 0), 20);
        charLengthInputEl.value = clampedValue;
        charLengthRangeEl.value = clampedValue;
        updateRangeSliderFill(value);
    });
}
