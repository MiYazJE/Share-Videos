const ONE_MILLION = 1000000;

const useViews = () => {

    const formatNumber = (views) => views.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

    const formatViews = (views) => {
        return (views < ONE_MILLION)
            ? formatNumber(views) + ' views'
            : `${(views / ONE_MILLION).toFixed(1)} M views`;
    }

    return formatViews;
}

export default useViews;