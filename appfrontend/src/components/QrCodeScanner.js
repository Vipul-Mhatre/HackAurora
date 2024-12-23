import React, { useState, useCallback } from 'react';
import { QrReader } from 'react-qr-reader';

const QrCodeScanner = ({ contract }) => {
    const [data, setData] = useState('No result');
    const [isProcessing, setIsProcessing] = useState(false);

    console.log(contract);

    const getData = useCallback(
        async (id) => {
            try {
                if (isProcessing) return; // Prevent duplicate calls
                setIsProcessing(true);
                const transaction = await contract.getProductDetails(id);
                console.log('Transaction:', transaction);
                alert('Transaction Retrieved Successfully');
            } catch (error) {
                console.error('Error fetching transaction:', error);
            } finally {
                setIsProcessing(false);
            }
        },
        [contract, isProcessing]
    );

    const handleResult = useCallback(
        (result, error) => {
            if (result) {
                const id = result?.text;
                if (id && id !== data) {
                    setData(id);
                    getData(id);
                }
            }
            if (error) {
                console.info('QR Scanner Error:', error);
            }
        },
        [data, getData]
    );

    return (
        <div>
            <QrReader
                onResult={handleResult}
                style={{ width: '100%' }}
            />
            <p>{data}</p>
        </div>
    );
};

export default QrCodeScanner;