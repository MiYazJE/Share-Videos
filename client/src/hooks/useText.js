const MAX_LENGTH = 60;

const useText = (text) => {
    return text.length <= MAX_LENGTH
        ? text 
        : `${text.substring(0, MAX_LENGTH)}...`;
}

export default useText;