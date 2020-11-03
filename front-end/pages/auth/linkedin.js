import React, { useEffect } from 'react'
import Router from 'next/router';

const linkedin = (props) => {
    useEffect(() => {
        localStorage.setItem('accessToken', props.params);
        Router.push('/');
    },[])
    
    return <div>
        {props.params}
    </div>

}

linkedin.getInitialProps = ({query: {token}}) => {
    return { params: token };
}

export default linkedin;