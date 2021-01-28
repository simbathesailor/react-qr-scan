import * as React from 'react';

// Delete me



const { useState, useEffect, useRef} = React

const initialState = {
	isScanning: false,
	isScanSuccess: false,
	isScanFailure: false,
	data: null,
	error: '',
};

interface IUseQrCodeScan {
  qrcodeMountNodeID ?: string
  closeAfterScan ?: any
  getQrBoxDimension?: Function
}

interface IDecodedQRData {
  isScanning: Boolean
	isScanSuccess: Boolean
	isScanFailure: Boolean
	data: null | string
	error: any
}

interface IQrCodeScannerRef {
  stop : Promise<any>

}

export function useQRCodeScan({ qrcodeMountNodeID = '', closeAfterScan = true, getQrBoxDimension }: IUseQrCodeScan) {
	const [decodedQRData, setDecodedQrData] = useState<IDecodedQRData>({
		...initialState,
	});
	const html5QrCodeScannerRef  = useRef(null) as React.MutableRefObject<any>;

	// unmount logic
	useEffect(() => {
		return () => {
			if (html5QrCodeScannerRef.current) {
				html5QrCodeScannerRef.current
					?.stop()
					?.then((ignore: any) => {
						// QR Code scanning is stopped
						console.log('stopped after successful scan');
					})
					?.catch((err: any) => {
						// Stop failed, handle it.
						console.log('fails to stop after succesfull scan result ');
					});
			}
		};
	}, []);
	function startQrCode() {
		try {
			setDecodedQrData({
				...decodedQRData,
				isScanning: true,
				data: null,
				isScanSuccess: false,
				isScanFailure: false,
			});

			const elem = document.getElementById(qrcodeMountNodeID);

			if (elem && getQrBoxDimension) {
				const qrboxDimension = getQrBoxDimension();
				elem.style.width = `${qrboxDimension + 20}px`;
			}

			// @ts-ignore
			const html5qrCodeScanner = new Html5Qrcode(qrcodeMountNodeID);

			html5QrCodeScannerRef.current = html5qrCodeScanner;

			let qrbox = 250;
			if (getQrBoxDimension) {
				qrbox = getQrBoxDimension();
			}

			html5qrCodeScanner
				.start(
					// { deviceId: { exact: cameraId } },
					{ facingMode: 'environment' },

					{ fps: 100, qrbox, aspectRatio: 1.777778 },
					(qrCodeMessage: string) => {
						// do something when code is read
						// console.log('scanned qr code', qrCodeMessage);

						setDecodedQrData({
							...decodedQRData,
							isScanSuccess: true,
							isScanning: false,
							data: qrCodeMessage,
							error: '',
						});

						if (closeAfterScan) {
							html5qrCodeScanner
								.stop()
								.then((ignore: any) => {
									// QR Code scanning is stopped.
									// setIsOpenCamera(false);
									console.log('stopped after successful scan');
								})
								.catch((err: any) => {
									// Stop failed, handle it.
									console.log('fails to stop after succesfull scan result ');
								});
						}
					},
					(errorMessage: any) => {
						// Have commented this block, because, while scanning also
						// decode qr code will fail, i dont want to do anything at that moment.
						// If i set it to isScanFailure as true while i am still scanning, will lead to lots of
						// false positives. Hence better to avoid it.
						// parse error, ignore it.
						// setDecodedQrData({
						// 	...decodedQRData,
						// 	isScanSuccess: false,
						// 	isScanning: false,
						// 	isScanFailure: true,
						// 	data: null,
						// 	error: errorMessage || 'QR Code parsing failed',
						// });
					},
				)
				.catch((err: any) => {
					setDecodedQrData({
						...decodedQRData,
						isScanSuccess: false,
						isScanning: false,
						isScanFailure: true,
						data: null,
						error: err || 'QR Code parsing failed',
					});
				});
		} catch (e) {
			setDecodedQrData({
				...decodedQRData,
				isScanSuccess: false,
				isScanning: false,
				isScanFailure: true,
				data: null,
				error: e || 'QR Code parsing failed',
			});
		}
	}

	return {
		startQrCode,
		decodedQRData,
		setDecodedQrData,
	};
}

