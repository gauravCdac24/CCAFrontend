const ValidatePattern = (e, pattern) => {


    const updatedValue = e.target.value + e.key;
    if (e.key === 'Backspace') {
        return;
    }
    if (e.key === "Tab") {
        return; 
    }
    if (!new RegExp(pattern).test(updatedValue)) {
        e.preventDefault();
    }

}

export default ValidatePattern;