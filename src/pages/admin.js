import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { useWeb3React } from "@web3-react/core"
import { SplitsClient } from '@0xsplits/splits-sdk'

import { orgs } from "../components/orgs"
import MyHead from "../components/head"
import { connectors } from "../components/connectors"

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/styles/Home.module.css'


export default function Admin() {
    const { account, library, activate } = useWeb3React()

    const setProvider = (type) => {
        window.localStorage.setItem("provider", type);
    };

    useEffect(() => {
        const provider = window.localStorage.getItem("provider");
        if (provider) activate(connectors[provider]);
    }, []);

    const signer = library?.getSigner?.()

    const [donations, setDonations] = useState([])

    const percentage = 10;
    const charity = 1;

    const splitsClient = new SplitsClient({
        chainId: 5,  // Goerli Ethereum Testnet
        provider: library,
        signer: signer,
    })

    useEffect(() => {
        const d = JSON.parse(window.localStorage.getItem("donations"))
        setDonations(d);
    }, [])

    // const donation = {
    //     percentage: percentage,
    //     orgName: orgs[charity].name,
    //     orgAddress: orgs[charity].address,
    //     splitContract: '0xcBBfC0F4C8EF45aBd1704d737F64d302587436d1'
    // }

    const donation = {
        percentage: 10,
        orgName: 'Project HOPE',
        orgAddress: '0x98fE6b33eb2ecf7875B3010879bFEA9d6c4CACEC',
        splitContract: '0x08412c0E9B1B0Ad232dE0473895786fA5f45313F',
        network: 'Polygon',
        amount: 60
    }

    function addEntry() {
        var d = JSON.parse(window.localStorage.getItem("donations"))
        console.log(d)
        if (typeof d === 'undefined') {
            d = []
        }
        console.log(d)
        d.push(donation)
        console.log(d)

        window.localStorage.setItem("donations", JSON.stringify(d));
        setDonations(d)
    }

    function removeLast() {
        var d = JSON.parse(window.localStorage.getItem("donations"))
        if (typeof d !== 'undefined') {
            d.pop();
        }
        window.localStorage.setItem("donations", JSON.stringify(d));
        setDonations(d)
    }

    async function getEarnings() {
        const args = {
            splitId: '0xcBBfC0F4C8EF45aBd1704d737F64d302587436d1',
            // includeActiveBalances: false
        }

        console.log('Quering...')
        const response = await splitsClient.getSplitEarnings(args)
        console.log('Querying complete.')
        console.log(response)
    }
        
    return (
        <>
            <MyHead />
            <main className={styles.main}>
                <Container>
                    <Row>{JSON.stringify(donations, null, " ")}</Row>
                    <Button onClick={addEntry}>Add entry</Button>&nbsp;&nbsp;
                    <Button onClick={removeLast}>Remove Last</Button>
                </Container>
                <Container>
                    <Button onClick={getEarnings}>Get Earnings</Button>
                </Container>

            </main>
        </>
    )
}
