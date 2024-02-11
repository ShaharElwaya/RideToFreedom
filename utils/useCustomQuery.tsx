import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const useCustomQuery = (callback, dependecies = []) => {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            callback();
        }
    }, [router.isReady, ...dependecies])
}

export default useCustomQuery;