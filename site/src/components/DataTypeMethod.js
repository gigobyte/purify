import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    padding: 15px 0px;
    border-bottom: 1px solid #b8d1e2;
    border-style: dashed;
    border-left: 0;
    border-top: 0;
    border-right: 0;
`

const MethodName = styled.div`
    font-size: 19px;
    color: #007acc;
    border-left: 5px;
`

const MethodSignature = styled.span`
    display: inline-block;
    font-family: Consolas;
    background-color: #e7edf1;
    border-radius: 4px;
    font-size: 14px;
    margin-right: 10px;
    margin-bottom: 10px;

    &:before {
        content: ${props => props.ml ? "'λ'" : "'TS'"};
        background-color: ${props => props.ml ? '#9756f3' : '#007acc'} ;
        color: white;
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
        padding: 0 5px;
        display: inline-block;
        min-width: 13px;
        text-align: center;
        letter-spacing: ${props => props.ts ? '-1px' : '0'}
    }
`

const MethodSignatureText = styled.span`
    padding: 0 6px;
`

const MethodExample = styled.div`
    background-color: #f0f4ff;
    border-left: 4px solid #8acefb;
    padding: 5px;
    margin: 5px 0;
`

const DataTypeMethod = method =>
    <Container>
        <MethodName>{method.name}</MethodName>
        <div>
            {method.signatureML &&
                <MethodSignature ml>
                    <MethodSignatureText>{method.signatureML}</MethodSignatureText>
                </MethodSignature>
            }
            {method.signatureTS &&
                <MethodSignature ts>
                    <MethodSignatureText>{method.signatureTS}</MethodSignatureText>
                </MethodSignature>
            }
            <div>{method.description}</div>
            <MethodExample>{method.example}</MethodExample>
        </div>
    </Container>

export default DataTypeMethod