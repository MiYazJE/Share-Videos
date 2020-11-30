const ONE_MILLION = 1000000;

const useViews = (views) => {

    const formatNumber = () => views.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

    let res = (views < ONE_MILLION)
        ? formatNumber()
        : `${(views / ONE_MILLION).toFixed(1)} M`;

    return res;
}

export default useViews;