const MAX_LENGTH = 60;

const useTitle = () => {

    const formatTitle = (text) => 
        text.length <= MAX_LENGTH
            ? text 
            : `${text.substring(0, MAX_LENGTH)}...`;
        
    return formatTitle;    
}

export default useTitle;