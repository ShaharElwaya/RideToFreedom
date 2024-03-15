// useCustomQuery.jsx

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const useCustomQuery = (callback, dependencies = []) => {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            callback();
        }
    }, [router.isReady, ...dependencies])
}

export default useCustomQuery;
