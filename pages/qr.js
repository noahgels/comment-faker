import Head from 'next/head';
import QRCode from 'qrcode'
import { useState } from 'react';

export default function Qr() {

    const [image, setImage] = useState('image');

    QRCode.toDataURL('http://192.168.178.65:3000')
        .then((url) => {
            setImage(url);
        });



    return (
        <div>
            <Head>
                <title>QR Code - Kommentarcheck</title>
            </Head>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <img
                    src={image} alt={'Der QR Code konnte nicht generiert werden'}
                    style={{
                        width: '50%',
                        height: '50%',
                        objectFit: 'contain',
                    }}
                />
            </div>
        </div>
    )

}
