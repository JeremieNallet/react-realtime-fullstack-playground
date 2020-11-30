import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router';
import { useStore } from '../store';

const useClosePannelsOnRouteChange = (pannels) => {
    const setPannel = useStore(state => state.setPannel);
    const pannel = useStore((state) => state.pannel);
    const history = useHistory();

    const closeAllPannelBut = useCallback((...exclude) => {
        Object.keys(pannel).forEach((el) => {
            if (!exclude.includes(el)) setPannel(el, false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        history.listen(() => closeAllPannelBut(pannels));
    }, [closeAllPannelBut, history, pannels]);


}

export default useClosePannelsOnRouteChange
